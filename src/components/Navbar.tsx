
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-cloudflow-blue-500 to-cloudflow-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">CF</span>
          </div>
          <span className="text-xl font-bold text-cloudflow-gray-800">Cloud Flow</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="space-x-6">
            <Link to="/" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 transition-colors">
              Home
            </Link>
            <Link to="#features" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 transition-colors">
              Features
            </Link>
            <Link to="#pricing" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 transition-colors">
              Pricing
            </Link>
            <Link to="/dashboard" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 transition-colors">
              Dashboard
            </Link>
          </div>
          <div className="space-x-3">
            <Button variant="outline" className="border-cloudflow-blue-500 text-cloudflow-blue-500 hover:text-cloudflow-blue-600 hover:border-cloudflow-blue-600">
              Log in
            </Button>
            <Button className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white">
              Sign up
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu} className="text-cloudflow-gray-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-md z-50 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 py-2 transition-colors" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="#features" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 py-2 transition-colors" onClick={toggleMenu}>
              Features
            </Link>
            <Link to="#pricing" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 py-2 transition-colors" onClick={toggleMenu}>
              Pricing
            </Link>
            <Link to="/dashboard" className="text-cloudflow-gray-600 hover:text-cloudflow-blue-600 py-2 transition-colors" onClick={toggleMenu}>
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-cloudflow-gray-100">
              <Button variant="outline" className="border-cloudflow-blue-500 text-cloudflow-blue-500 w-full">
                Log in
              </Button>
              <Button className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white w-full">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
