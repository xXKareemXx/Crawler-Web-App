-- Initialize the crawler_db database
CREATE DATABASE IF NOT EXISTS crawler_db;
USE crawler_db;

-- Create tables (GORM will handle this, but this is a backup)
CREATE TABLE IF NOT EXISTS crawl_results (
    id VARCHAR(36) PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    html_version VARCHAR(20),
    heading_counts TEXT,
    internal_links INT DEFAULT 0,
    external_links INT DEFAULT 0,
    broken_links TEXT,
    has_login_form BOOLEAN DEFAULT FALSE,
    status ENUM('queued', 'running', 'completed', 'error') DEFAULT 'queued',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    error TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_url (url(255)),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at)
);

-- Insert some sample data for testing
INSERT INTO crawl_results (id, url, title, html_version, heading_counts, internal_links, external_links, broken_links, has_login_form, status, created_at, completed_at) VALUES
('sample-1', 'https://example.com', 'Example Domain', 'HTML5', '{"h1":1,"h2":2,"h3":3,"h4":0,"h5":0,"h6":0}', 5, 3, '[]', FALSE, 'completed', NOW(), NOW()),
('sample-2', 'https://github.com', 'GitHub: Let\'s build from here', 'HTML5', '{"h1":1,"h2":4,"h3":8,"h4":2,"h5":0,"h6":0}', 25, 12, '[{"url":"https://github.com/broken-link","statusCode":404,"error":"Not Found"}]', TRUE, 'completed', NOW(), NOW()),
('sample-3', 'https://loading-site.com', 'Loading Site', 'HTML5', '{"h1":0,"h2":0,"h3":0,"h4":0,"h5":0,"h6":0}', 0, 0, '[]', FALSE, 'running', NOW(), NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crawl_results_url ON crawl_results(url(255));
CREATE INDEX IF NOT EXISTS idx_crawl_results_status ON crawl_results(status);
CREATE INDEX IF NOT EXISTS idx_crawl_results_created_at ON crawl_results(created_at);

-- Grant permissions
GRANT ALL PRIVILEGES ON crawler_db.* TO 'crawleruser'@'%';
FLUSH PRIVILEGES;