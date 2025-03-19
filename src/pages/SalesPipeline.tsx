import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  ChevronRight
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
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/contexts/AuthContext";

const PIPELINE_STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-blue-100 border-blue-300' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-100 border-purple-300' },
  { id: 'proposal', name: 'Proposal', color: 'bg-indigo-100 border-indigo-300' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-100 border-amber-300' },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-green-100 border-green-300' },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-100 border-red-300' },
];

const SalesPipeline = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isEditDealOpen, setIsEditDealOpen] = useState(false);
  const [isDeleteDealOpen, setIsDeleteDealOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  
  // New deal form state
  const [formData, setFormData] = useState({
    name: '',
    contact_id: '',
    value: '',
    currency: 'USD',
    stage: 'lead',
    status: 'open',
    description: '',
    close_date: ''
  });
  
  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
  ];
  
  useEffect(() => {
    fetchDeals();
    fetchContacts();
  }, []);
  
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deals')
        .select('*, contacts(*)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setDeals(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching deals",
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        close_date: date.toISOString().split('T')[0]
      }));
    }
  };
  
  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add deals",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          ...formData,
          value: formData.value ? parseFloat(formData.value) : null,
          owner_id: user.id
        }])
        .select('*, contacts(*)');
        
      if (error) throw error;
      
      toast({
        title: "Deal added",
        description: "The deal has been added successfully"
      });
      
      setDeals(prev => [...(data || []), ...prev]);
      setIsAddDealOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error adding deal",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleEditClick = (deal: any) => {
    setCurrentDeal(deal);
    setFormData({
      name: deal.name || '',
      contact_id: deal.contact_id || '',
      value: deal.value ? String(deal.value) : '',
      currency: deal.currency || 'USD',
      stage: deal.stage || 'lead',
      status: deal.status || 'open',
      description: deal.description || '',
      close_date: deal.close_date || ''
    });
    if (deal.close_date) {
      setDate(new Date(deal.close_date));
    } else {
      setDate(undefined);
    }
    setIsEditDealOpen(true);
  };
  
  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDeal) return;
    
    try {
      const { data, error } = await supabase
        .from('deals')
        .update({
          ...formData,
          value: formData.value ? parseFloat(formData.value) : null
        })
        .eq('id', currentDeal.id)
        .select('*, contacts(*)');
        
      if (error) throw error;
      
      setDeals(prev => 
        prev.map(deal => 
          deal.id === currentDeal.id ? data[0] : deal
        )
      );
      
      toast({
        title: "Deal updated",
        description: "The deal has been updated successfully"
      });
      
      setIsEditDealOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error updating deal",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteClick = (deal: any) => {
    setCurrentDeal(deal);
    setIsDeleteDealOpen(true);
  };
  
  const handleDeleteDeal = async () => {
    if (!currentDeal) return;
    
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', currentDeal.id);
        
      if (error) throw error;
      
      setDeals(prev => 
        prev.filter(deal => deal.id !== currentDeal.id)
      );
      
      toast({
        title: "Deal deleted",
        description: "The deal has been deleted successfully"
      });
      
      setIsDeleteDealOpen(false);
    } catch (error: any) {
      toast({
        title: "Error deleting deal",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDragStart = (e: React.DragEvent, deal: any) => {
    e.dataTransfer.setData('text/plain', deal.id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    
    // Find the deal in our state
    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.stage === stageId) return;
    
    try {
      // Update in Supabase
      const { data, error } = await supabase
        .from('deals')
        .update({ stage: stageId })
        .eq('id', dealId)
        .select('*, contacts(*)');
        
      if (error) throw error;
      
      // Update local state
      setDeals(prev => 
        prev.map(d => d.id === dealId ? data[0] : d)
      );
      
      toast({
        title: "Deal updated",
        description: `Deal moved to ${PIPELINE_STAGES.find(s => s.id === stageId)?.name}`
      });
    } catch (error: any) {
      toast({
        title: "Error updating deal",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      contact_id: '',
      value: '',
      currency: 'USD',
      stage: 'lead',
      status: 'open',
      description: '',
      close_date: ''
    });
    setDate(undefined);
    setCurrentDeal(null);
  };
  
  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(value);
  };
  
  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      return `${contact.first_name} ${contact.last_name || ''}`;
    }
    return '';
  };
  
  const calculateStageValue = (stageId: string) => {
    return deals
      .filter(deal => deal.stage === stageId && deal.status === 'open')
      .reduce((total, deal) => total + (parseFloat(deal.value) || 0), 0);
  };
  
  const getStageDeals = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId && deal.status === 'open');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
          <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Deal</DialogTitle>
                <DialogDescription>
                  Fill in the deal details below. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddDeal}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Deal Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
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
                        <SelectItem value="none">No contact</SelectItem>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value">Value</Label>
                      <Input 
                        id="value"
                        name="value"
                        type="number"
                        value={formData.value}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => handleSelectChange('currency', value)}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(currency => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => handleSelectChange('stage', value)}
                    >
                      <SelectTrigger id="stage">
                        <SelectValue placeholder="Select a stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {PIPELINE_STAGES.map(stage => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="close_date">Expected Close Date</Label>
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
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Deal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloudflow-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {PIPELINE_STAGES.slice(0, 5).map((stage) => (
              <div 
                key={stage.id}
                className="min-w-[280px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <Card className={`h-full`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                      <div className="text-sm font-semibold">
                        {formatCurrency(calculateStageValue(stage.id), 'USD')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{getStageDeals(stage.id).length} deals</div>
                  </CardHeader>
                  <CardContent className="overflow-y-auto max-h-[calc(100vh-220px)]">
                    <div className="space-y-2">
                      {getStageDeals(stage.id).length === 0 ? (
                        <div className="text-center p-4 border border-dashed rounded-lg text-gray-400 text-sm">
                          Drag deals here or add a new deal
                        </div>
                      ) : (
                        getStageDeals(stage.id).map(deal => (
                          <div
                            key={deal.id}
                            className={`p-3 rounded-lg border-l-4 shadow-sm bg-white border cursor-move ${
                              stage.color
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-sm">{deal.name}</h3>
                              <div className="flex">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7"
                                  onClick={() => handleEditClick(deal)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 text-red-500"
                                  onClick={() => handleDeleteClick(deal)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            {deal.value && (
                              <div className="flex items-center text-green-600 text-sm mb-1">
                                <DollarSign className="h-3.5 w-3.5 mr-1" />
                                {formatCurrency(deal.value, deal.currency)}
                              </div>
                            )}
                            {deal.contact_id && (
                              <div className="text-xs text-gray-500 truncate">
                                {getContactName(deal.contact_id)}
                              </div>
                            )}
                            {deal.close_date && (
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(deal.close_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={isEditDealOpen} onOpenChange={setIsEditDealOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Deal</DialogTitle>
              <DialogDescription>
                Update the deal details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateDeal}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_name">Deal Name</Label>
                  <Input 
                    id="edit_name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
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
                      <SelectItem value="none">No contact</SelectItem>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_value">Value</Label>
                    <Input 
                      id="edit_value"
                      name="value"
                      type="number"
                      value={formData.value}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange('currency', value)}
                    >
                      <SelectTrigger id="edit_currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_stage">Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleSelectChange('stage', value)}
                  >
                    <SelectTrigger id="edit_stage">
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {PIPELINE_STAGES.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_close_date">Expected Close Date</Label>
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
                  <Label htmlFor="edit_description">Description</Label>
                  <Input 
                    id="edit_description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                  />
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
        <Dialog open={isDeleteDealOpen} onOpenChange={setIsDeleteDealOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Deal</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this deal? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {currentDeal && (
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">{currentDeal.name}</p>
                  {currentDeal.value && (
                    <p className="text-sm text-green-600">
                      {formatCurrency(currentDeal.value, currentDeal.currency)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Stage: {PIPELINE_STAGES.find(s => s.id === currentDeal.stage)?.name}
                  </p>
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
                onClick={handleDeleteDeal}
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

export default SalesPipeline;
