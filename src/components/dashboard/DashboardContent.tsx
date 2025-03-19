
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart, 
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
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-cloudflow-blue-500 to-cloudflow-blue-700 rounded-xl p-6 text-white shadow-lg">
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
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Contacts", value: stats.totalContacts, change: "+8.4%", icon: Users, color: "bg-cloudflow-blue-100 text-cloudflow-blue-500", link: "/contacts", trend: "up" },
              { title: "Active Deals", value: `$${stats.activeDeals.toFixed(2)}`, change: "+12.3%", icon: CreditCard, color: "bg-purple-100 text-purple-500", link: "/sales-pipeline", trend: "up" },
              { title: "Completed Tasks", value: stats.completedTasks, change: "+7.2%", icon: CheckCircle, color: "bg-green-100 text-green-600", link: "/tasks", trend: "up" },
              { title: "Upcoming Meetings", value: stats.upcomingMeetings, change: "+2", icon: Calendar, color: "bg-amber-100 text-amber-600", link: "/tasks", trend: "up" }
            ].map((item, index) => (
              <Link to={item.link} key={index} className="block group">
                <Card className="border border-cloudflow-gray-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 hover:border-cloudflow-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-cloudflow-gray-500">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold group-hover:text-cloudflow-blue-600 transition-colors">{item.value}</div>
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
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <div className="flex h-full items-end justify-between space-x-2 pb-4">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center group">
                        <div className="w-full relative mb-1">
                          <div 
                            className="w-full bg-cloudflow-blue-100 rounded-t-sm relative transition-all duration-300 group-hover:bg-cloudflow-blue-200" 
                            style={{ height: `${[60, 85, 40, 75, 60, 90][i]}%` }}
                          >
                            <div 
                              className="absolute bottom-0 left-0 w-full bg-cloudflow-blue-500 rounded-t-sm transition-all duration-300 group-hover:bg-cloudflow-blue-600" 
                              style={{ height: `${[35, 50, 20, 45, 30, 60][i]}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="mt-2 text-xs font-medium text-cloudflow-gray-500">{month}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-8 mt-4 text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-sm bg-cloudflow-blue-500 mr-2"></div>
                      <span className="text-cloudflow-gray-600 font-medium">Revenue</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-sm bg-cloudflow-blue-100 mr-2"></div>
                      <span className="text-cloudflow-gray-600 font-medium">Profit</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-cloudflow-gray-200">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Sales Pipeline</CardTitle>
                <Link to="/sales-pipeline">
                  <Button variant="ghost" size="sm" className="text-cloudflow-blue-500 hover:text-cloudflow-blue-600 hover:bg-cloudflow-blue-50">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: "Leads", count: deals.filter((d: any) => d.stage === 'lead').length, value: 83, color: "bg-cloudflow-blue-500" },
                    { stage: "Qualified", count: deals.filter((d: any) => d.stage === 'qualified').length, value: 65, color: "bg-purple-500" },
                    { stage: "Proposal", count: deals.filter((d: any) => d.stage === 'proposal').length, value: 48, color: "bg-cyan-500" },
                    { stage: "Negotiation", count: deals.filter((d: any) => d.stage === 'negotiation').length, value: 30, color: "bg-amber-500" },
                    { stage: "Closed Won", count: deals.filter((d: any) => d.stage === 'closed_won').length, value: 20, color: "bg-green-500" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-cloudflow-gray-600">{item.stage}</span>
                        <span className="font-medium text-cloudflow-gray-900">{item.count}</span>
                      </div>
                      <Progress value={item.value} className={item.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent contacts & tasks */}
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
          <Card className="border border-cloudflow-gray-200">
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto text-cloudflow-blue-500 mb-3" />
                  <p className="text-xl font-semibold text-cloudflow-gray-800 mb-2">Advanced Analytics</p>
                  <p className="text-cloudflow-gray-500 max-w-md mx-auto mb-4">View comprehensive sales and performance analytics</p>
                  <Link to="/reports">
                    <Button className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white">
                      View Detailed Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
