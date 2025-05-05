
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background gradient with mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ4MCIgaGVpZ2h0PSI2NTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+ICAgIDxwYXRoIGQ9Ik03MzEuMjA3IDY0OS44MDJDOTM1LjQ4NCA2NDkuODAyIDExMDIuNjMgNTA1LjQyNiAxMTAyLjYzIDMyOC4wODZDMTEwMi42MyAxNTAuNzQ2IDkzNS40ODQgNi4zNjkxNCA3MzEuMjA3IDYuMzY5MTRDNTI2LjkzIDYuMzY5MTQgMzU5Ljc4MiAxNTAuNzQ2IDM1OS43ODIgMzI4LjA4NkMzNTkuNzgyIDUwNS40MjYgNTI2LjkzIDY0OS44MDIgNzMxLjIwNyA2NDkuODAyWiIgZmlsbD0iI0YwRjdGRiIvPiAgICA8cGF0aCBkPSJNNTM5LjI2MiA2NDkuODAyQzc0My41NCA2NDkuODAyIDkxMC42ODcgNTA1LjQyNiA5MTAuNjg3IDMyOC4wODZDOTEwLjY4NyAxNTAuNzQ2IDc0My41NCA2LjM2OTE0IDUzOS4yNjIgNi4zNjkxNEMzMzQuOTg1IDYuMzY5MTQgMTY3LjgzOCAxNTAuNzQ2IDE2Ny44MzggMzI4LjA4NkMxNjcuODM4IDUwNS40MjYgMzM0Ljk4NSA2NDkuODAyIDUzOS4yNjIgNjQ5LjgwMloiIGZpbGw9IiNGMEY3RkYiLz4gICAgPHBhdGggZD0iTTM0Mi4xNzMgNjQ5LjgwMkM1NDYuNDUgNjQ5LjgwMiA3MTMuNTk3IDUwNS40MjYgNzEzLjU5NyAzMjguMDg2QzcxMy41OTcgMTUwLjc0NiA1NDYuNDUgNi4zNjkxNCAzNDIuMTczIDYuMzY5MTRDMTM3Ljg5NiA2LjM2OTE0IC0yOS4yNTIxIDE1MC43NDYgLTI5LjI1MjEgMzI4LjA4NkMtMjkuMjUyMSA1MDUuNDI2IDEzNy44OTYgNjQ5LjgwMiAzNDIuMTczIDY0OS44MDJaIiBmaWxsPSIjRjBGN0ZGIi8+PC9zdmc+')] opacity-40"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
            <div className="max-w-lg">
              <div className="inline-block py-1.5 px-4 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-100 rounded-full">
                CUSTOMER RELATIONSHIP MANAGEMENT
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900">
                Simplify Your Customer Relationships with Cloud Flow
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The ultimate cloud-based CRM for beginners and pros alike. Manage contacts, track deals, and grow your business effortlessly.
              </p>
              <div className="flex flex-wrap items-center">
                <Link to="/auth" className="mr-4 mb-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="mb-4 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center">
                  <Play className="mr-2 h-4 w-4 fill-blue-600" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <div className="flex mr-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
                <div>
                  <span className="font-medium">4.9/5</span> from over <span className="font-medium">1,000+ reviews</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="relative mx-auto">
              {/* Device frame */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 p-2">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 flex items-center px-2 rounded-t-xl">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <img
                  className="relative rounded-lg mt-4"
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2940&auto=format&fit=crop"
                  alt="Cloud Flow CRM Dashboard"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-purple-500 rounded-full opacity-20 blur-xl animate-float"></div>
              <div className="absolute top-1/4 right-0 translate-x-1/4 w-20 h-20 bg-cloudflow-teal-500 rounded-lg opacity-20 blur-md animate-float"></div>
              <div className="absolute bottom-1/3 left-0 -translate-x-1/4 w-16 h-16 bg-cloudflow-blue-600 rounded-lg opacity-30 blur-md animate-float" style={{ animationDelay: "2s" }}></div>

              {/* Floating UI elements for visual interest */}
              <div className="absolute top-1/4 -left-6 bg-white rounded-lg shadow-lg p-3 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Task completed</div>
                    <div className="text-xs text-gray-500">Just now</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 -right-6 bg-white rounded-lg shadow-lg p-3 animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">New lead</div>
                    <div className="text-xs text-gray-500">5m ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
