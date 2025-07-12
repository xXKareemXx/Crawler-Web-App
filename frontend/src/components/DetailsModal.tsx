import React from 'react';
import type { CrawlResult } from '../types';

interface DetailsModalProps {
  result: CrawlResult;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ result, onClose }) => {
  const totalLinks = result.internalLinks + result.externalLinks;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
              <p className="text-sm text-gray-500">{result.url}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{result.internalLinks}</div>
              <div className="text-sm text-blue-800">Internal Links</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.externalLinks}</div>
              <div className="text-sm text-green-800">External Links</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{result.brokenLinks.length}</div>
              <div className="text-sm text-red-800">Broken Links</div>
            </div>
          </div>

          {/* Link Distribution Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Link Distribution</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Internal Links</span>
                <div className="ml-auto text-sm font-medium">{result.internalLinks}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: totalLinks > 0 ? `${(result.internalLinks / totalLinks) * 100}%` : '0%' }}
                ></div>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">External Links</span>
                <div className="ml-auto text-sm font-medium">{result.externalLinks}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: totalLinks > 0 ? `${(result.externalLinks / totalLinks) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Heading Analysis */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Heading Structure</h4>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(result.headingCounts).map(([level, count]) => (
                <div key={level} className="text-center">
                  <div className="text-lg font-bold text-gray-700">{count}</div>
                  <div className="text-xs text-gray-500 uppercase">{level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Broken Links */}
          {result.brokenLinks.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-3">Broken Links</h4>
              <div className="space-y-2">
                {result.brokenLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                    <span className="text-sm text-gray-700 truncate">{link.url}</span>
                    <span className="text-sm font-medium text-red-600">{link.statusCode}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">HTML Version:</span> {result.htmlVersion}</div>
                <div><span className="font-medium">Has Login Form:</span> {result.hasLoginForm ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Analyzed:</span> {new Date(result.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;