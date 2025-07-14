'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  School,
  ExternalLink,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Hash,
  User,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// API Integration
import { apiService } from '@/app/services/api';

interface AuditRecord {
  id: string;
  project: {
    id: string;
    title: string;
  };
  school: {
    id: string;
    name: string;
  };
  amount_g_dollars: string;
  recipient_wallet: string;
  transaction_hash: string;
  status: 'completed' | 'failed' | 'pending';
  approved_by: {
    id: string;
    email: string;
  };
  distributed_at: string;
  pool_address: string;
  nft_id: string;
  gas_used: string;
  block_number: string;
  retry_count?: number;
  error_message?: string;
}

interface AuditTrailResponse {
  count: number;
  results: AuditRecord[];
  next: string | null;
  previous: string | null;
}

interface AuditTrailProps {
  projectId?: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ projectId }) => {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  // Load audit trail data
  useEffect(() => {
    loadAuditTrail();
  }, [projectId, currentPage, statusFilter, dateRange]);

  const loadAuditTrail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      
      if (projectId) {
        params.append('project_id', projectId);
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            startDate = new Date(0);
        }
        
        params.append('start_date', startDate.toISOString());
      }
      
      const response = await apiService.get<AuditTrailResponse>(`/admin/rewards/audit-trail/?${params}`);
      
      if (response.success && response.data) {
        setAuditRecords(response.data.results);
        setTotalCount(response.data.count);
      } else {
        setError('Failed to load audit trail');
      }
    } catch (error) {
      setError('Error loading audit trail');
    } finally {
      setLoading(false);
    }
  };

  const exportAuditTrail = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        limit: '10000', // Export more records
      });
      
      if (projectId) {
        params.append('project_id', projectId);
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/admin/rewards/audit-trail/export/?${params}`);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit trail:', error);
    }
  };

  const filteredRecords = auditRecords.filter(record => {
    const matchesSearch = record.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.transaction_hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'failed': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Audit Trail</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete history of all reward distributions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportAuditTrail}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAuditTrail}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {auditRecords.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {auditRecords.filter(r => r.status === 'failed').length}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {auditRecords.reduce((sum, r) => sum + parseFloat(r.amount_g_dollars), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total G$ Distributed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects, schools, or transaction hashes..."
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
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Showing {filteredRecords.length} of {totalCount} records
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Records */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading audit records...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Records</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadAuditTrail} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No audit records found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No audit records available'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(record.distributed_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{record.project.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <School className="w-4 h-4" />
                              {record.school.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {record.amount_g_dollars} G$
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Approved by: {record.approved_by.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {record.transaction_hash.slice(0, 8)}...{record.transaction_hash.slice(-8)}
                            </code>
                            <button
                              onClick={() => navigator.clipboard.writeText(record.transaction_hash)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Wallet:</span>
                          <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                            {record.recipient_wallet.slice(0, 6)}...{record.recipient_wallet.slice(-4)}
                          </code>
                        </div>
                        {record.block_number && (
                          <div>
                            <span className="text-muted-foreground">Block:</span>
                            <span className="ml-2 font-mono">{record.block_number}</span>
                          </div>
                        )}
                        {record.gas_used && (
                          <div>
                            <span className="text-muted-foreground">Gas:</span>
                            <span className="ml-2 font-mono">{record.gas_used}</span>
                          </div>
                        )}
                      </div>

                      {record.error_message && (
                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-red-900 dark:text-red-100 text-sm">
                                Error Message
                              </div>
                              <div className="text-sm text-red-700 dark:text-red-300">
                                {record.error_message}
                              </div>
                              {record.retry_count && record.retry_count > 0 && (
                                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                  Retry attempts: {record.retry_count}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} records
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditTrail;