'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Award,
  School,
  Users,
  Wallet,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Download,
  RefreshCw,
  Eye,
  Settings,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  FileText,
  Activity
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// API Integration
import { apiService, fetchProjects } from '@/app/services/api';

// Sub-components
import WalletAddressForm from './WalletAddressForm';
import DistributionPreview from './DistributionPreview';
import ExecuteDistribution from './ExecuteDistribution';
import TransactionMonitor from './TransactionMonitor';
import AuditTrail from './AuditTrail';

// Types
interface RewardProject {
  id: string;
  title: string;
  lead_school: {
    id: string;
    name: string;
  };
  participating_schools: {
    id: string;
    name: string;
  }[];
  reward_per_participant: string;
  estimated_participants_count: number;
  estimated_total_cost: string;
  end_date: string;
  status: 'completed' | 'ready' | 'pending';
  rewards_enabled: boolean;
  rewards_distributed: boolean;
}

interface SchoolWallet {
  id: string;
  school: {
    id: string;
    name: string;
  };
  wallet_address: string;
  submitted_by: {
    id: string;
    email: string;
  };
  created_at: string;
}

interface DistributionPreview {
  project: {
    id: string;
    title: string;
    reward_per_participant: string;
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
}

interface DashboardStats {
  summary: {
    total_projects_eligible: number;
    total_rewards_distributed: string;
    pending_distributions: number;
    total_schools_rewarded: number;
    current_month_distributions: string;
  };
  recent_distributions: {
    id: string;
    project_title: string;
    schools_count: number;
    total_amount: string;
    status: string;
    distributed_at: string;
  }[];
  pool_info: {
    pool_address: string;
    balance: string;
    max_monthly_distribution: string;
  };
}

type ViewMode = 'dashboard' | 'projects' | 'distribution' | 'monitor' | 'audit';

const RewardDistributionPanel: React.FC = () => {
  // State Management
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedProject, setSelectedProject] = useState<RewardProject | null>(null);
  const [projects, setProjects] = useState<RewardProject[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [distributionPreview, setDistributionPreview] = useState<DistributionPreview | null>(null);
  const [schoolWallets, setSchoolWallets] = useState<SchoolWallet[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeDistributionId, setActiveDistributionId] = useState<string | null>(null);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [walletsReady, setWalletsReady] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load projects when switching to projects view
  useEffect(() => {
    if (currentView === 'projects' && !projectsLoading) {
      loadEligibleProjects();
    }
  }, [currentView]);

  const loadDashboardData = async () => {
    // Prevent multiple simultaneous calls
    if (dashboardLoading) {
      console.log('Dashboard already loading, skipping...');
      return;
    }
    
    try {
      setDashboardLoading(true);
      setError(null);
      
      console.log('Loading dashboard data...');
      
      // Use the same fetchProjects function as the projects page  
      const projectsResponse = await fetchProjects(1, 10);
      
      console.log('Projects response:', projectsResponse);
      
      if (projectsResponse && projectsResponse.results) {
        const allProjects = projectsResponse.results;
        
        console.log('All projects:', allProjects.length);
        
        // Filter completed projects for rewards
        const completedProjects = allProjects.filter(p => p.status === 'completed');
        const eligibleProjects = completedProjects.filter(p => p.offer_rewards !== false);
        
        console.log('Completed projects:', completedProjects.length);
        console.log('Eligible projects:', eligibleProjects.length);
        
        // Calculate basic statistics from real data
        const totalSchools = new Set(allProjects.map(p => p.lead_school).filter(Boolean)).size;
        const totalParticipants = allProjects.reduce((sum, p) => sum + (parseInt(p.participating_schools_count) || 0), 0);
        
        // Create dashboard stats from real backend data
        const dashboardData: DashboardStats = {
          summary: {
            total_projects_eligible: eligibleProjects.length,
            total_rewards_distributed: "0.00", // Will be calculated from actual distributions
            pending_distributions: eligibleProjects.length, // All eligible projects are pending
            total_schools_rewarded: 0, // None distributed yet
            current_month_distributions: "0.00"
          },
          recent_distributions: [], // No distributions yet
          pool_info: {
            pool_address: "0xf3d629a2c198fC91d7D3F18217684166C83C7312",
            balance: "25,000.00", // Default pool balance
            max_monthly_distribution: "10,000.00"
          }
        };
        
        console.log('Dashboard data:', dashboardData);
        setDashboardStats(dashboardData);
      } else {
        console.error('No projects response or results');
        setError('Unable to load dashboard statistics. Please check your connection and try again.');
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setError('There was a problem loading the dashboard. Please refresh the page or contact support if the issue persists.');
    } finally {
      setDashboardLoading(false);
    }
  };

  // Load Eligible Projects
  const loadEligibleProjects = async () => {
    // Prevent multiple simultaneous calls
    if (projectsLoading) {
      console.log('Projects already loading, skipping...');
      return;
    }
    
    try {
      setProjectsLoading(true);
      setError(null);
      
      console.log('Loading eligible projects...');
      
      // Use the same fetchProjects function as the projects page  
      const projectsResponse = await fetchProjects(1, 10);
      
      console.log('Projects response for rewards:', projectsResponse);
      
      if (projectsResponse && projectsResponse.results) {
        // Filter and transform backend projects into reward projects format
        const allProjects = projectsResponse.results;
        const completedProjects = allProjects.filter(p => p.status === 'completed');
        const eligibleProjects = completedProjects.filter(p => p.offer_rewards !== false);
        
        console.log('Eligible projects for rewards:', eligibleProjects.length);
        
        // Transform to reward project format
        const rewardProjects = eligibleProjects.map((project, index) => ({
          id: project.id,
          title: project.title,
          lead_school: {
            id: project.lead_school || `school-${index}`,
            name: project.lead_school_name || 'Unknown School'
          },
          participating_schools: [], // Will be populated from backend when available
          reward_per_participant: '30.00', // Default reward amount
          estimated_participants_count: Math.max(1, parseInt(project.participating_schools_count) || 5),
          estimated_total_cost: `${Math.max(1, parseInt(project.participating_schools_count) || 5) * 30}`,
          end_date: project.end_date || '2024-01-30',
          status: 'completed' as const,
          rewards_enabled: project.offer_rewards !== false,
          rewards_distributed: false
        }));
        
        console.log('Transformed reward projects:', rewardProjects);
        setProjects(rewardProjects);
      } else {
        console.error('No projects response or results for rewards');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Unable to load eligible projects. This might be due to a network issue or the server being temporarily unavailable. Please try refreshing the page.');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Navigation
  const NavigationBar = () => (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('dashboard')}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'projects' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('projects')}
              className="gap-2"
            >
              <Award className="w-4 h-4" />
              Projects
            </Button>
            <Button
              variant={currentView === 'monitor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('monitor')}
              className="gap-2"
            >
              <Activity className="w-4 h-4" />
              Monitor
            </Button>
            <Button
              variant={currentView === 'audit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('audit')}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Audit Trail
            </Button>
          </div>
          {currentView === 'distribution' && selectedProject && (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentView('projects');
                setSelectedProject(null);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Dashboard View
  const DashboardView = () => {
    console.log('Rendering DashboardView, dashboardStats:', dashboardStats);
    
    // Show loading state if dashboard is still loading
    if (dashboardLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
          <span className="text-lg font-medium text-emerald-700">Loading dashboard...</span>
          <span className="text-sm text-emerald-600 mt-2">Calculating reward statistics</span>
        </div>
      );
    }

    return (
      <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎉 Reward Distribution Hub</h1>
              <p className="text-blue-100 text-lg">
                Distribute G$ tokens to amazing schools making environmental impact
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl opacity-20">🏆</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 bg-blue-50/50" onClick={() => setCurrentView('projects')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Start Distribution</h3>
            <p className="text-sm text-muted-foreground">Begin a new reward distribution process</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 bg-purple-50/50" onClick={() => setCurrentView('monitor')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Monitor</h3>
            <p className="text-sm text-muted-foreground">Track active distributions and transactions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 bg-green-50/50" onClick={() => setCurrentView('audit')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Audit Trail</h3>
            <p className="text-sm text-muted-foreground">Review complete distribution history</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Eligible Projects</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{dashboardStats?.summary.total_projects_eligible || 0}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Ready for distribution</p>
              </div>
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Distributed</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{dashboardStats?.summary.total_rewards_distributed || '0'}</p>
                <p className="text-xs text-green-500 dark:text-green-400 mt-1">G$ tokens sent</p>
              </div>
              <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{dashboardStats?.summary.pending_distributions || 0}</p>
                <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">Awaiting distribution</p>
              </div>
              <div className="h-12 w-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Schools Rewarded</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{dashboardStats?.summary.total_schools_rewarded || 0}</p>
                <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">Impact delivered</p>
              </div>
              <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pool Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Pool Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Pool Balance</p>
              <p className="text-xl font-bold">{dashboardStats?.pool_info.balance || '0'} G$</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly Limit</p>
              <p className="text-xl font-bold">{dashboardStats?.pool_info.max_monthly_distribution || '0'} G$</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-bold">{dashboardStats?.summary.current_month_distributions || '0'} G$</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Distributions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Distributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardStats?.recent_distributions && dashboardStats.recent_distributions.length > 0 ? (
              dashboardStats.recent_distributions.map((dist) => (
                <div key={dist.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-lg border border-emerald-200">
                  <div>
                    <p className="font-medium text-emerald-800">{dist.project_title}</p>
                    <p className="text-sm text-emerald-600">
                      {dist.schools_count} schools • {new Date(dist.distributed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">{dist.total_amount} G$</p>
                    <p className="text-sm text-emerald-600 capitalize">{dist.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent distributions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

  // Project Selection View
  const ProjectSelectionView = () => {
    const filteredProjects = projects.filter(project => {
      if (!project || !project.title) return false;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Show loading state if projects are still loading
    if (projectsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
          <span className="text-lg font-medium text-emerald-700">Loading projects...</span>
          <span className="text-sm text-emerald-600 mt-2">Finding eligible projects for rewards</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Select Project for Reward Distribution</h2>
            <p className="text-muted-foreground">Choose a completed project to distribute G$ tokens to participating schools</p>
            <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700">
                <strong>💡 How it works:</strong> Select a project below to start the reward distribution process. 
                You'll be guided through setting up wallet addresses and confirming the distribution.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <School className="w-4 h-4" />
                        {(project.participating_schools?.length || 0) + 1} schools
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.estimated_participants_count} participants
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{project.estimated_total_cost} G$</p>
                    <p className="text-sm text-emerald-600/80">Total Reward</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'ready' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <span className={`text-sm capitalize ${
                      project.status === 'completed' ? 'text-green-700' :
                      project.status === 'ready' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>{project.status}</span>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentView('distribution');
                    }}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Award className="w-4 h-4" />
                    Distribute Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No eligible projects found</h3>
              <p className="text-muted-foreground">
                No projects are currently eligible for reward distribution
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Distribution View
  const DistributionView = () => {
    if (!selectedProject) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Distribute Rewards: {selectedProject.title}
            </CardTitle>
          </CardHeader>
        </Card>

        <WalletAddressForm
          projectId={selectedProject.id}
          schools={selectedProject.participating_schools.concat([selectedProject.lead_school]).map(school => ({
            id: school.id,
            name: school.name,
            city: '',
            state: '',
            country: '',
            number_of_students: 0
          }))}
          onWalletUpdate={(schoolId, walletAddress) => {
            // Update local state when wallet addresses change
            console.log('Wallet updated for school:', schoolId, 'address:', walletAddress);
          }}
          onAllWalletsReady={setWalletsReady}
        />

        {walletsReady && (
          <DistributionPreview
            projectId={selectedProject.id}
            onDistributionReady={setPreviewReady}
            onExecute={() => setShowExecuteModal(true)}
          />
        )}

        {showExecuteModal && previewReady && (
          <ExecuteDistribution
            projectId={selectedProject.id}
            distributionData={{
              project_title: selectedProject.title,
              total_schools: selectedProject.participating_schools.length + 1,
              total_participants: selectedProject.estimated_participants_count,
              total_amount: selectedProject.estimated_total_cost,
              school_distributions: selectedProject.participating_schools.concat([selectedProject.lead_school]).map(school => ({
                school_name: school.name,
                participants: Math.floor(selectedProject.estimated_participants_count / (selectedProject.participating_schools.length + 1)),
                reward_amount: selectedProject.reward_per_participant,
                wallet_address: '' // This would be populated from the form
              }))
            }}
            onExecutionStart={(distributionId) => {
              setActiveDistributionId(distributionId);
              setShowExecuteModal(false);
              setCurrentView('monitor');
            }}
            onClose={() => setShowExecuteModal(false)}
          />
        )}
      </div>
    );
  };

  // Monitor View
  const MonitorView = () => {
    if (!activeDistributionId) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Active Distribution</h3>
            <p className="text-muted-foreground">Start a new distribution to monitor transactions</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <TransactionMonitor
        distributionId={activeDistributionId}
        onComplete={() => {
          // Handle completion
        }}
      />
    );
  };

  // Audit View
  const AuditView = () => (
    <AuditTrail projectId={selectedProject?.id} />
  );

  // Main Component Render
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <NavigationBar />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {(dashboardLoading || projectsLoading) && (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
                <span className="text-lg font-medium text-emerald-700">Loading reward data...</span>
                <span className="text-sm text-emerald-600 mt-2">This may take a moment</span>
              </div>
            )}

            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium mb-2">Something went wrong</p>
                      <p className="text-red-700 text-sm mb-4">{error}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.reload()}
                          className="border-red-200 text-red-700 hover:bg-red-100"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Page
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setError(null)}
                          className="border-red-200 text-red-700 hover:bg-red-100"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!dashboardLoading && !projectsLoading && !error && (
              <>
                {currentView === 'dashboard' && <DashboardView />}
                {currentView === 'projects' && <ProjectSelectionView />}
                {currentView === 'distribution' && <DistributionView />}
                {currentView === 'monitor' && <MonitorView />}
                {currentView === 'audit' && <AuditView />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RewardDistributionPanel;