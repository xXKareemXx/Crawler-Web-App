import type { CrawlResult } from '../types';

// Mock API service - In real app, this would call your Go backend
export const apiService = {
  async getCrawlResults(page: number = 1, limit: number = 10, search: string = ''): Promise<{results: CrawlResult[], total: number}> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResults: CrawlResult[] = [
      {
        id: '1',
        url: 'https://example.com',
        title: 'Example Domain',
        htmlVersion: 'HTML5',
        headingCounts: { h1: 1, h2: 2, h3: 3, h4: 0, h5: 0, h6: 0 },
        internalLinks: 5,
        externalLinks: 3,
        brokenLinks: [],
        hasLoginForm: false,
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:31:00Z'
      },
      {
        id: '2',
        url: 'https://github.com',
        title: 'GitHub: Let\'s build from here',
        htmlVersion: 'HTML5',
        headingCounts: { h1: 1, h2: 4, h3: 8, h4: 2, h5: 0, h6: 0 },
        internalLinks: 25,
        externalLinks: 12,
        brokenLinks: [
          { url: 'https://github.com/broken-link', statusCode: 404, error: 'Not Found' }
        ],
        hasLoginForm: true,
        status: 'completed',
        createdAt: '2024-01-15T11:00:00Z',
        completedAt: '2024-01-15T11:02:00Z'
      },
      {
        id: '3',
        url: 'https://loading-site.com',
        title: 'Loading Site',
        htmlVersion: 'HTML5',
        headingCounts: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
        internalLinks: 0,
        externalLinks: 0,
        brokenLinks: [],
        hasLoginForm: false,
        status: 'running',
        createdAt: '2024-01-15T12:00:00Z'
      }
    ];

    // Filter by search if provided
    const filtered = search ? 
      mockResults.filter(r => r.url.toLowerCase().includes(search.toLowerCase()) || 
                            r.title.toLowerCase().includes(search.toLowerCase())) : 
      mockResults;

    return { results: filtered, total: filtered.length };
  },

  async addUrl(url: string): Promise<CrawlResult> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: Date.now().toString(),
      url,
      title: 'Processing...',
      htmlVersion: '',
      headingCounts: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
      internalLinks: 0,
      externalLinks: 0,
      brokenLinks: [],
      hasLoginForm: false,
      status: 'queued',
      createdAt: new Date().toISOString()
    };
  },

  async startCrawling(ids: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async deleteCrawlResults(ids: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};