import React from 'react';
import { ExternalLink, BarChart3 } from 'lucide-react';
import type { CrawlResult } from '../types';
import StatusBadge from './StatusBadge';

interface ResultsTableProps {
  results: CrawlResult[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (result: CrawlResult) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  results, 
  selectedIds, 
  onSelectionChange, 
  onRowClick 
}) => {
  // Add null/undefined checks
  const safeResults = results || [];
  const safeSelectedIds = selectedIds || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(safeResults.map(r => r.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...safeSelectedIds, id]);
    } else {
      onSelectionChange(safeSelectedIds.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={safeResults.length > 0 && safeSelectedIds.length === safeResults.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HTML Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeResults.map((result) => (
              <tr 
                key={result.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick(result)}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={safeSelectedIds.includes(result.id)}
                    onChange={(e) => handleSelectRow(result.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs">
                      {result.url}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-xs">{result.title || 'No title'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{result.htmlVersion || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {result.internalLinks || 0} internal / {result.externalLinks || 0} external
                    {result.brokenLinks && result.brokenLinks.length > 0 && (
                      <span className="ml-2 text-red-600">({result.brokenLinks.length} broken)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={result.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;