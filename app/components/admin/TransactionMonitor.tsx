'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Zap,
  TrendingUp,
  Copy,
  Download,
  Eye,
  Filter,
  Search,
  Hash,
  DollarSign,
  School,
  Calendar,
  AlertTriangle
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// API Integration
import { apiService } from '@/app/services/api';

interface Transaction {
  id: string;
  school_name: string;
  wallet_address: string;
  amount: string;
  tx_hash: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  gas_used: string;
  block_number: string;
  timestamp: string;
  explorer_url: string;
  retry_count?: number;
  error_message?: string;
}

interface DistributionStatus {
  distribution_id: string;
  overall_status: 'pending' | 'processing' | 'completed' | 'failed';
  total_transactions: number;
  completed_transactions: number;
  failed_transactions: number;
  processing_transactions: number;
  pending_transactions: number;
  transactions: Transaction[];
  created_at: string;
  updated_at: string;
}

interface TransactionMonitorProps {
  distributionId: string;
  onComplete?: (status: DistributionStatus) => void;
}

const TransactionMonitor: React.FC<TransactionMonitorProps> = ({
  distributionId,
  onComplete
}) => {
  const [status, setStatus] = useState<DistributionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load distribution status
  useEffect(() => {
    loadDistributionStatus();
  }, [distributionId]);

  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh && status?.overall_status !== 'completed' && status?.overall_status !== 'failed') {
      const interval = setInterval(() => {
        loadDistributionStatus();
      }, 5000); // Refresh every 5 seconds
      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, status?.overall_status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const loadDistributionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get<DistributionStatus>(`/admin/rewards/distribution/${distributionId}/status/`);
      
      if (response.success && response.data) {
        setStatus(response.data);
        
        // Call onComplete if distribution is finished
        if (onComplete && (response.data.overall_status === 'completed' || response.data.overall_status === 'failed')) {
          onComplete(response.data);
        }
      } else {
        setError('Failed to load distribution status');
      }
    } catch (error) {
      setError('Error loading distribution status');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportTransactions = () => {
    if (!status) return;
    
    const csvContent = [
      ['School', 'Amount', 'Status', 'Transaction Hash', 'Block Number', 'Gas Used', 'Timestamp'],
      ...status.transactions.map(tx => [
        tx.school_name,
        tx.amount,
        tx.status,
        tx.tx_hash,
        tx.block_number || '-',
        tx.gas_used || '-',
        new Date(tx.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distribution-${distributionId}-transactions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = () => {
    if (!status) return 0;
    return (status.completed_transactions / status.total_transactions) * 100;
  };

  const filteredTransactions = status?.transactions.filter(tx => {
    const matchesSearch = tx.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.tx_hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (loading && !status) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading transaction monitor...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !status) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Monitor</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadDistributionStatus} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Transaction Monitor</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time blockchain transaction monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportTransactions}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`gap-2 ${autoRefresh ? 'bg-primary/10' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Distribution Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{status.total_transactions}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{status.completed_transactions}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{status.processing_transactions}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Processing</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{status.pending_transactions}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{status.failed_transactions}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Overall Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={getStatusColor(status.overall_status)}>
                {getStatusIcon(status.overall_status)}
              </div>
              <span className="font-medium capitalize">
                {status.overall_status}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(status.updated_at).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by school name or transaction hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    transaction.status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-950/20' :
                    transaction.status === 'failed' ? 'border-red-200 bg-red-50 dark:bg-red-950/20' :
                    transaction.status === 'processing' ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' :
                    'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        transaction.status === 'completed' ? 'bg-green-500' :
                        transaction.status === 'failed' ? 'bg-red-500' :
                        transaction.status === 'processing' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}>
                        {getStatusIcon(transaction.status)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{transaction.school_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {transaction.amount} G$
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(transaction.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-500' :
                            transaction.status === 'failed' ? 'bg-red-500' :
                            transaction.status === 'processing' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                          <span className="text-sm font-medium capitalize">
                            {transaction.status}
                          </span>
                          {transaction.retry_count && transaction.retry_count > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (Retry #{transaction.retry_count})
                            </span>
                          )}
                        </div>

                        {transaction.error_message && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-700 dark:text-red-300">
                              {transaction.error_message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {/* Transaction Hash */}
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <code className="text-sm font-mono">
                          {transaction.tx_hash.slice(0, 8)}...{transaction.tx_hash.slice(-8)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(transaction.tx_hash)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => window.open(transaction.explorer_url, '_blank')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Block Details */}
                      {transaction.block_number && (
                        <div className="text-right text-sm text-muted-foreground">
                          <div>Block: {transaction.block_number}</div>
                          {transaction.gas_used && (
                            <div>Gas: {transaction.gas_used}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <Eye className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter' 
                    : 'No transactions available'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionMonitor;