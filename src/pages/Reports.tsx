
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, LineChart, AreaChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Area, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart2, Download, Printer, Share2, FilterX, MoreVertical, Layers, Users, CreditCard, CheckCircle } from 'lucide-react';

const Reports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('month');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch deals
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (dealsError) throw dealsError;
      setDeals(dealsData || []);
      
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (contactsError) throw contactsError;
      setContacts(contactsData || []);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate monthly revenue data
  const getRevenueData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months: { [key: string]: { name: string, value: number } } = {};
    
    // Initialize all months with 0
    monthNames.forEach(month => {
      months[month] = { name: month, value: 0 };
    });
    
    // Sum up deal values by month
    deals.forEach(deal => {
      if (deal.status === 'closed_won' && deal.close_date) {
        const date = new Date(deal.close_date);
        const month = monthNames[date.getMonth()];
        if (months[month]) {
          months[month].value += Number(deal.value) || 0;
        }
      }
    });
    
    return Object.values(months);
  };
  
  // Generate deal stage data
  const getDealStageData = () => {
    const stages = {
      lead: { name: 'Lead', value: 0 },
      qualified: { name: 'Qualified', value: 0 },
      proposal: { name: 'Proposal', value: 0 },
      negotiation: { name: 'Negotiation', value: 0 },
      closed_won: { name: 'Closed Won', value: 0 },
      closed_lost: { name: 'Closed Lost', value: 0 }
    };
    
    deals.forEach(deal => {
      if (deal.stage && stages[deal.stage as keyof typeof stages]) {
        stages[deal.stage as keyof typeof stages].value += 1;
      }
    });
    
    return Object.values(stages);
  };
  
  // Generate deal values by stage
  const getDealValueByStage = () => {
    const stages = {
      lead: { name: 'Lead', value: 0 },
      qualified: { name: 'Qualified', value: 0 },
      proposal: { name: 'Proposal', value: 0 },
      negotiation: { name: 'Negotiation', value: 0 },
      closed_won: { name: 'Closed Won', value: 0 }
    };
    
    deals.forEach(deal => {
      if (deal.stage && deal.stage !== 'closed_lost' && stages[deal.stage as keyof typeof stages]) {
        stages[deal.stage as keyof typeof stages].value += Number(deal.value) || 0;
      }
    });
    
    return Object.values(stages);
  };
  
  // Generate contacts by source data
  const getContactsBySource = () => {
    const sources: { [key: string]: { name: string, value: number } } = {};
    
    contacts.forEach(contact => {
      const source = contact.source || 'Unknown';
      if (!sources[source]) {
        sources[source] = { name: source, value: 0 };
      }
      sources[source].value += 1;
    });
    
    return Object.values(sources);
  };
  
  // Generate tasks by status data
  const getTasksByStatus = () => {
    const statuses = {
      pending: { name: 'Pending', value: 0 },
      completed: { name: 'Completed', value: 0 }
    };
    
    tasks.forEach(task => {
      if (task.status && statuses[task.status as keyof typeof statuses]) {
        statuses[task.status as keyof typeof statuses].value += 1;
      }
    });
    
    return Object.values(statuses);
  };
  
  // Generate tasks by priority data
  const getTasksByPriority = () => {
    const priorities = {
      high: { name: 'High', value: 0 },
      medium: { name: 'Medium', value: 0 },
      low: { name: 'Low', value: 0 }
    };
    
    tasks.forEach(task => {
      if (task.priority && priorities[task.priority as keyof typeof priorities]) {
        priorities[task.priority as keyof typeof priorities].value += 1;
      }
    });
    
    return Object.values(priorities);
  };
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];
  
  const renderExportButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          Share Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-sm text-gray-500">Get insights into your sales and activities</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            {renderExportButton}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <p className="text-xs text-gray-500 mt-1">+{contacts.filter(c => {
                    const createdAt = new Date(c.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdAt >= thirtyDaysAgo;
                  }).length} from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Active Deals</CardTitle>
                  <CreditCard className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${deals.filter(d => d.status === 'open').reduce((sum, deal) => sum + (Number(deal.value) || 0), 0).toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">{deals.filter(d => d.status === 'open').length} open deals</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Completed Tasks</CardTitle>
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)}% completion rate</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>Monthly revenue from closed deals</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Download Data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getRevenueData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Deal Pipeline Value</CardTitle>
                      <CardDescription>Value distribution across pipeline stages</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Download Data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getDealValueByStage()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Value']}
                        />
                        <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deals by Stage</CardTitle>
                  <CardDescription>Distribution of deals across sales stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDealStageData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getDealStageData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contacts by Source</CardTitle>
                  <CardDescription>Where your contacts are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getContactsBySource()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getContactsBySource().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tasks by Priority</CardTitle>
                  <CardDescription>Distribution of tasks by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getTasksByPriority()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getTasksByPriority().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
