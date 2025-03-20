import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart as BarChartIcon, 
  Users, 
  CreditCard, 
  CheckCircle,
  Calendar, 
  Mail, 
  Phone, 
  Clock, 
  Plus, 
  MoreVertical,
  TrendingUp,
  ArrowUpRight,
  HelpCircle,
  RefreshCw,
  DollarSign,
  Target,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface DashboardContentProps {
  profile: any;
}

const DashboardContent = ({ profile }: DashboardContentProps) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    completedTasks: 0,
    upcomingMeetings: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [yearToDateData, setYearToDateData] = useState([]);
  const [dealsByStageData, setDealsByStageData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (contactsError) throw contactsError;
      setContacts(contactsData || []);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(4);
        
      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
      
      // Fetch deals
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
        
      if (dealsError) throw dealsError;
      setDeals(dealsData || []);
      
      // Calculate stats
      const { data: contactsCount, error: contactsCountError } = await supabase
        .from('contacts')
        .select('id', { count: 'exact' });
        
      if (contactsCountError) throw contactsCountError;
      
      const { data: activeDealsSum, error: activeDealsError } = await supabase
        .from('deals')
        .select('value')
        .eq('status', 'open');
        
      if (activeDealsError) throw activeDealsError;
      
      const { data: completedTasksCount, error: completedTasksError } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' })
        .eq('status', 'completed');
        
      if (completedTasksError) throw completedTasksError;
      
      const { data: upcomingTasks, error: upcomingTasksError } = await supabase
        .from('tasks')
        .select('id')
        .gte('due_date', new Date().toISOString())
        .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .eq('status', 'pending');
        
      if (upcomingTasksError) throw upcomingTasksError;
      
      setStats({
        totalContacts: contactsCount?.length || 0,
        activeDeals: activeDealsSum?.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0) || 0,
        completedTasks: completedTasksCount?.length || 0,
        upcomingMeetings: upcomingTasks?.length || 0
      });

      // Generate example sales data for visualization
      generateSalesData();
      generateYearToDateData();
      
      // Process deals by stage for pie chart
      const stageData = [
        { name: 'Lead', value: deals.filter((d: any) => d.stage === 'lead').length, fill: '#9b87f5' },
        { name: 'Qualified', value: deals.filter((d: any) => d.stage === 'qualified').length, fill: '#7E69AB' },
        { name: 'Proposal', value: deals.filter((d: any) => d.stage === 'proposal').length, fill: '#0EA5E9' },
        { name: 'Negotiation', value: deals.filter((d: any) => d.stage === 'negotiation').length, fill: '#F97316' },
        { name: 'Closed', value: deals.filter((d: any) => d.stage === 'closed_won').length, fill: '#10B981' }
      ];
      setDealsByStageData(stageData);
      
    } catch (error: any) {
      toast({
        title: "Error loading dashboard data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map(month => {
      const revenue = Math.floor(Math.random() * 50000) + 20000;
      const profit = Math.floor(revenue * (Math.random() * 0.3 + 0.2)); // 20-50% profit margin
      const target = Math.floor(revenue * (Math.random() * 0.2 + 0.9)); // 90-110% of revenue
      
      return {
        name: month,
        revenue: revenue,
        profit: profit,
        target: target
      };
    });
    setSalesData(data);
  };

  const generateYearToDateData = () => {
    const data = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    
    for (let i = 0; i <= currentMonth; i++) {
      const date = new Date(now.getFullYear(), i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      data.push({
        name: monthName,
        value: Math.floor(Math.random() * 80000) + 40000,
      });
    }
    
    setYearToDateData(data);
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, [toast]);

  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: "Dashboard refreshed",
      description: "Latest data has been loaded"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date < tomorrow && date >= today) {
      return 'Today';
    } else if (date < new Date(today.setDate(today.getDate() + 2)) && date >= tomorrow) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let message = "Good ";
    
    if (hours < 12) message += "morning";
    else if (hours < 18) message += "afternoon";
    else message += "evening";
    
    return message + ", " + (profile?.first_name || "there") + "!";
  };

  const COLORS = ['#9b87f5', '#7E69AB', '#0EA5E9', '#F97316', '#10B981'];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
            <p className="opacity-90">Here's what's happening with your business today</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              disabled={refreshing}
            >
              <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View dashboard help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-cloudflow-gray-100 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Tasks & Meetings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Sales Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Contacts", value: stats.totalContacts, change: "+8.4%", icon: Users, color: "bg-[#D6BCFA] text-[#9b87f5]", link: "/contacts", trend: "up" },
              { title: "Active Deals", value: `$${stats.activeDeals.toFixed(0)}`, change: "+12.3%", icon: CreditCard, color: "bg-[#F2FCE2] text-[#10B981]", link: "/sales-pipeline", trend: "up" },
              { title: "Completed Tasks", value: stats.completedTasks, change: "+7.2%", icon: CheckCircle, color: "bg-[#D3E4FD] text-[#0EA5E9]", link: "/tasks", trend: "up" },
              { title: "Upcoming Meetings", value: stats.upcomingMeetings, change: "+2", icon: Calendar, color: "bg-amber-100 text-amber-600", link: "/tasks", trend: "up" }
            ].map((item, index) => (
              <Link to={item.link} key={index} className="block group">
                <Card className="border border-cloudflow-gray-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 hover:border-[#9b87f5]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-cloudflow-gray-500">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold group-hover:text-[#9b87f5] transition-colors">{item.value}</div>
                        <div className="flex items-center text-xs text-green-600 mt-1">
                          {item.trend === "up" ? <ArrowUpRight size={12} className="mr-1" /> : null}
                          {item.change} from last month
                        </div>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon size={22} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Monthly Sales Performance</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs text-[#9b87f5]">
                    Monthly
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-cloudflow-gray-500">
                    Quarterly
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-cloudflow-gray-500">
                    Yearly
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue" 
                        fill="#9b87f5" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                      <Bar 
                        dataKey="profit" 
                        name="Profit" 
                        fill="#7E69AB" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationDelay={300}
                      />
                      <Bar 
                        dataKey="target" 
                        name="Target" 
                        fill="#D6BCFA" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationDelay={600}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Deal Distribution</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Distribution of deals by stage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dealsByStageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        animationDuration={1500}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dealsByStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number, name: string) => [`${value} deals`, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {dealsByStageData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-sm mr-2" 
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <span className="text-cloudflow-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value} deals</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-3 border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Year-to-Date Revenue</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-[#9b87f5] mr-2"></div>
                    <span className="text-sm text-cloudflow-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-[#D6BCFA] mr-2"></div>
                    <span className="text-sm text-cloudflow-gray-600">Projected</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={yearToDateData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#9b87f5" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Contacts</CardTitle>
                <Link to="/contacts">
                  <Button size="sm" className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white">
                    <Plus size={16} className="mr-1" />
                    Add Contact
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.length > 0 ? contacts.map((contact: any, i) => (
                    <div key={i} className="p-4 border border-cloudflow-gray-200 rounded-lg hover:bg-cloudflow-gray-50 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`h-12 w-12 rounded-full bg-cloudflow-blue-${i % 2 === 0 ? '100' : '500'} flex items-center justify-center ${i % 2 === 0 ? 'text-cloudflow-blue-500' : 'text-white'} group-hover:scale-105 transition-transform`}>
                            {`${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`}
                          </div>
                          <div>
                            <div className="font-medium text-cloudflow-gray-900">{`${contact.first_name} ${contact.last_name || ''}`}</div>
                            <div className="text-sm text-cloudflow-gray-500">{contact.company || 'No company'}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2 text-cloudflow-gray-400">
                          <Button variant="ghost" size="sm" className="hover:text-cloudflow-blue-500 rounded-full h-8 w-8 p-0">
                            <Mail size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-cloudflow-blue-500 rounded-full h-8 w-8 p-0">
                            <Phone size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-cloudflow-gray-500 border border-dashed border-cloudflow-gray-300 rounded-lg">
                      <Users className="h-12 w-12 mx-auto text-cloudflow-gray-400 mb-3" />
                      <p className="font-medium mb-2">No contacts yet</p>
                      <p className="text-sm mb-4">Click "Add Contact" to create your first contact.</p>
                      <Link to="/contacts">
                        <Button size="sm" className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white">
                          <Plus size={16} className="mr-1" />
                          Add Contact
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
                <Link to="/tasks">
                  <Button variant="ghost" size="sm" className="text-cloudflow-blue-500 hover:text-cloudflow-blue-600 hover:bg-cloudflow-blue-50">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.length > 0 ? tasks.map((task: any, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 border border-cloudflow-gray-200 rounded-lg hover:bg-cloudflow-gray-50 transition-colors">
                      <div className={`h-5 w-5 mt-0.5 rounded-full flex-shrink-0 ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                        'bg-green-100 text-green-600'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-cloudflow-gray-900">{task.title}</div>
                        <div className="flex items-center text-xs text-cloudflow-gray-500 mt-1">
                          <Clock size={12} className="mr-1" />
                          {task.due_date ? `${formatDate(task.due_date)}, ${formatTime(task.due_date)}` : 'No due date'}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-cloudflow-gray-500 border border-dashed border-cloudflow-gray-300 rounded-lg">
                      <CheckCircle className="h-10 w-10 mx-auto text-cloudflow-gray-400 mb-3" />
                      <p className="font-medium mb-1">No upcoming tasks</p>
                      <p className="text-sm">Create a task to stay organized</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6 mt-0">
          <Card className="border border-cloudflow-gray-200">
            <CardHeader>
              <CardTitle>Tasks & Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length > 0 ? tasks.map((task: any, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 border border-cloudflow-gray-200 rounded-lg hover:bg-cloudflow-gray-50 transition-colors">
                    <div className={`h-6 w-6 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {task.type === 'meeting' ? 
                        <Calendar size={14} /> : 
                        <CheckCircle size={14} />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium text-cloudflow-gray-900">{task.title}</div>
                        <div className="text-xs text-cloudflow-gray-500 px-2 py-1 bg-cloudflow-gray-100 rounded-full">
                          {task.type === 'meeting' ? 'Meeting' : 'Task'}
                        </div>
                      </div>
                      <div className="text-sm text-cloudflow-gray-600 mt-1">{task.description || 'No description'}</div>
                      <div className="flex items-center text-xs text-cloudflow-gray-500 mt-2">
                        <Clock size={12} className="mr-1" />
                        {task.due_date ? `${formatDate(task.due_date)}, ${formatTime(task.due_date)}` : 'No due date'}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-cloudflow-gray-500 border border-dashed border-cloudflow-gray-300 rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto text-cloudflow-gray-400 mb-3" />
                    <p className="font-medium mb-2">No upcoming tasks or meetings</p>
                    <p className="text-sm mb-4">Plan your work by creating tasks and scheduling meetings</p>
                    <Link to="/tasks">
                      <Button size="sm" className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white">
                        <Plus size={16} className="mr-1" />
                        Create Task
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border border-cloudflow-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales by Channel</CardTitle>
                  <DollarSign className="h-5 w-5 text-[#9b87f5]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Direct', value: 35, fill: '#9b87f5' },
                          { name: 'Referral', value: 25, fill: '#7E69AB' },
                          { name: 'Organic', value: 20, fill: '#0EA5E9' },
                          { name: 'Social', value: 15, fill: '#F97316' },
                          { name: 'Other', value: 5, fill: '#10B981' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-cloudflow-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance vs Target</CardTitle>
                  <Target className="h-5 w-5 text-[#9b87f5]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { name: 'Jan', target: 20000, actual: 18000 },
                        { name: 'Feb', target: 22000, actual: 21000 },
                        { name: 'Mar', target: 25000, actual: 28000 },
                        { name: 'Apr', target: 27000, actual: 26000 },
                        { name: 'May', target: 30000, actual: 32000 },
                        { name: 'Jun', target: 35000, actual: 37000 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#7E69AB" 
                        strokeWidth={2} 
                        name="Target"
                        dot={{ r: 4, fill: '#7E69AB' }}
                        activeDot={{ r: 6, fill: '#7E69AB' }}
                        animationDuration={1500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#9b87f5" 
                        strokeWidth={2} 
                        name="Actual"
                        dot={{ r: 4, fill: '#9b87f5' }}
                        activeDot={{ r: 6, fill: '#9b87f5' }}
                        animationDuration={1500}
                        animationDelay={300}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-cloudflow-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Funnel Analysis</CardTitle>
                <LineChart className="h-5 w-5 text-[#9b87f5]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: 'Leads', value: 120, fill: '#9b87f5' },
                      { name: 'Qualified', value: 80, fill: '#7E69AB' },
                      { name: 'Proposal', value: 60, fill: '#0EA5E9' },
                      { name: 'Negotiation', value: 40, fill: '#F97316' },
                      { name: 'Closed Won', value: 25, fill: '#10B981' }
                    ]}
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => value.toString()} />
                    <YAxis dataKey="name" type="category" />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value} deals`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#9b87f5" 
                      radius={[0, 4, 4, 0]}
                      animationDuration={1500}
                    >
                      {[
                        { dataKey: 'value', fill: '#9b87f5' },
                        { dataKey: 'value', fill: '#7E69AB' },
                        { dataKey: 'value', fill: '#0EA5E9' },
                        { dataKey: 'value', fill: '#F97316' },
                        { dataKey: 'value', fill: '#10B981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
