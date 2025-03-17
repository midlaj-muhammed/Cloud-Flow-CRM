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
            <div className="relative mx-auto max-w-md">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  className="relative w-full shadow-2xl border border-gray-200"
                  src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/40dc2c110867127.5ff70557e47d9.png"
                  alt="Bronox CRM Dashboard"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/10 to-indigo-600/20 backdrop-blur-[2px] rounded-lg"></div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-lg opacity-40 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-purple-500 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
