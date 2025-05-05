
import AuthForm from "@/components/auth/AuthForm";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Cloud Flow</span>
              <span className="text-xs text-gray-500 -mt-1">Smart CRM Solution</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left side - Illustration and text */}
          <div>
            {/* Desktop illustration - hidden on mobile */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
              <img
                src="/auth-illustration.svg"
                alt="CRM Dashboard Illustration"
                className="w-full max-w-md mx-auto"
              />
            </div>

            {/* Mobile illustration - only shown on mobile */}
            <div className="relative mx-auto max-w-xs mb-8 lg:hidden">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
              <img
                src="/auth-illustration-mobile.svg"
                alt="CRM Dashboard Illustration"
                className="w-full mx-auto"
              />
            </div>

            <div className="mt-4 lg:mt-8 text-center">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-4">Streamline Your Customer Relationships</h2>
              <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
                Join thousands of businesses using Cloud Flow to manage contacts, track deals, and grow their business.
              </p>

              {/* Trust badges */}
              <div className="mt-4 lg:mt-8">
                <div className="text-xs lg:text-sm text-gray-500 mb-2 lg:mb-3">Trusted by innovative companies</div>
                <div className="flex justify-center space-x-4 lg:space-x-6">
                  {['Acme Inc', 'Globex', 'Initech', 'Umbrella'].map((company, i) => (
                    <div key={i} className="text-gray-400 font-semibold text-xs lg:text-sm">{company}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
