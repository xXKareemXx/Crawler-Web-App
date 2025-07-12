// TypeScript Types - Define data structures
export interface CrawlResult {
  id: string;
  url: string;
  title: string;
  htmlVersion: string;
  headingCounts: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  internalLinks: number;
  externalLinks: number;
  brokenLinks: BrokenLink[];
  hasLoginForm: boolean;
  status: 'queued' | 'running' | 'completed' | 'error';
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface BrokenLink {
  url: string;
  statusCode: number;
  error: string;
}