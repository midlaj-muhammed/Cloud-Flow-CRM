
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Cloud Flow</span>
              <span className="text-xs text-gray-500 -mt-1">Smart CRM Solution</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
            >
              Home
            </Link>
            <HashLink
              to="/#features"
              className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
              smooth
            >
              Features
            </HashLink>
            <HashLink
              to="/#pricing"
              className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
              smooth
            >
              Pricing
            </HashLink>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-300">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-300"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-5 pb-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                Home
              </Link>
              <HashLink
                to="/#features"
                className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
                smooth
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                Features
              </HashLink>
              <HashLink
                to="/#pricing"
                className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
                smooth
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                Pricing
              </HashLink>

              <div className="pt-2 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/dashboard"
                      className="text-blue-600 font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                      Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600 p-0 hover:bg-transparent"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={18} className="mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
