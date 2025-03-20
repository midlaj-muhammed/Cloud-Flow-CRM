
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
import { 
  CalendarIcon, 
  FileDown, 
  RefreshCw, 
  BarChart3, 
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Info,
  Filter 
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

// Enhanced color palette for better visual distinction and aesthetics
const CHART_COLORS = [
  '#8B5CF6', // Primary purple
  '#10b981', // Green
  '#f97316', // Orange
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f59e0b', // Amber
  '#d946ef'  // Fuchsia
];

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [timeFilter, setTimeFilter] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  
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
  
  const getPeriodLabel = () => {
    switch(timeFilter) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      case 'custom': return dateRange.from && dateRange.to ? 
        `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}` : 
        'Custom Range';
      default: return 'This Month';
    }
  };
  
  const handleExport = () => {
    try {
      let csvContent = '';
      let filename = '';
      const periodLabel = getPeriodLabel();
      const dateStamp = format(new Date(), "yyyy-MM-dd");
      
      // Prepare the CSV content based on active tab
      if (activeTab === 'sales') {
        // Export sales trend data
        filename = `sales_trend_report_${dateStamp}.csv`;
        
        // Add metadata header
        csvContent = `Sales Trend Report\n`;
        csvContent += `Period: ${periodLabel}\n`;
        csvContent += `Generated: ${format(new Date(), "MMMM dd, yyyy HH:mm")}\n\n`;
        
        // Add header row
        csvContent += 'Month,Value\n';
        
        // Add data rows
        salesTrendData.forEach(item => {
          csvContent += `${item.name},${item.value}\n`;
        });
        
        // Add summary
        const totalSales = salesTrendData.reduce((sum, item) => sum + item.value, 0);
        csvContent += `\nTotal,${totalSales}\n`;
        csvContent += `Average,${Math.round(totalSales / salesTrendData.length)}\n`;
        
      } else if (activeTab === 'pipeline') {
        // Export pipeline data
        filename = `pipeline_report_${dateStamp}.csv`;
        
        // Add metadata header
        csvContent = `Pipeline Report\n`;
        csvContent += `Period: ${periodLabel}\n`;
        csvContent += `Generated: ${format(new Date(), "MMMM dd, yyyy HH:mm")}\n\n`;
        
        // Add header row
        csvContent += 'Stage,Deal Count,Deal Value (USD)\n';
        
        // Add data rows
        pipelineData.forEach(item => {
          csvContent += `${item.name},${item.deals},${item.value}\n`;
        });
        
        // Add summary
        const totalCount = pipelineData.reduce((sum, item) => sum + item.deals, 0);
        const totalValue = pipelineData.reduce((sum, item) => sum + item.value, 0);
        csvContent += `\nTotal,${totalCount},${totalValue}\n`;
        
      } else if (activeTab === 'tasks') {
        // Export task data
        filename = `task_completion_report_${dateStamp}.csv`;
        
        // Add metadata header
        csvContent = `Task Completion Report\n`;
        csvContent += `Period: ${periodLabel}\n`;
        csvContent += `Generated: ${format(new Date(), "MMMM dd, yyyy HH:mm")}\n\n`;
        
        // Add header row
        csvContent += 'Status,Count\n';
        
        // Add data rows
        taskCompletionData.forEach(item => {
          csvContent += `${item.name},${item.value}\n`;
        });
        
        // Add summary
        const totalTasks = taskCompletionData.reduce((sum, item) => sum + item.value, 0);
        const completionRate = taskCompletionData.find(t => t.name === 'Completed')?.value || 0;
        csvContent += `\nTotal Tasks,${totalTasks}\n`;
        csvContent += `Completion Rate,${Math.round((completionRate / totalTasks) * 100)}%\n`;
      }
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Set link properties
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Add to document, trigger download and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `Report exported to ${filename}`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
  };
  
  const getChartConfig = () => {
    return {
      sales: {
        color: "#8B5CF6"
      },
      won: {
        color: "#10b981" 
      },
      lost: {
        color: "#ef4444"
      },
      open: {
        color: "#f97316"
      },
      completed: {
        color: "#10b981"
      },
      "in progress": {
        color: "#f59e0b"
      },
      pending: {
        color: "#ef4444"
      },
      value: {
        color: "#8B5CF6" 
      },
      deals: {
        color: "#10b981"
      }
    };
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-white">Reports & Analytics</h1>
              <p className="text-purple-700 dark:text-purple-300 mt-1">Visualize your business performance with detailed analytics</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 w-full sm:w-auto">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Select
                  value={timeFilter}
                  onValueChange={setTimeFilter}
                >
                  <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800">
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
                        className="w-auto justify-start text-left font-normal bg-white dark:bg-slate-800"
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
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchReportData}
                  className="bg-white dark:bg-slate-800"
                  title="Refresh data"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  className="bg-white dark:bg-slate-800"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <Tabs defaultValue="sales" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <LineChartIcon className="h-4 w-4" />
                  <span>Sales Performance</span>
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Pipeline Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  <span>Task Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales" className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Sales Trend</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Sales Trend</h4>
                              <p className="text-sm text-muted-foreground">
                                Monthly sales performance over time. The chart shows revenue trends 
                                and helps identify seasonal patterns.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-6">
                      <ChartContainer 
                        config={getChartConfig()}
                        className="h-[280px]"
                      >
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
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                              />
                            }
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            activeDot={{ r: 8 }}
                            name="Sales"
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Conversion Rate</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Deal Conversion</h4>
                              <p className="text-sm text-muted-foreground">
                                Distribution of deals by outcome (Won, Lost, Open). 
                                This chart helps track your sales effectiveness.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-6">
                      <ChartContainer 
                        config={getChartConfig()}
                        className="h-[280px]"
                      >
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
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  entry.name === 'Won' ? "#10b981" : 
                                  entry.name === 'Lost' ? "#ef4444" : 
                                  "#f97316"
                                } 
                              />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value) => [`${value} deals`, 'Count']}
                              />
                            }
                          />
                          <Legend />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2 lg:col-span-1 overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Top Deals</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Top Value Deals</h4>
                              <p className="text-sm text-muted-foreground">
                                Highest value opportunities in your pipeline.
                                Focus on these deals to maximize revenue.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {topDealsData.length > 0 ? (
                          <div className="space-y-3">
                            {topDealsData.map((deal, index) => (
                              <div 
                                key={index} 
                                className="flex justify-between items-center p-3 rounded-lg
                                  bg-gradient-to-r from-orange-50 to-amber-50 
                                  dark:from-slate-800 dark:to-slate-700
                                  hover:from-orange-100 hover:to-amber-100
                                  dark:hover:from-slate-700 dark:hover:to-slate-600
                                  transition-colors"
                              >
                                <div>
                                  <div className="font-medium">{deal.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${
                                      deal.stage === 'closed_won' ? 'bg-green-500' : 
                                      deal.stage === 'closed_lost' ? 'bg-red-500' : 
                                      'bg-orange-500'
                                    }`}></span>
                                    {formatStageName(deal.stage)}
                                  </div>
                                </div>
                                <div className="text-right font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(deal.value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8 text-gray-500 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <p>No deals data available</p>
                            <Button 
                              variant="outline" 
                              className="mt-2"
                              onClick={fetchReportData}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Refresh
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="pipeline" className="space-y-6">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Pipeline Value by Stage</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Pipeline Value</h4>
                              <p className="text-sm text-muted-foreground">
                                Total value of deals at each stage in your sales pipeline.
                                Identify which stages hold the most value.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-6">
                      <ChartContainer 
                        config={getChartConfig()}
                        className="h-[330px]"
                      >
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
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                              />
                            }
                          />
                          <Legend />
                          <Bar dataKey="value" fill="#8B5CF6" name="Value" />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-teal-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Deal Count by Stage</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Deal Count</h4>
                              <p className="text-sm text-muted-foreground">
                                Number of deals at each stage in your sales pipeline.
                                Identify bottlenecks in your sales process.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-6">
                      <ChartContainer 
                        config={getChartConfig()}
                        className="h-[330px]"
                      >
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
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                          />
                          <Legend />
                          <Bar dataKey="deals" fill="#10b981" name="Deal Count" />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2 overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Pipeline Analysis</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Combined Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                Comprehensive view of both deal value and count across stages.
                                Compare the relationship between number of deals and their total value.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-6">
                      <ChartContainer 
                        config={getChartConfig()}
                        className="h-[330px]"
                      >
                        <AreaChart
                          data={pipelineData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                            </linearGradient>
                            <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                          />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            name="Value ($)"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="deals"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorDeals)"
                            name="Deal Count"
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Task Completion Status</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Task Status</h4>
                              <p className="text-sm text-muted-foreground">
                                Distribution of tasks by status (Completed, In Progress, Pending).
                                Track your team's efficiency and workload.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-6">
                      <ChartContainer 
                        config={getChartConfig()}
                        className="h-[330px]"
                      >
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
                            label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                          >
                            {taskCompletionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={
                                entry.name === 'Completed' ? '#10b981' : 
                                entry.name === 'In Progress' ? '#f59e0b' : 
                                '#ef4444'
                              } />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value) => [`${value} tasks`, 'Count']}
                              />
                            }
                          />
                          <Legend />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-700 dark:to-slate-800">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Task Stats Summary</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Task Statistics</h4>
                              <p className="text-sm text-muted-foreground">
                                Detailed breakdown of tasks by status with completion rate.
                                Monitor productivity and identify areas for improvement.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Status</TableHead>
                              <TableHead>Count</TableHead>
                              <TableHead>Percentage</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {taskCompletionData.map((task, index) => {
                              const total = taskCompletionData.reduce((acc, curr) => acc + curr.value, 0);
                              const percentage = total ? Math.round((task.value / total) * 100) : 0;
                              
                              return (
                                <TableRow key={index}>
                                  <TableCell className="font-medium flex items-center gap-2">
                                    <div 
                                      className={`w-3 h-3 rounded-full ${
                                        task.name === 'Completed' ? 'bg-green-500' : 
                                        task.name === 'In Progress' ? 'bg-amber-500' : 
                                        'bg-red-500'
                                      }`}
                                    />
                                    {task.name}
                                  </TableCell>
                                  <TableCell>{task.value}</TableCell>
                                  <TableCell>{percentage}%</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        
                        <div className="pt-2">
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
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
