
import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Users, 
  CreditCard, 
  CheckSquare,
  PieChart,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/sales-pipeline', label: 'Sales Pipeline', icon: CreditCard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/reports', label: 'Reports', icon: PieChart },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-white">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-cloudflow-blue-500 to-cloudflow-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <span className="text-xl font-bold text-cloudflow-gray-800">Cloud Flow</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                location.pathname === item.path
                ? 'bg-cloudflow-blue-50 text-cloudflow-blue-600'
                : 'text-cloudflow-gray-600 hover:bg-cloudflow-gray-50'
              }`}
            >
              <item.icon size={18} className="mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden mr-2"
              onClick={toggleMobileMenu}
            >
              <Menu size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-cloudflow-gray-900">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cloudflow-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-10 w-64 bg-cloudflow-gray-50 border-cloudflow-gray-200"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="text-cloudflow-gray-600">
              <Bell size={18} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-cloudflow-blue-500 flex items-center justify-center text-white">
                    {userInitials}
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <SettingsIcon size={16} className="mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white h-full w-64 shadow-lg">
              <div className="p-4 border-b flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-br from-cloudflow-blue-500 to-cloudflow-blue-700 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CF</span>
                  </div>
                  <span className="text-xl font-bold text-cloudflow-gray-800">Cloud Flow</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                  <Menu size={20} />
                </Button>
              </div>
              
              <nav className="flex-1 px-4 space-y-1 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                      location.pathname === item.path
                      ? 'bg-cloudflow-blue-50 text-cloudflow-blue-600'
                      : 'text-cloudflow-gray-600 hover:bg-cloudflow-gray-50'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
