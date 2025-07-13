import type { CrawlResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiService = {
  async getCrawlResults(page: number = 1, limit: number = 10, status: string = ''): Promise<{results: CrawlResult[], total: number}> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });

    const response = await fetch(`${API_BASE_URL}/crawl-results?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      results: data.results,
      total: data.total
    };
  },

  async addUrl(url: string): Promise<CrawlResult> {
    const response = await fetch(`${API_BASE_URL}/crawl-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async startCrawling(ids: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/crawl-results/start-crawling`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async deleteCrawlResults(ids: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/crawl-results/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async getCrawlResult(id: string): Promise<CrawlResult> {
    const response = await fetch(`${API_BASE_URL}/crawl-results/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};