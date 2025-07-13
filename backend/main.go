package main

import (
	"log"
	"os"

	"web-crawler/database"
	"web-crawler/handlers"
	"web-crawler/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(middleware.CORSMiddleware())

	// Initialize handlers
	crawlHandler := handlers.NewCrawlHandler(db)

	// API routes
	api := r.Group("/api")
	{
		api.GET("/crawl-results", crawlHandler.GetCrawlResults)
		api.POST("/crawl-results", crawlHandler.CreateCrawlResult)
		api.GET("/crawl-results/:id", crawlHandler.GetCrawlResult)
		api.PUT("/crawl-results/:id", crawlHandler.UpdateCrawlResult)
		api.DELETE("/crawl-results/:id", crawlHandler.DeleteCrawlResult)
		api.POST("/crawl-results/bulk-delete", crawlHandler.BulkDeleteCrawlResults)
		api.POST("/crawl-results/start-crawling", crawlHandler.StartCrawling)
	}

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
