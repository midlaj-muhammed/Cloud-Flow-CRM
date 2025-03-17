import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  Calendar as CalendarIcon,
  Flag,
  Trash2,
  Pencil,
  Filter
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

const Tasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Form state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  
  // Task form state
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        due_date: date.toISOString()
      }));
    }
  };
  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add tasks",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...formData,
          owner_id: user.id
        }])
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
    setDate(task.due_date ? new Date(task.due_date) : undefined);
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
    if (!currentTask || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...formData,
          owner_id: user.id
        })
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
    setCurrentTask(null);
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      filterStatus === 'all' || 
      task.status === filterStatus;
      
    const matchesPriority = 
      filterPriority === 'all' || 
      task.priority === filterPriority;
      
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
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
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return '-';
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
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('in_progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterPriority('all')}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterPriority('high')}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('medium')}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('low')}>
                  Low
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
                      <Label htmlFor="title">Title</Label>
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
                      <Label htmlFor="contact">Contact</Label>
                      <Select
                        value={formData.contact_id}
                        onValueChange={(value) => handleSelectChange('contact_id', value)}
                      >
                        <SelectTrigger id="contact">
                          <SelectValue placeholder="Select a contact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No contact</SelectItem>
                          {contacts.map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deal">Deal</Label>
                      <Select
                        value={formData.deal_id}
                        onValueChange={(value) => handleSelectChange('deal_id', value)}
                      >
                        <SelectTrigger id="deal">
                          <SelectValue placeholder="Select a deal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No deal</SelectItem>
                          {deals.map(deal => (
                            <SelectItem key={deal.id} value={deal.id}>
                              {deal.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="due_date">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleSelectChange('status', value)}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
        
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <CheckCircle className="h-12 w-12 text-gray-300" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">No tasks found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                      ? "Try adjusting your search or filters to find what you're looking for."
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
              <div className="overflow-x-auto">
                <div className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : task.due_date && new Date(task.due_date) < new Date() ? (
                            <Flag className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                          
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <div className="text-sm text-gray-500">
                              {task.contact_id && (
                                <span>Contact: {getContactName(task.contact_id)}</span>
                              )}
                              {task.deal_id && (
                                <span>, Deal: {getDealName(task.deal_id)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {task.priority && (
                            <Badge 
                              variant="secondary"
                              className={
                                task.priority === 'high' ? 'bg-red-100 text-red-500 border-red-300' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-500 border-yellow-300' :
                                'bg-green-100 text-green-500 border-green-300'
                              }
                            >
                              {task.priority}
                            </Badge>
                          )}
                          
                          {task.due_date && (
                            <div className="text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3 inline-block mr-1" />
                              {formatDate(task.due_date)}
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditClick(task)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(task)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="mt-2 text-sm text-gray-700">{task.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
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
                  <Label htmlFor="edit_title">Title</Label>
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
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_contact">Contact</Label>
                  <Select
                    value={formData.contact_id}
                    onValueChange={(value) => handleSelectChange('contact_id', value)}
                  >
                    <SelectTrigger id="edit_contact">
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No contact</SelectItem>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_deal">Deal</Label>
                  <Select
                    value={formData.deal_id}
                    onValueChange={(value) => handleSelectChange('deal_id', value)}
                  >
                    <SelectTrigger id="edit_deal">
                      <SelectValue placeholder="Select a deal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No deal</SelectItem>
                      {deals.map(deal => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_due_date">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit_status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="edit_status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <p className="text-sm text-gray-500">
                    {currentTask.description || 'No description'}
                  </p>
                  {currentTask.due_date && (
                    <p className="text-sm text-gray-500">
                      Due Date: {formatDate(currentTask.due_date)}
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
