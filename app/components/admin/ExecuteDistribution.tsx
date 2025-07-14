'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,
  AlertTriangle,
  CheckCircle,
  Shield,
  Lock,
  Rocket,
  X,
  Users,
  DollarSign,
  ExternalLink,
  RefreshCw,
  Zap,
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// API Integration
import { apiService } from '@/app/services/api';

interface ExecuteDistributionProps {
  projectId: string;
  distributionData: {
    project_title: string;
    total_schools: number;
    total_participants: number;
    total_amount: string;
    school_distributions: {
      school_name: string;
      participants: number;
      reward_amount: string;
      wallet_address: string;
    }[];
  };
  onExecutionStart: (distributionId: string) => void;
  onClose: () => void;
}

interface ExecutionResult {
  success: boolean;
  distribution_id: string;
  message: string;
  blockchain_transactions: {
    school_id: string;
    school_name: string;
    tx_hash: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    amount: string;
  }[];
}

const ExecuteDistribution: React.FC<ExecuteDistributionProps> = ({
  projectId,
  distributionData,
  onExecutionStart,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<'confirm' | 'final' | 'executing' | 'completed'>('confirm');
  const [adminNotes, setAdminNotes] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requiredConfirmationText = `EXECUTE DISTRIBUTION FOR ${distributionData.project_title}`;

  const handleConfirmClick = () => {
    if (confirmationText.trim().toUpperCase() === requiredConfirmationText.toUpperCase()) {
      setCurrentStep('final');
    }
  };

  const handleExecute = async () => {
    try {
      setExecuting(true);
      setCurrentStep('executing');
      setError(null);

      const response = await apiService.post<ExecutionResult>(`/admin/rewards/project/${projectId}/distribute/`, {
        confirm_distribution: true,
        admin_notes: adminNotes.trim() || 'Distribution executed via admin panel'
      });

      if (response.success && response.data) {
        setExecutionResult(response.data);
        setCurrentStep('completed');
        onExecutionStart(response.data.distribution_id);
      } else {
        setError('Failed to execute distribution. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while executing the distribution.');
    } finally {
      setExecuting(false);
    }
  };

  const ConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Confirm Distribution Execution
        </h2>
        <p className="text-muted-foreground">
          You are about to distribute G$ tokens to {distributionData.total_schools} schools
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Distribution Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{distributionData.total_schools}</div>
              <div className="text-sm text-muted-foreground">Schools</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{distributionData.total_participants}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{distributionData.total_amount}</div>
              <div className="text-sm text-muted-foreground">Total G$</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">School Distributions:</h4>
            {distributionData.school_distributions.map((dist, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{dist.school_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {dist.participants} participants
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{dist.reward_amount} G$</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {dist.wallet_address.slice(0, 6)}...{dist.wallet_address.slice(-4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Admin Notes (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add any notes about this distribution..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <Shield className="w-5 h-5" />
            Security Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Important Warning
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This action is irreversible. Once executed, the blockchain transactions cannot be undone.
                    Please ensure all wallet addresses are correct before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type the following to confirm: <code className="bg-muted px-2 py-1 rounded text-sm">
                  {requiredConfirmationText}
                </code>
              </label>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type the confirmation text..."
                className="font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleConfirmClick}
          disabled={confirmationText.trim().toUpperCase() !== requiredConfirmationText.toUpperCase()}
          className="gap-2"
        >
          <Shield className="w-4 h-4" />
          Proceed to Final Confirmation
        </Button>
      </div>
    </div>
  );

  const FinalStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Final Confirmation
        </h2>
        <p className="text-muted-foreground">
          Last chance to review before executing the distribution
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Project:</span>
              <span>{distributionData.project_title}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-primary">{distributionData.total_amount} G$</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Recipients:</span>
              <span>{distributionData.total_schools} schools ({distributionData.total_participants} participants)</span>
            </div>
            {adminNotes && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-medium mb-2">Admin Notes:</div>
                <div className="text-sm text-muted-foreground">{adminNotes}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
              Final Warning
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              You are about to execute irreversible blockchain transactions. 
              This action cannot be undone once started.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('confirm')}>
          <X className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <Button
          onClick={handleExecute}
          disabled={executing}
          className="gap-2 bg-red-600 hover:bg-red-700"
        >
          {executing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Rocket className="w-4 h-4" />
          )}
          Execute Distribution
        </Button>
      </div>
    </div>
  );

  const ExecutingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Executing Distribution
        </h2>
        <p className="text-muted-foreground">
          Please wait while we process the blockchain transactions...
        </p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium">Processing transactions...</span>
            </div>
            <div className="text-sm text-muted-foreground">
              This may take a few minutes. Please do not close this window.
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const CompletedStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Distribution Initiated Successfully!
        </h2>
        <p className="text-muted-foreground">
          Blockchain transactions have been submitted and are being processed
        </p>
      </div>

      {executionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                  Distribution ID: {executionResult.distribution_id}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {executionResult.message}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Blockchain Transactions:</h4>
                {executionResult.blockchain_transactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{tx.school_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.amount} G$ • {tx.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {tx.tx_hash.slice(0, 8)}...{tx.tx_hash.slice(-8)}
                      </code>
                      <button
                        onClick={() => window.open(`https://etherscan.io/tx/${tx.tx_hash}`, '_blank')}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button onClick={onClose} className="gap-2">
          <CheckCircle className="w-4 h-4" />
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'confirm' && <ConfirmationStep />}
              {currentStep === 'final' && <FinalStep />}
              {currentStep === 'executing' && <ExecutingStep />}
              {currentStep === 'completed' && <CompletedStep />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExecuteDistribution;