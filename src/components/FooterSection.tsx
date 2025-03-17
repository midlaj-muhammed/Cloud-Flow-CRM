
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-cloudflow-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-cloudflow-blue-500 to-cloudflow-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CF</span>
              </div>
              <span className="text-xl font-bold">Cloud Flow</span>
            </div>
            <p className="text-cloudflow-gray-400 mb-6">
              Revolutionize your customer relationships with Cloud Flow - the ultimate CRM solution for businesses of all sizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cloudflow-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-cloudflow-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-cloudflow-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-cloudflow-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              {[
                { name: "Features", url: "#features" },
                { name: "Pricing", url: "#pricing" },
                { name: "Dashboard", url: "/dashboard" },
                { name: "Mobile App", url: "#" },
                { name: "Integrations", url: "#" }
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.url} className="text-cloudflow-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              {[
                { name: "About Us", url: "#" },
                { name: "Careers", url: "#" },
                { name: "Blog", url: "#" },
                { name: "Press", url: "#" },
                { name: "Contact", url: "#" }
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.url} className="text-cloudflow-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { name: "Help Center", url: "#" },
                { name: "Documentation", url: "#" },
                { name: "API Reference", url: "#" },
                { name: "Status", url: "#" },
                { name: "Privacy Policy", url: "#" }
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.url} className="text-cloudflow-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cloudflow-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cloudflow-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 Cloud Flow. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-cloudflow-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="#" className="text-cloudflow-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="#" className="text-cloudflow-gray-400 hover:text-white transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
