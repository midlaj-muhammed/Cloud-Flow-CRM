
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                Simplify Your Customer Relationships with Cloud Flow
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The ultimate cloud-based CRM for beginners and pros alike. Manage contacts, track deals, and grow your business effortlessly.
              </p>
              <div className="flex flex-wrap">
                <Link to="/auth">
                  <Button className="mr-4 mb-4 bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Get Started for Free
                  </Button>
                </Link>
                <Button variant="outline" className="mb-4">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="relative mx-auto max-w-md md:max-w-lg lg:max-w-xl">
              <img
                className="relative rounded-xl shadow-2xl border border-gray-200"
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2940&auto=format&fit=crop"
                alt="Cloud Flow CRM Dashboard"
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-xl animate-float"></div>
              
              {/* Add floating elements for more visual interest */}
              <div className="absolute top-1/4 right-0 translate-x-1/4 w-16 h-16 bg-cloudflow-teal-500 rounded-lg opacity-20 blur-md animate-float"></div>
              <div className="absolute bottom-1/3 left-0 -translate-x-1/4 w-12 h-12 bg-cloudflow-blue-600 rounded-lg opacity-30 blur-md animate-float" style={{ animationDelay: "2s" }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
