/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Search, Play, Pause, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { apiService } from './services/apiService';
import { CrawlResult } from './types';
import ResultsTable from './components/ResultsTable';
import UrlInput from './components/UrlInput';
import DetailsModal from './components/DetailsModal';

const WebCrawlerApp: React.FC = () => {
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<CrawlResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Load initial data
  useEffect(() => {
    loadResults();
  }, [currentPage, searchTerm]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCrawlResults(currentPage, 10, searchTerm);
      setResults(data.results);
      setTotalResults(data.total);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUrl = async (url: string) => {
    try {
      const newResult = await apiService.addUrl(url);
      setResults([newResult, ...results]);
    } catch (error) {
      console.error('Failed to add URL:', error);
    }
  };

  const handleStartCrawling = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await apiService.startCrawling(selectedIds);
      setResults(results.map(r => 
        selectedIds.includes(r.id) ? { ...r, status: 'running' as const } : r
      ));
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to start crawling:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await apiService.deleteCrawlResults(selectedIds);
      setResults(results.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to delete results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Web Crawler Dashboard</h1>
          <p className="mt-2 text-gray-600">Analyze websites and track their structure, links, and performance</p>
        </div>

        {/* URL Input */}
        <UrlInput onAddUrl={handleAddUrl} loading={loading} />

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleStartCrawling}
                disabled={selectedIds.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Crawling ({selectedIds.length})
              </button>
              <button
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.length})
              </button>
              <button
                onClick={loadResults}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search URLs or titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading results...</p>
          </div>
        ) : (
          <ResultsTable
            results={results}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={setSelectedResult}
          />
        )}

        {/* Details Modal */}
        {selectedResult && (
          <DetailsModal
            result={selectedResult}
            onClose={() => setSelectedResult(null)}
          />
        )}
      </div>
    </div>
  );
};

export default WebCrawlerApp;