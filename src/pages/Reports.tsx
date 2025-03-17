
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FileDown, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const CHART_COLORS = [
  '#4f46e5', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
];

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [timeFilter, setTimeFilter] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  
  // Report data states
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [salesTrendData, setSalesTrendData] = useState<any[]>([]);
  const [topDealsData, setTopDealsData] = useState<any[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchReportData();
  }, [timeFilter, dateRange]);
  
  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch pipeline stats (count and value by stage)
      const { data: pipelineStats, error: pipelineError } = await supabase
        .from('deals')
        .select('stage, value, currency')
        .eq('status', 'open');
        
      if (pipelineError) throw pipelineError;
      
      // Fetch deals conversion data
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('stage, status, created_at, close_date');
        
      if (dealsError) throw dealsError;
      
      // Fetch task data
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('status, due_date, created_at, priority');
        
      if (tasksError) throw tasksError;
      
      // Process pipeline data
      const stageMap: Record<string, { count: number, value: number }> = {
        'lead': { count: 0, value: 0 },
        'qualified': { count: 0, value: 0 },
        'proposal': { count: 0, value: 0 },
        'negotiation': { count: 0, value: 0 },
        'closed_won': { count: 0, value: 0 },
        'closed_lost': { count: 0, value: 0 }
      };
      
      pipelineStats.forEach((deal: any) => {
        if (deal.stage && stageMap[deal.stage]) {
          stageMap[deal.stage].count += 1;
          stageMap[deal.stage].value += deal.value || 0;
        }
      });
      
      const processedPipelineData = Object.entries(stageMap).map(([stage, data]) => ({
        name: formatStageName(stage),
        deals: data.count,
        value: data.value
      }));
      
      setPipelineData(processedPipelineData);
      
      // Process conversion data
      const totalDeals = dealsData.length;
      const wonDeals = dealsData.filter((deal: any) => deal.stage === 'closed_won').length;
      const lostDeals = dealsData.filter((deal: any) => deal.stage === 'closed_lost').length;
      const openDeals = totalDeals - wonDeals - lostDeals;
      
      const processedConversionData = [
        { name: 'Won', value: wonDeals },
        { name: 'Lost', value: lostDeals },
        { name: 'Open', value: openDeals }
      ];
      
      setConversionData(processedConversionData);
      
      // Process sales trend data (mock data for now, would be more complex in real app)
      const mockSalesTrend = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
        { name: 'Aug', value: 4000 },
        { name: 'Sep', value: 3200 },
        { name: 'Oct', value: 2800 },
        { name: 'Nov', value: 3800 },
        { name: 'Dec', value: 4300 }
      ];
      
      setSalesTrendData(mockSalesTrend);
      
      // Process top deals data
      const { data: topDeals, error: topDealsError } = await supabase
        .from('deals')
        .select('name, value, currency, stage')
        .order('value', { ascending: false })
        .limit(5);
        
      if (topDealsError) throw topDealsError;
      
      setTopDealsData(topDeals);
      
      // Process task completion data
      const taskStatusCounts = {
        'completed': tasksData.filter((task: any) => task.status === 'completed').length,
        'in_progress': tasksData.filter((task: any) => task.status === 'in_progress').length,
        'pending': tasksData.filter((task: any) => task.status === 'pending').length
      };
      
      const processedTaskData = [
        { name: 'Completed', value: taskStatusCounts.completed },
        { name: 'In Progress', value: taskStatusCounts.in_progress },
        { name: 'Pending', value: taskStatusCounts.pending }
      ];
      
      setTaskCompletionData(processedTaskData);
      
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error loading reports",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatStageName = (stage: string) => {
    return stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your report is being exported to CSV"
    });
    // In a real app, this would handle exporting the data to CSV/Excel
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            {timeFilter === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-auto justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
            
            <Button variant="outline" size="icon" onClick={fetchReportData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sales">Sales Performance</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
              <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sales Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesTrendData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#4f46e5"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Conversion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conversionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {conversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} deals`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Top Deals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topDealsData.length > 0 ? (
                        <div className="space-y-2">
                          {topDealsData.map((deal, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <div className="font-medium">{deal.name}</div>
                                <div className="text-sm text-gray-500">
                                  {formatStageName(deal.stage)}
                                </div>
                              </div>
                              <div className="text-right font-semibold text-green-600">
                                {formatCurrency(deal.value)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 text-gray-500">
                          No deals data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="pipeline" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pipeline Value by Stage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pipelineData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Value']} />
                        <Legend />
                        <Bar dataKey="value" fill="#4f46e5" name="Value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Deal Count by Stage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pipelineData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="deals" fill="#10b981" name="Deal Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pipeline Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={pipelineData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                        <Tooltip />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="value"
                          stroke="#4f46e5"
                          fill="#4f46e522"
                          name="Value ($)"
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="deals"
                          stroke="#10b981"
                          fill="#10b98122"
                          name="Deal Count"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task Completion Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskCompletionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskCompletionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={
                              entry.name === 'Completed' ? '#10b981' : 
                              entry.name === 'In Progress' ? '#f59e0b' : 
                              '#ef4444'
                            } />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task Stats Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {taskCompletionData.map((task, index) => (
                          <div key={index} className="flex justify-between items-center p-4 border rounded">
                            <div className="font-medium">{task.name}</div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right font-semibold">
                                {task.value} tasks
                              </div>
                              <div 
                                className={`w-3 h-3 rounded-full ${
                                  task.name === 'Completed' ? 'bg-green-500' : 
                                  task.name === 'In Progress' ? 'bg-amber-500' : 
                                  'bg-red-500'
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Overall Completion Rate</span>
                          <span className="text-sm font-medium">
                            {taskCompletionData.length > 0 ? 
                              `${Math.round((taskCompletionData.find(t => t.name === 'Completed')?.value || 0) / 
                              taskCompletionData.reduce((acc, curr) => acc + curr.value, 0) * 100)}%` : 
                              '0%'
                            }
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${taskCompletionData.length > 0 ? 
                                Math.round((taskCompletionData.find(t => t.name === 'Completed')?.value || 0) / 
                                taskCompletionData.reduce((acc, curr) => acc + curr.value, 0) * 100) : 
                                0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
