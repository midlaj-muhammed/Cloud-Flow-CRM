
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import RevenueChart from '@/components/reports/RevenueChart';
import SalesPerformanceChart from '@/components/reports/SalesPerformanceChart';
import ConversionRateChart from '@/components/reports/ConversionRateChart';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  DollarSign,
  Users,
  ArrowUp,
  ArrowDown,
  Briefcase,
  CheckSquare
} from 'lucide-react';

const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 12500, profit: 5000 },
    { month: 'Feb', revenue: 15000, profit: 6000 },
    { month: 'Mar', revenue: 18000, profit: 7200 },
    { month: 'Apr', revenue: 22000, profit: 9000 },
    { month: 'May', revenue: 26000, profit: 10500 },
    { month: 'Jun', revenue: 32000, profit: 13000 }
  ]);
  
  const [salesPerformanceData, setSalesPerformanceData] = useState([
    { name: 'Q1', target: 30000, actual: 35000 },
    { name: 'Q2', target: 35000, actual: 40000 },
    { name: 'Q3', target: 40000, actual: 38000 },
    { name: 'Q4', target: 45000, actual: 50000 }
  ]);
  
  const [conversionRateData, setConversionRateData] = useState([
    { name: 'Lead to Qualified', value: 68 },
    { name: 'Qualified to Proposal', value: 45 },
    { name: 'Proposal to Negotiation', value: 30 },
    { name: 'Negotiation to Closed', value: 80 }
  ]);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalContacts: 0,
    totalDeals: 0,
    completedTasks: 0,
    winRate: 0,
    avgDealSize: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get total deals amount
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('value, stage, status')
          .eq('owner_id', user.id);
          
        if (dealsError) throw dealsError;
        
        // Get total contacts
        const { count: contactsCount, error: contactsError } = await supabase
          .from('contacts')
          .select('id', { count: 'exact' })
          .eq('owner_id', user.id);
          
        if (contactsError) throw contactsError;
        
        // Get completed tasks
        const { count: completedTasksCount, error: tasksError } = await supabase
          .from('tasks')
          .select('id', { count: 'exact' })
          .eq('owner_id', user.id)
          .eq('status', 'completed');
          
        if (tasksError) throw tasksError;
        
        // Calculate stats
        const closedWonDeals = dealsData.filter(deal => deal.stage === 'closed_won' && deal.status === 'closed').length;
        const closedDeals = dealsData.filter(deal => (deal.stage === 'closed_won' || deal.stage === 'closed_lost') && deal.status === 'closed').length;
        const winRate = closedDeals > 0 ? (closedWonDeals / closedDeals) * 100 : 0;
        
        const totalRevenue = dealsData
          .filter(deal => deal.stage === 'closed_won')
          .reduce((sum, deal) => sum + (deal.value || 0), 0);
          
        const avgDealSize = closedWonDeals > 0 ? totalRevenue / closedWonDeals : 0;
        
        setStats({
          totalRevenue,
          totalContacts: contactsCount || 0,
          totalDeals: dealsData.length,
          completedTasks: completedTasksCount || 0,
          winRate,
          avgDealSize
        });
      } catch (error: any) {
        toast({
          title: "Error fetching stats",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user, toast]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View insights and analytics about your sales and activities
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +4.3% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <ArrowUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last quarter
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.avgDealSize.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last quarter
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {format(new Date(), 'MMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <RevenueChart data={revenueData} />
                  <ConversionRateChart data={conversionRateData} />
                </div>
              </TabsContent>
              
              <TabsContent value="sales" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <SalesPerformanceChart data={salesPerformanceData} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales by Representative</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Alex Johnson', 'Sarah Williams', 'Michael Brown'].map((rep, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-cloudflow-blue-100 flex items-center justify-center text-cloudflow-blue-600">
                                {rep.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span>{rep}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${(Math.random() * 50000 + 10000).toFixed(0)}</div>
                              <div className="text-xs text-green-600">
                                +{(Math.random() * 20).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="pipeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{stage}</span>
                            <span className="text-sm text-gray-500">{Math.floor(Math.random() * 50 + 10)} deals</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                ['bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-amber-500', 'bg-green-500'][i]
                              }`}
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
