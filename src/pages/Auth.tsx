
import AuthForm from "@/components/auth/AuthForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cloudflow-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cloudflow-gray-900">Cloud Flow</h1>
          <p className="text-cloudflow-gray-600">Sign in to your CRM dashboard</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
