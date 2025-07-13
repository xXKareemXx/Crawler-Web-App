package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// CrawlStatus represents the status of a crawl operation
type CrawlStatus string

const (
	StatusQueued    CrawlStatus = "queued"
	StatusRunning   CrawlStatus = "running"
	StatusCompleted CrawlStatus = "completed"
	StatusError     CrawlStatus = "error"
)

// HeadingCounts represents the count of different heading levels
type HeadingCounts struct {
	H1 int `json:"h1"`
	H2 int `json:"h2"`
	H3 int `json:"h3"`
	H4 int `json:"h4"`
	H5 int `json:"h5"`
	H6 int `json:"h6"`
}

// BrokenLink represents a broken link found during crawling
type BrokenLink struct {
	URL        string `json:"url"`
	StatusCode int    `json:"statusCode"`
	Error      string `json:"error"`
}

// CrawlResult represents the result of a web crawl operation
type CrawlResult struct {
	ID            string         `json:"id" gorm:"primaryKey"`
	URL           string         `json:"url" gorm:"not null"`
	Title         string         `json:"title"`
	HTMLVersion   string         `json:"htmlVersion"`
	HeadingCounts string         `json:"-" gorm:"type:text"` // JSON string in DB
	InternalLinks int            `json:"internalLinks"`
	ExternalLinks int            `json:"externalLinks"`
	BrokenLinks   string         `json:"-" gorm:"type:text"` // JSON string in DB
	HasLoginForm  bool           `json:"hasLoginForm"`
	Status        CrawlStatus    `json:"status" gorm:"default:queued"`
	CreatedAt     time.Time      `json:"createdAt"`
	CompletedAt   *time.Time     `json:"completedAt"`
	Error         string         `json:"error,omitempty"`
	UpdatedAt     time.Time      `json:"-"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName returns the table name for the CrawlResult model
func (CrawlResult) TableName() string {
	return "crawl_results"
}

// GetHeadingCounts returns the heading counts as a struct
func (c *CrawlResult) GetHeadingCounts() HeadingCounts {
	var counts HeadingCounts
	if c.HeadingCounts != "" {
		json.Unmarshal([]byte(c.HeadingCounts), &counts)
	}
	return counts
}

// SetHeadingCounts sets the heading counts from a struct
func (c *CrawlResult) SetHeadingCounts(counts HeadingCounts) {
	data, _ := json.Marshal(counts)
	c.HeadingCounts = string(data)
}

// GetBrokenLinks returns the broken links as a slice
func (c *CrawlResult) GetBrokenLinks() []BrokenLink {
	var links []BrokenLink
	if c.BrokenLinks != "" {
		json.Unmarshal([]byte(c.BrokenLinks), &links)
	}
	return links
}

// SetBrokenLinks sets the broken links from a slice
func (c *CrawlResult) SetBrokenLinks(links []BrokenLink) {
	data, _ := json.Marshal(links)
	c.BrokenLinks = string(data)
}

// CrawlResultResponse represents the API response format
type CrawlResultResponse struct {
	ID            string        `json:"id"`
	URL           string        `json:"url"`
	Title         string        `json:"title"`
	HTMLVersion   string        `json:"htmlVersion"`
	HeadingCounts HeadingCounts `json:"headingCounts"`
	InternalLinks int           `json:"internalLinks"`
	ExternalLinks int           `json:"externalLinks"`
	BrokenLinks   []BrokenLink  `json:"brokenLinks"`
	HasLoginForm  bool          `json:"hasLoginForm"`
	Status        CrawlStatus   `json:"status"`
	CreatedAt     string        `json:"createdAt"`
	CompletedAt   *string       `json:"completedAt"`
	Error         string        `json:"error,omitempty"`
}

// ToResponse converts a CrawlResult to a CrawlResultResponse
func (c *CrawlResult) ToResponse() CrawlResultResponse {
	var completedAt *string
	if c.CompletedAt != nil {
		completedAtStr := c.CompletedAt.Format(time.RFC3339)
		completedAt = &completedAtStr
	}

	return CrawlResultResponse{
		ID:            c.ID,
		URL:           c.URL,
		Title:         c.Title,
		HTMLVersion:   c.HTMLVersion,
		HeadingCounts: c.GetHeadingCounts(),
		InternalLinks: c.InternalLinks,
		ExternalLinks: c.ExternalLinks,
		BrokenLinks:   c.GetBrokenLinks(),
		HasLoginForm:  c.HasLoginForm,
		Status:        c.Status,
		CreatedAt:     c.CreatedAt.Format(time.RFC3339),
		CompletedAt:   completedAt,
		Error:         c.Error,
	}
}

// CreateCrawlResultRequest represents the request to create a new crawl result
type CreateCrawlResultRequest struct {
	URL string `json:"url" binding:"required,url"`
}

// StartCrawlingRequest represents the request to start crawling
type StartCrawlingRequest struct {
	IDs []string `json:"ids" binding:"required,min=1"`
}

// BulkDeleteRequest represents the request to delete multiple crawl results
type BulkDeleteRequest struct {
	IDs []string `json:"ids" binding:"required,min=1"`
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Results []CrawlResultResponse `json:"results"`
	Total   int64                 `json:"total"`
	Page    int                   `json:"page"`
	Limit   int                   `json:"limit"`
}
