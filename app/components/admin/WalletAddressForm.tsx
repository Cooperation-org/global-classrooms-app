'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet,
  Check,
  X,
  AlertCircle,
  Save,
  Edit3,
  Shield,
  Copy,
  ExternalLink,
  RefreshCw,
  Users,
  MapPin
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// API Integration
import { apiService } from '@/app/services/api';

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  number_of_students: number;
}

interface SchoolWallet {
  id: string;
  school: School;
  wallet_address: string;
  submitted_by: {
    id: string;
    email: string;
  };
  created_at: string;
  is_validated: boolean;
}

interface WalletAddressFormProps {
  projectId: string;
  schools: School[];
  onWalletUpdate: (schoolId: string, walletAddress: string) => void;
  onAllWalletsReady: (ready: boolean) => void;
}

const WalletAddressForm: React.FC<WalletAddressFormProps> = ({
  projectId,
  schools,
  onWalletUpdate,
  onAllWalletsReady
}) => {
  const [wallets, setWallets] = useState<SchoolWallet[]>([]);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [tempWalletAddress, setTempWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [savingWallet, setSavingWallet] = useState<string | null>(null);

  // Load wallet addresses for project schools
  useEffect(() => {
    loadWalletAddresses();
  }, [projectId]);

  // Check if all wallets are ready
  useEffect(() => {
    const allReady = schools.every(school => 
      wallets.some(wallet => 
        wallet.school.id === school.id && 
        wallet.wallet_address && 
        wallet.is_validated
      )
    );
    onAllWalletsReady(allReady);
  }, [wallets, schools, onAllWalletsReady]);

  const loadWalletAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<{ school_wallets: SchoolWallet[] }>(`/admin/rewards/project/${projectId}/wallets/`);
      if (response.success && response.data) {
        setWallets(response.data.school_wallets);
      }
    } catch (error) {
      console.error('Failed to load wallet addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateWalletAddress = (address: string): boolean => {
    if (!address) return false;
    
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleEditWallet = (schoolId: string) => {
    const existingWallet = wallets.find(w => w.school.id === schoolId);
    setEditingWallet(schoolId);
    setTempWalletAddress(existingWallet?.wallet_address || '');
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[schoolId];
      return newErrors;
    });
  };

  const handleSaveWallet = async (schoolId: string) => {
    if (!validateWalletAddress(tempWalletAddress)) {
      setValidationErrors(prev => ({
        ...prev,
        [schoolId]: 'Please enter a valid Ethereum wallet address (0x...)'
      }));
      return;
    }

    try {
      setSavingWallet(schoolId);
      const response = await apiService.post(`/admin/rewards/project/${projectId}/wallets/`, {
        wallets: [{
          school_id: schoolId,
          wallet_address: tempWalletAddress
        }]
      });

      if (response.success) {
        // Update local state
        setWallets(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(w => w.school.id === schoolId);
          
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              wallet_address: tempWalletAddress,
              is_validated: true
            };
          } else {
            const school = schools.find(s => s.id === schoolId);
            if (school) {
              updated.push({
                id: `temp-${schoolId}`,
                school,
                wallet_address: tempWalletAddress,
                submitted_by: { id: '', email: '' },
                created_at: new Date().toISOString(),
                is_validated: true
              });
            }
          }
          
          return updated;
        });

        setEditingWallet(null);
        setTempWalletAddress('');
        onWalletUpdate(schoolId, tempWalletAddress);
        
        // Clear any validation errors
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[schoolId];
          return newErrors;
        });
      }
    } catch (error) {
      setValidationErrors(prev => ({
        ...prev,
        [schoolId]: 'Failed to save wallet address. Please try again.'
      }));
    } finally {
      setSavingWallet(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
    setTempWalletAddress('');
    setValidationErrors({});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getWalletForSchool = (schoolId: string) => {
    return wallets.find(w => w.school.id === schoolId);
  };

  const getSchoolStatus = (schoolId: string) => {
    const wallet = getWalletForSchool(schoolId);
    if (!wallet || !wallet.wallet_address) return 'missing';
    if (!wallet.is_validated) return 'pending';
    return 'ready';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading wallet addresses...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Address Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Important Security Notice</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Ensure all wallet addresses are valid Ethereum addresses (starting with 0x). 
                  Double-check addresses before saving as transactions cannot be reversed.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {schools.map((school, index) => {
              const wallet = getWalletForSchool(school.id);
              const status = getSchoolStatus(school.id);
              const isEditing = editingWallet === school.id;
              const isSaving = savingWallet === school.id;
              const hasError = validationErrors[school.id];

              return (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    status === 'ready' 
                      ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                      : status === 'pending'
                      ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        status === 'ready' ? 'bg-green-500' : 
                        status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        {status === 'ready' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          school.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          {school.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {school.city}, {school.state}, {school.country}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {school.number_of_students} students
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            status === 'ready' ? 'bg-green-500' : 
                            status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm font-medium capitalize">
                            {status === 'ready' ? 'Ready for Distribution' : 
                             status === 'pending' ? 'Pending Validation' : 'Wallet Address Required'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {/* Wallet Address Display/Edit */}
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={tempWalletAddress}
                            onChange={(e) => setTempWalletAddress(e.target.value)}
                            placeholder="0x..."
                            className={`w-80 ${hasError ? 'border-red-500' : ''}`}
                          />
                          <Button
                            onClick={() => handleSaveWallet(school.id)}
                            disabled={isSaving}
                            size="sm"
                            className="gap-1"
                          >
                            {isSaving ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {wallet?.wallet_address ? (
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border">
                              <code className="text-sm font-mono">
                                {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                              </code>
                              <button
                                onClick={() => copyToClipboard(wallet.wallet_address)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => window.open(`https://etherscan.io/address/${wallet.wallet_address}`, '_blank')}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No wallet address
                            </div>
                          )}
                          
                          <Button
                            onClick={() => handleEditWallet(school.id)}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Edit3 className="w-4 h-4" />
                            {wallet?.wallet_address ? 'Edit' : 'Add'} Wallet
                          </Button>
                        </div>
                      )}

                      {/* Error Display */}
                      {hasError && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {hasError}
                        </div>
                      )}

                      {/* Wallet Info */}
                      {wallet?.wallet_address && !isEditing && (
                        <div className="text-xs text-muted-foreground text-right">
                          Added: {new Date(wallet.created_at).toLocaleDateString()}
                          {wallet.submitted_by.email && (
                            <div>By: {wallet.submitted_by.email}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletAddressForm;