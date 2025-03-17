
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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardPreview = () => {
  return (
    <div className="min-h-screen bg-cloudflow-gray-50">
      <div className="flex bg-white border-b border-cloudflow-gray-200 shadow-sm">
        {/* Sidebar */}
        <div className="w-64 border-r border-cloudflow-gray-200 py-6 px-4 hidden lg:block">
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-cloudflow-blue-500 to-cloudflow-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <span className="text-xl font-bold text-cloudflow-gray-800">Cloud Flow</span>
          </div>
          
          <nav className="space-y-1">
            {[
              { name: "Dashboard", icon: BarChart, active: true },
              { name: "Contacts", icon: Users, active: false },
              { name: "Deals", icon: CreditCard, active: false },
              { name: "Tasks", icon: CheckCircle, active: false },
              { name: "Calendar", icon: Calendar, active: false },
              { name: "Email", icon: Mail, active: false }
            ].map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className={`w-full justify-start ${item.active ? 'bg-cloudflow-blue-50 text-cloudflow-blue-600' : 'text-cloudflow-gray-600 hover:bg-cloudflow-gray-100'}`}
              >
                <item.icon size={18} className="mr-3" />
                {item.name}
              </Button>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-cloudflow-gray-200 mt-8">
            <Button variant="outline" className="w-full">
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="px-6 py-4 border-b border-cloudflow-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="lg:hidden mr-2">
                <Menu size={20} />
              </Button>
              <h1 className="text-xl font-bold text-cloudflow-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cloudflow-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64 bg-cloudflow-gray-50 border-cloudflow-gray-200"
                />
              </div>
              
              <Button variant="ghost" size="sm">
                <Bell size={18} />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-cloudflow-blue-500 flex items-center justify-center text-white font-medium">
                  JS
                </div>
                <span className="text-sm font-medium text-cloudflow-gray-700 hidden md:inline-block">
                  John Smith
                </span>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { title: "Total Contacts", value: "1,248", change: "+8.4%", icon: Users, color: "bg-cloudflow-blue-100 text-cloudflow-blue-500" },
                { title: "Active Deals", value: "$12.6k", change: "+12.3%", icon: CreditCard, color: "bg-cloudflow-purple-100 text-cloudflow-purple-500" },
                { title: "Completed Tasks", value: "64", change: "+7.2%", icon: CheckCircle, color: "bg-green-100 text-green-600" },
                { title: "Upcoming Meetings", value: "8", change: "+2", icon: Calendar, color: "bg-amber-100 text-amber-600" }
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-cloudflow-gray-500">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <div className="text-xs text-green-600 mt-1">{item.change} from last month</div>
                      </div>
                      <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center`}>
                        <item.icon size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2">
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
                        <div key={i} className="flex flex-1 flex-col items-center">
                          <div className="w-full relative">
                            <div 
                              className="w-full bg-cloudflow-blue-100 rounded-sm relative" 
                              style={{ height: `${[60, 85, 40, 75, 60, 90][i]}%` }}
                            >
                              <div 
                                className="absolute bottom-0 left-0 w-full bg-cloudflow-blue-500 rounded-sm" 
                                style={{ height: `${[35, 50, 20, 45, 30, 60][i]}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="mt-2 text-xs text-cloudflow-gray-500">{month}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center space-x-8 mt-4 text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-sm bg-cloudflow-blue-500 mr-2"></div>
                        <span className="text-cloudflow-gray-600">Revenue</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-sm bg-cloudflow-blue-100 mr-2"></div>
                        <span className="text-cloudflow-gray-600">Profit</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Sales Pipeline</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: "Leads", count: 125, value: 83, color: "bg-cloudflow-blue-500" },
                      { stage: "Qualified", count: 78, value: 65, color: "bg-cloudflow-purple-500" },
                      { stage: "Proposal", count: 42, value: 48, color: "bg-cyan-500" },
                      { stage: "Negotiation", count: 18, value: 30, color: "bg-amber-500" },
                      { stage: "Closed Won", count: 12, value: 20, color: "bg-green-500" }
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Contacts</CardTitle>
                  <Button size="sm" className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600">
                    <Plus size={16} className="mr-1" />
                    Add Contact
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Alex Johnson", company: "TechCorp", email: "alex@techcorp.com", phone: "+1 234 567 890", lastContact: "2 days ago" },
                      { name: "Sarah Williams", company: "Design Studio", email: "sarah@designstudio.com", phone: "+1 987 654 321", lastContact: "1 week ago" },
                      { name: "Michael Brown", company: "Marketing Inc", email: "michael@marketing.com", phone: "+1 555 123 456", lastContact: "3 days ago" },
                      { name: "Emma Davis", company: "Sales Pro", email: "emma@salespro.com", phone: "+1 222 333 444", lastContact: "Today" }
                    ].map((contact, i) => (
                      <div key={i} className="p-4 border border-cloudflow-gray-200 rounded-lg hover:bg-cloudflow-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`h-10 w-10 rounded-full bg-cloudflow-blue-${i % 2 === 0 ? '100' : '500'} flex items-center justify-center ${i % 2 === 0 ? 'text-cloudflow-blue-500' : 'text-white'}`}>
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-cloudflow-gray-900">{contact.name}</div>
                              <div className="text-sm text-cloudflow-gray-500">{contact.company}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2 text-cloudflow-gray-400">
                            <Button variant="ghost" size="sm" className="hover:text-cloudflow-blue-500">
                              <Mail size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:text-cloudflow-blue-500">
                              <Phone size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Call with Client", time: "Today, 2:00 PM", priority: "High" },
                      { title: "Prepare Proposal", time: "Tomorrow, 10:00 AM", priority: "Medium" },
                      { title: "Send Follow-up Email", time: "Today, 4:30 PM", priority: "Low" },
                      { title: "Team Meeting", time: "Thursday, 9:00 AM", priority: "Medium" }
                    ].map((task, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 border border-cloudflow-gray-200 rounded-lg">
                        <div className={`h-5 w-5 mt-0.5 rounded-full flex-shrink-0 ${
                          task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                          task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-cloudflow-gray-900">{task.title}</div>
                          <div className="flex items-center text-xs text-cloudflow-gray-500 mt-1">
                            <Clock size={12} className="mr-1" />
                            {task.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;

// These icons are used in the component but not imported
const Settings = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

const Bell = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
};

const Menu = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
};
