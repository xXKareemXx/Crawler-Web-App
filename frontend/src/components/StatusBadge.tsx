import React from 'react';
import { Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CrawlResult } from '../types';

interface StatusBadgeProps {
  status: CrawlResult['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: CrawlResult['status']) => {
    switch (status) {
      case 'queued':
        return { icon: Clock, text: 'Queued', className: 'bg-gray-100 text-gray-800' };
      case 'running':
        return { icon: Loader2, text: 'Running', className: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { icon: CheckCircle2, text: 'Completed', className: 'bg-green-100 text-green-800' };
      case 'error':
        return { icon: AlertCircle, text: 'Error', className: 'bg-red-100 text-red-800' };
      default:
        return { icon: Clock, text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const { icon: Icon, text, className } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon className={`w-3 h-3 mr-1 ${status === 'running' ? 'animate-spin' : ''}`} />
      {text}
    </span>
  );
};

export default StatusBadge;