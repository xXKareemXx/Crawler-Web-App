package handlers

import (
	"net/http"
	"strconv"
	"time"

	"web-crawler/models"
	"web-crawler/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CrawlHandler struct {
	db           *gorm.DB
	crawlService *services.CrawlService
}

func NewCrawlHandler(db *gorm.DB) *CrawlHandler {
	return &CrawlHandler{
		db:           db,
		crawlService: services.NewCrawlService(db),
	}
}

// GetCrawlResults retrieves paginated crawl results
func (h *CrawlHandler) GetCrawlResults(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	results, total, err := h.crawlService.GetCrawlResults(page, limit, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Convert to response format
	responseResults := make([]models.CrawlResultResponse, len(results))
	for i, result := range results {
		responseResults[i] = result.ToResponse()
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Results: responseResults,
		Total:   total,
		Page:    page,
		Limit:   limit,
	})
}

// CreateCrawlResult creates a new crawl result
func (h *CrawlHandler) CreateCrawlResult(c *gin.Context) {
	var req models.CreateCrawlResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	crawlResult := models.CrawlResult{
		ID:            uuid.New().String(),
		URL:           req.URL,
		Status:        models.StatusQueued,
		CreatedAt:     time.Now(),
		HeadingCounts: "{}",
		BrokenLinks:   "[]",
	}

	if err := h.db.Create(&crawlResult).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create crawl result"})
		return
	}

	c.JSON(http.StatusCreated, crawlResult.ToResponse())
}

// GetCrawlResult retrieves a specific crawl result
func (h *CrawlHandler) GetCrawlResult(c *gin.Context) {
	id := c.Param("id")

	var crawlResult models.CrawlResult
	if err := h.db.First(&crawlResult, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Crawl result not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve crawl result"})
		return
	}

	c.JSON(http.StatusOK, crawlResult.ToResponse())
}

// UpdateCrawlResult updates an existing crawl result
func (h *CrawlHandler) UpdateCrawlResult(c *gin.Context) {
	id := c.Param("id")

	var crawlResult models.CrawlResult
	if err := h.db.First(&crawlResult, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Crawl result not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve crawl result"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(&crawlResult).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update crawl result"})
		return
	}

	c.JSON(http.StatusOK, crawlResult.ToResponse())
}

// DeleteCrawlResult deletes a specific crawl result
func (h *CrawlHandler) DeleteCrawlResult(c *gin.Context) {
	id := c.Param("id")

	result := h.db.Delete(&models.CrawlResult{}, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete crawl result"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Crawl result not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Crawl result deleted successfully"})
}

// BulkDeleteCrawlResults deletes multiple crawl results
func (h *CrawlHandler) BulkDeleteCrawlResults(c *gin.Context) {
	var req models.BulkDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := h.db.Delete(&models.CrawlResult{}, "id IN ?", req.IDs)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete crawl results"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Crawl results deleted successfully",
		"deleted": result.RowsAffected,
	})
}

// StartCrawling starts crawling for specified results
func (h *CrawlHandler) StartCrawling(c *gin.Context) {
	var req models.StartCrawlingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update status to running for specified IDs
	if err := h.db.Model(&models.CrawlResult{}).
		Where("id IN ? AND status = ?", req.IDs, models.StatusQueued).
		Update("status", models.StatusRunning).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start crawling"})
		return
	}

	// Start crawling in background goroutines
	go h.crawlService.ProcessCrawlQueue(req.IDs)

	c.JSON(http.StatusOK, gin.H{
		"message": "Crawling started for specified results",
		"count":   len(req.IDs),
	})
}
