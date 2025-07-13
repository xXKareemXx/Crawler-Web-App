package services

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"web-crawler/models"

	"gorm.io/gorm"
)

type CrawlService struct {
	db *gorm.DB
}

func NewCrawlService(db *gorm.DB) *CrawlService {
	return &CrawlService{db: db}
}

// GetCrawlResults retrieves paginated crawl results with optional status filter
func (s *CrawlService) GetCrawlResults(page, limit int, status string) ([]models.CrawlResult, int64, error) {
	var results []models.CrawlResult
	var total int64

	query := s.db.Model(&models.CrawlResult{})

	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * limit
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&results).Error; err != nil {
		return nil, 0, err
	}

	return results, total, nil
}

// ProcessCrawlQueue processes crawl requests in the background
func (s *CrawlService) ProcessCrawlQueue(ids []string) {
	for _, id := range ids {
		go s.processSingleCrawl(id)
	}
}

// processSingleCrawl processes a single crawl request
func (s *CrawlService) processSingleCrawl(id string) {
	var crawlResult models.CrawlResult
	if err := s.db.First(&crawlResult, "id = ?", id).Error; err != nil {
		return
	}

	// Update status to running
	s.db.Model(&crawlResult).Update("status", models.StatusRunning)

	// Perform the actual crawling
	if err := s.crawlWebsite(&crawlResult); err != nil {
		// Update with error status
		s.db.Model(&crawlResult).Updates(map[string]interface{}{
			"status":       models.StatusError,
			"error":        err.Error(),
			"completed_at": time.Now(),
		})
		return
	}

	// Update with completed status
	now := time.Now()
	crawlResult.Status = models.StatusCompleted
	crawlResult.CompletedAt = &now
	s.db.Save(&crawlResult)
}

// crawlWebsite performs the actual website crawling
func (s *CrawlService) crawlWebsite(result *models.CrawlResult) error {
	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Make HTTP request
	resp, err := client.Get(result.URL)
	if err != nil {
		return fmt.Errorf("failed to fetch URL: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	html := string(body)

	// Extract title
	result.Title = extractTitle(html)

	// Extract HTML version
	result.HTMLVersion = extractHTMLVersion(html)

	// Count headings
	headingCounts := countHeadings(html)
	result.SetHeadingCounts(headingCounts)

	// Count links
	internalLinks, externalLinks := countLinks(html, result.URL)
	result.InternalLinks = internalLinks
	result.ExternalLinks = externalLinks

	// Check for broken links (simplified - just check a few)
	brokenLinks := checkBrokenLinks(html, result.URL)
	result.SetBrokenLinks(brokenLinks)

	// Check for login form
	result.HasLoginForm = hasLoginForm(html)

	return nil
}

// extractTitle extracts the title from HTML
func extractTitle(html string) string {
	re := regexp.MustCompile(`<title[^>]*>([^<]*)</title>`)
	matches := re.FindStringSubmatch(html)
	if len(matches) > 1 {
		return strings.TrimSpace(matches[1])
	}
	return ""
}

// extractHTMLVersion extracts HTML version from DOCTYPE
func extractHTMLVersion(html string) string {
	if strings.Contains(strings.ToLower(html), "<!doctype html>") {
		return "HTML5"
	}
	if strings.Contains(strings.ToLower(html), "html 4.01") {
		return "HTML 4.01"
	}
	if strings.Contains(strings.ToLower(html), "xhtml") {
		return "XHTML"
	}
	return "Unknown"
}

// countHeadings counts different heading levels
func countHeadings(html string) models.HeadingCounts {
	counts := models.HeadingCounts{}

	for i := 1; i <= 6; i++ {
		pattern := fmt.Sprintf(`<h%d[^>]*>`, i)
		re := regexp.MustCompile(pattern)
		matches := re.FindAllString(html, -1)

		switch i {
		case 1:
			counts.H1 = len(matches)
		case 2:
			counts.H2 = len(matches)
		case 3:
			counts.H3 = len(matches)
		case 4:
			counts.H4 = len(matches)
		case 5:
			counts.H5 = len(matches)
		case 6:
			counts.H6 = len(matches)
		}
	}

	return counts
}

// countLinks counts internal and external links
func countLinks(html, baseURL string) (int, int) {
	re := regexp.MustCompile(`<a[^>]*href="([^"]*)"`)
	matches := re.FindAllStringSubmatch(html, -1)

	internal := 0
	external := 0

	for _, match := range matches {
		if len(match) > 1 {
			href := match[1]
			if strings.HasPrefix(href, "http") && !strings.Contains(href, baseURL) {
				external++
			} else if strings.HasPrefix(href, "/") || strings.Contains(href, baseURL) {
				internal++
			}
		}
	}

	return internal, external
}

// checkBrokenLinks checks for broken links (simplified implementation)
func checkBrokenLinks(html, baseURL string) []models.BrokenLink {
	var brokenLinks []models.BrokenLink

	re := regexp.MustCompile(`<a[^>]*href="([^"]*)"`)
	matches := re.FindAllStringSubmatch(html, -1)

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	// Check only first 5 links to avoid long processing time
	checked := 0
	for _, match := range matches {
		if checked >= 5 {
			break
		}

		if len(match) > 1 {
			href := match[1]
			if strings.HasPrefix(href, "http") {
				resp, err := client.Head(href)
				if err != nil || resp.StatusCode >= 400 {
					statusCode := 0
					if resp != nil {
						statusCode = resp.StatusCode
					}

					brokenLinks = append(brokenLinks, models.BrokenLink{
						URL:        href,
						StatusCode: statusCode,
						Error:      err.Error(),
					})
				}
				checked++
			}
		}
	}

	return brokenLinks
}

// hasLoginForm checks if the page contains a login form
func hasLoginForm(html string) bool {
	// Look for common login form patterns
	patterns := []string{
		`type="password"`,
		`name="password"`,
		`id="password"`,
		`name="login"`,
		`id="login"`,
		`class="login"`,
	}

	lowerHTML := strings.ToLower(html)
	for _, pattern := range patterns {
		if strings.Contains(lowerHTML, strings.ToLower(pattern)) {
			return true
		}
	}

	return false
}
