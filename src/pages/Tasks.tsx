
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  CheckSquare,
  X,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Tasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');
  
  // Form state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('12:00');
  
  // New task form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact_id: '',
    deal_id: '',
    due_date: '',
    priority: 'medium',
    status: 'pending'
  });
  
  useEffect(() => {
    fetchTasks();
    fetchContacts();
    fetchDeals();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*, contacts(*), deals(*)')
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      
      setTasks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, first_name, last_name, company')
        .order('first_name', { ascending: true });
        
      if (error) throw error;
      
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching contacts",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('id, name')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      setDeals(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching deals",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    updateDueDate(date, time);
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    updateDueDate(date, e.target.value);
  };
  
  const updateDueDate = (date: Date | undefined, time: string) => {
    if (date) {
      const [hours, minutes] = time.split(':').map(Number);
      const dueDate = new Date(date);
      dueDate.setHours(hours, minutes, 0, 0);
      
      setFormData(prev => ({ 
        ...prev, 
        due_date: dueDate.toISOString()
      }));
    }
  };
  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([formData])
        .select('*, contacts(*), deals(*)');
        
      if (error) throw error;
      
      toast({
        title: "Task added",
        description: "The task has been added successfully"
      });
      
      setTasks(prev => [...(data || []), ...prev]);
      setIsAddTaskOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleEditClick = (task: any) => {
    setCurrentTask(task);
    
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      setDate(dueDate);
      setTime(`${dueDate.getHours().toString().padStart(2, '0')}:${dueDate.getMinutes().toString().padStart(2, '0')}`);
    } else {
      setDate(undefined);
      setTime('12:00');
    }
    
    setFormData({
      title: task.title || '',
      description: task.description || '',
      contact_id: task.contact_id || '',
      deal_id: task.deal_id || '',
      due_date: task.due_date || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending'
    });
    
    setIsEditTaskOpen(true);
  };
  
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(formData)
        .eq('id', currentTask.id)
        .select('*, contacts(*), deals(*)');
        
      if (error) throw error;
      
      setTasks(prev => 
        prev.map(task => 
          task.id === currentTask.id ? data[0] : task
        )
      );
      
      toast({
        title: "Task updated",
        description: "The task has been updated successfully"
      });
      
      setIsEditTaskOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteClick = (task: any) => {
    setCurrentTask(task);
    setIsDeleteTaskOpen(true);
  };
  
  const handleDeleteTask = async () => {
    if (!currentTask) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', currentTask.id);
        
      if (error) throw error;
      
      setTasks(prev => 
        prev.filter(task => task.id !== currentTask.id)
      );
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully"
      });
      
      setIsDeleteTaskOpen(false);
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteTask = async (task: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', task.id)
        .select('*, contacts(*), deals(*)');
        
      if (error) throw error;
      
      setTasks(prev => 
        prev.map(t => 
          t.id === task.id ? data[0] : t
        )
      );
      
      toast({
        title: "Task completed",
        description: "The task has been marked as completed"
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleReopenTask = async (task: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: 'pending' })
        .eq('id', task.id)
        .select('*, contacts(*), deals(*)');
        
      if (error) throw error;
      
      setTasks(prev => 
        prev.map(t => 
          t.id === task.id ? data[0] : t
        )
      );
      
      toast({
        title: "Task reopened",
        description: "The task has been reopened"
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      contact_id: '',
      deal_id: '',
      due_date: '',
      priority: 'medium',
      status: 'pending'
    });
    setDate(undefined);
    setTime('12:00');
    setCurrentTask(null);
  };
  
  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      return `${contact.first_name} ${contact.last_name || ''}`;
    }
    return '';
  };
  
  const getDealName = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      return deal.name;
    }
    return '';
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

  const getTaskStatus = (task: any) => {
    if (!task.due_date) return 'none';
    
    const now = new Date();
    const dueDate = new Date(task.due_date);
    
    if (task.status === 'completed') return 'completed';
    if (dueDate < now) return 'overdue';
    
    // If due within 24 hours
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setHours(oneDayFromNow.getHours() + 24);
    
    if (dueDate <= oneDayFromNow) return 'due-soon';
    return 'upcoming';
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
    const matchesStatus = task.status === activeTab;
    
    const matchesPriority = 
      filterPriority === 'all' || 
      task.priority === filterPriority;
      
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-amber-100 text-amber-600';
      case 'low':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-red-500';
      case 'due-soon':
        return 'text-amber-500';
      case 'completed':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tasks..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterPriority('all')} className={filterPriority === 'all' ? 'bg-gray-100' : ''}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterPriority('high')} className={filterPriority === 'high' ? 'bg-gray-100' : ''}>
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('medium')} className={filterPriority === 'medium' ? 'bg-gray-100' : ''}>
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('low')} className={filterPriority === 'low' ? 'bg-gray-100' : ''}>
                  Low Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Fill in the task details below. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTask}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input 
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange('priority', value)}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={date}
                              onSelect={handleDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input 
                          id="time"
                          type="time"
                          value={time}
                          onChange={handleTimeChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact">Related Contact</Label>
                      <Select
                        value={formData.contact_id}
                        onValueChange={(value) => handleSelectChange('contact_id', value)}
                      >
                        <SelectTrigger id="contact">
                          <SelectValue placeholder="Select a contact (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {contacts.map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deal">Related Deal</Label>
                      <Select
                        value={formData.deal_id}
                        onValueChange={(value) => handleSelectChange('deal_id', value)}
                      >
                        <SelectTrigger id="deal">
                          <SelectValue placeholder="Select a deal (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {deals.map(deal => (
                            <SelectItem key={deal.id} value={deal.id}>
                              {deal.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
                  </div>
                ) : sortedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <CheckSquare className="h-12 w-12 text-gray-300" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">No tasks found</h3>
                      <p className="text-sm text-gray-500">
                        {searchTerm || filterPriority !== 'all'
                          ? "Try adjusting your search or filter to find what you're looking for."
                          : "Get started by adding your first task."}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsAddTaskOpen(true)}
                      className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedTasks.map(task => {
                      const taskStatus = getTaskStatus(task);
                      
                      return (
                        <div key={task.id} className="flex border rounded-lg p-4 hover:bg-gray-50">
                          <div className="mr-4 flex flex-col items-center justify-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full border-2"
                              onClick={() => handleCompleteTask(task)}
                            >
                              <CheckSquare className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditClick(task)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500"
                                  onClick={() => handleDeleteClick(task)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </div>
                              
                              {task.due_date && (
                                <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 ${getStatusColor(taskStatus)}`}>
                                  <Clock className="mr-1 h-3 w-3" />
                                  {taskStatus === 'overdue' ? 'Overdue: ' : ''}
                                  {formatDate(task.due_date)}, {formatTime(task.due_date)}
                                </div>
                              )}
                              
                              {task.contact_id && (
                                <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                                  Contact: {getContactName(task.contact_id)}
                                </div>
                              )}
                              
                              {task.deal_id && (
                                <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700">
                                  Deal: {getDealName(task.deal_id)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
                  </div>
                ) : sortedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <CheckSquare className="h-12 w-12 text-gray-300" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">No completed tasks</h3>
                      <p className="text-sm text-gray-500">
                        Complete tasks will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedTasks.map(task => (
                      <div key={task.id} className="flex border rounded-lg p-4 hover:bg-gray-50">
                        <div className="mr-4 flex flex-col items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full border-2 text-green-500 border-green-500"
                            onClick={() => handleReopenTask(task)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1 line-through">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 mb-2 line-through">{task.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500"
                                onClick={() => handleDeleteClick(task)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </div>
                            
                            {task.due_date && (
                              <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(task.due_date)}, {formatTime(task.due_date)}
                              </div>
                            )}
                            
                            {task.contact_id && (
                              <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                                Contact: {getContactName(task.contact_id)}
                              </div>
                            )}
                            
                            {task.deal_id && (
                              <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700">
                                Deal: {getDealName(task.deal_id)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Edit Dialog */}
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the task details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateTask}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_title">Task Title</Label>
                  <Input 
                    id="edit_title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_description">Description</Label>
                  <Input 
                    id="edit_description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger id="edit_priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_time">Time</Label>
                    <Input 
                      id="edit_time"
                      type="time"
                      value={time}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_contact">Related Contact</Label>
                  <Select
                    value={formData.contact_id}
                    onValueChange={(value) => handleSelectChange('contact_id', value)}
                  >
                    <SelectTrigger id="edit_contact">
                      <SelectValue placeholder="Select a contact (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_deal">Related Deal</Label>
                  <Select
                    value={formData.deal_id}
                    onValueChange={(value) => handleSelectChange('deal_id', value)}
                  >
                    <SelectTrigger id="edit_deal">
                      <SelectValue placeholder="Select a deal (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {deals.map(deal => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Dialog */}
        <Dialog open={isDeleteTaskOpen} onOpenChange={setIsDeleteTaskOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {currentTask && (
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">{currentTask.title}</p>
                  {currentTask.description && (
                    <p className="text-sm text-gray-500">{currentTask.description}</p>
                  )}
                  {currentTask.due_date && (
                    <p className="text-sm text-gray-500">
                      Due: {formatDate(currentTask.due_date)}, {formatTime(currentTask.due_date)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDeleteTask}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
