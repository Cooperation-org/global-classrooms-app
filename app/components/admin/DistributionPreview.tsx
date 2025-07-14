'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye,
  AlertCircle,
  CheckCircle,
  DollarSign,
  School,
  Users,
  Wallet,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Download,
  Calendar,
  Award,
  Target,
  Zap
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// API Integration
import { apiService } from '@/app/services/api';

interface DistributionPreviewData {
  project: {
    id: string;
    title: string;
    reward_per_participant: string;
    end_date: string;
  };
  distribution_summary: {
    total_schools: number;
    total_participants: number;
    total_amount: string;
    schools_with_wallets: number;
    schools_missing_wallets: number;
  };
  school_distributions: {
    school: {
      id: string;
      name: string;
      location?: string;
    };
    participants: number;
    reward_amount: string;
    wallet_address: string;
    has_wallet: boolean;
    ready_for_distribution: boolean;
  }[];
  validation_errors: {
    school_id: string;
    error: string;
  }[];
  pool_info?: {
    current_balance: string;
    remaining_after_distribution: string;
    monthly_limit: string;
    monthly_used: string;
  };
}

interface DistributionPreviewProps {
  projectId: string;
  onDistributionReady: (ready: boolean) => void;
  onExecute: () => void;
}

const DistributionPreview: React.FC<DistributionPreviewProps> = ({
  projectId,
  onDistributionReady,
  onExecute
}) => {
  const [previewData, setPreviewData] = useState<DistributionPreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load preview data
  useEffect(() => {
    loadPreviewData();
  }, [projectId]);

  // Check if distribution is ready
  useEffect(() => {
    if (previewData) {
      const isReady = previewData.validation_errors.length === 0 && 
                     previewData.distribution_summary.schools_missing_wallets === 0;
      onDistributionReady(isReady);
    }
  }, [previewData, onDistributionReady]);

  const loadPreviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get<DistributionPreviewData>(`/admin/rewards/project/${projectId}/preview/`);
      
      if (response.success && response.data) {
        setPreviewData(response.data);
      } else {
        setError('Failed to load distribution preview');
      }
    } catch (error) {
      setError('Failed to load distribution preview');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPreviewData();
    setRefreshing(false);
  };

  const exportPreview = () => {
    if (!previewData) return;
    
    const csvContent = [
      ['School Name', 'Participants', 'Reward Amount (G$)', 'Wallet Address', 'Status'],
      ...previewData.school_distributions.map(dist => [
        dist.school.name,
        dist.participants.toString(),
        dist.reward_amount,
        dist.wallet_address || 'Not Set',
        dist.ready_for_distribution ? 'Ready' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distribution-preview-${previewData.project.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading distribution preview...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Preview</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadPreviewData} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!previewData) {
    return null;
  }

  const { project, distribution_summary, school_distributions, validation_errors, pool_info } = previewData;
  const hasErrors = validation_errors.length > 0;
  const isReady = !hasErrors && distribution_summary.schools_missing_wallets === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Distribution Preview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Review reward distribution before execution
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportPreview}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Project End Date: {new Date(project.end_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Reward per Participant: {project.reward_per_participant} G$
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{distribution_summary.total_schools}</div>
                <div className="text-sm text-muted-foreground">Schools</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{distribution_summary.total_participants}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Distribution Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">Ready</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {distribution_summary.schools_with_wallets}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Schools ready</div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900 dark:text-yellow-100">Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {distribution_summary.schools_missing_wallets}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Missing wallets</div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Total</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {distribution_summary.total_amount}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">G$ Tokens</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pool Information */}
      {pool_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pool Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
                <div className="text-xl font-bold">{pool_info.current_balance} G$</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">After Distribution</div>
                <div className="text-xl font-bold">{pool_info.remaining_after_distribution} G$</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Monthly Limit</div>
                <div className="text-xl font-bold">{pool_info.monthly_limit} G$</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Monthly Used</div>
                <div className="text-xl font-bold">{pool_info.monthly_used} G$</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {hasErrors && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Validation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validation_errors.map((error, index) => {
                const school = school_distributions.find(s => s.school.id === error.school_id);
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-red-900 dark:text-red-100">
                        {school?.school.name || 'Unknown School'}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">
                        {error.error}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* School Distributions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5" />
            School Distributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {school_distributions.map((distribution, index) => (
              <motion.div
                key={distribution.school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  distribution.ready_for_distribution
                    ? 'border-green-200 bg-green-50 dark:bg-green-950/20'
                    : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      distribution.ready_for_distribution ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {distribution.ready_for_distribution ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        distribution.school.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{distribution.school.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {distribution.participants} participants
                        </div>
                        {distribution.school.location && (
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {distribution.school.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {distribution.reward_amount} G$
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reward Amount
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        {distribution.has_wallet ? (
                          <span className="text-sm font-medium text-green-600">
                            Wallet Ready
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-yellow-600">
                            Missing Wallet
                          </span>
                        )}
                      </div>
                      {distribution.wallet_address && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {distribution.wallet_address.slice(0, 6)}...{distribution.wallet_address.slice(-4)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isReady ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="font-medium">
                {isReady 
                  ? 'Ready for distribution' 
                  : `${distribution_summary.schools_missing_wallets} schools need wallet addresses`
                }
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Preview
              </Button>
              
              <Button
                onClick={onExecute}
                disabled={!isReady}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Execute Distribution
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributionPreview;