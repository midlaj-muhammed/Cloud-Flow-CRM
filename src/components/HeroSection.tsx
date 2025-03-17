
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-hero-pattern overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cloudflow-blue-600/90 to-cloudflow-blue-800/90"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0,_transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Simplify Your Customer Relationships with Cloud Flow
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              The ultimate cloud-based CRM for beginners and pros alike.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-white text-cloudflow-blue-600 hover:bg-white/90">
                Get Started for Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 flex items-center"
              >
                <Play size={16} className="mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="h-6 bg-cloudflow-gray-100 flex items-center px-3 space-x-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-cloudflow-gray-300"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-cloudflow-gray-300"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-cloudflow-gray-300"></div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <div className="h-8 bg-cloudflow-blue-100 rounded-md mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-cloudflow-gray-100 rounded-md"></div>
                      <div className="h-6 bg-cloudflow-gray-100 rounded-md"></div>
                      <div className="h-6 bg-cloudflow-gray-100 rounded-md"></div>
                      <div className="h-6 bg-cloudflow-gray-100 rounded-md"></div>
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="h-40 bg-cloudflow-gray-50 rounded-md mb-4 border border-cloudflow-gray-200 p-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 bg-white rounded-md shadow-sm p-2">
                          <div className="h-3 w-1/2 bg-cloudflow-blue-400 rounded mb-2"></div>
                          <div className="h-8 w-full bg-cloudflow-blue-100 rounded-md"></div>
                        </div>
                        <div className="h-20 bg-white rounded-md shadow-sm p-2">
                          <div className="h-3 w-1/2 bg-cloudflow-purple-500 rounded mb-2"></div>
                          <div className="h-8 w-full bg-cloudflow-purple-100 rounded-md"></div>
                        </div>
                        <div className="h-20 bg-white rounded-md shadow-sm p-2">
                          <div className="h-3 w-1/2 bg-cloudflow-teal-500 rounded mb-2"></div>
                          <div className="h-8 w-full bg-cloudflow-teal-100 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-white rounded-md shadow-sm border border-cloudflow-gray-200"></div>
                      <div className="h-20 bg-white rounded-md shadow-sm border border-cloudflow-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="font-bold text-cloudflow-blue-600">30-Day</div>
                <div className="text-xs text-cloudflow-gray-600">Free Trial</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
