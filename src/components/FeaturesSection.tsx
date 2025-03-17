
import { 
  Users, 
  BarChart3, 
  Clock, 
  Cloud, 
  Layout, 
  Zap,
  Smartphone
} from "lucide-react";

const features = [
  {
    title: "Easy-to-Use Interface",
    description: "Designed with beginners in mind, Cloud Flow offers a simple and intuitive dashboard.",
    icon: Layout,
    color: "bg-cloudflow-blue-100 text-cloudflow-blue-600"
  },
  {
    title: "Contact Management",
    description: "Organize and manage all your customer contacts in one place.",
    icon: Users,
    color: "bg-cloudflow-purple-100 text-cloudflow-purple-500"
  },
  {
    title: "Sales Pipeline Tracking",
    description: "Visualize your sales process and track deals effortlessly.",
    icon: BarChart3,
    color: "bg-cloudflow-teal-100 text-cloudflow-teal-500"
  },
  {
    title: "Task Automation",
    description: "Automate repetitive tasks to save time and focus on what matters.",
    icon: Zap,
    color: "bg-amber-100 text-amber-600"
  },
  {
    title: "Cloud-Based Access",
    description: "Access your CRM from anywhere, anytime, on any device.",
    icon: Cloud,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Real-Time Analytics",
    description: "Get insights into your business performance with real-time reports.",
    icon: Clock,
    color: "bg-green-100 text-green-600"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-cloudflow-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-cloudflow-gray-900">
            Powerful Features, Simple Experience
          </h2>
          <p className="text-xl text-cloudflow-gray-600">
            Everything you need to manage customer relationships effectively, without the complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg p-6"
            >
              <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-cloudflow-gray-900">{feature.title}</h3>
              <p className="text-cloudflow-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-cloudflow-gray-900">
                Access Your CRM Anywhere
              </h3>
              <p className="text-lg text-cloudflow-gray-600 mb-6">
                Cloud Flow is designed to work seamlessly across all your devices. 
                Manage your customer relationships from your office desktop, laptop at home, 
                or your smartphone on the go.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time data synchronization across all devices",
                  "Responsive design that adapts to any screen size",
                  "Offline capabilities for uninterrupted workflow",
                  "Mobile app with push notifications"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cloudflow-blue-100 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-cloudflow-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-cloudflow-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-cloudflow-blue-500 to-cloudflow-blue-700 rounded-xl h-80 w-full absolute -top-6 -right-6 opacity-20"></div>
              <div className="bg-white rounded-xl shadow-xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-xs text-cloudflow-gray-500">WELCOME BACK</div>
                    <div className="text-xl font-semibold text-cloudflow-gray-900">Dashboard Overview</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-cloudflow-gray-100 flex items-center justify-center">
                    <Smartphone size={20} className="text-cloudflow-gray-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-cloudflow-gray-50 rounded-lg p-4">
                    <div className="text-xs text-cloudflow-gray-500">TOTAL CONTACTS</div>
                    <div className="text-2xl font-bold text-cloudflow-blue-600">1,248</div>
                    <div className="text-xs text-green-600 mt-1">+8.4% from last month</div>
                  </div>
                  <div className="bg-cloudflow-gray-50 rounded-lg p-4">
                    <div className="text-xs text-cloudflow-gray-500">ACTIVE DEALS</div>
                    <div className="text-2xl font-bold text-cloudflow-purple-500">36</div>
                    <div className="text-xs text-green-600 mt-1">+12.3% from last month</div>
                  </div>
                </div>
                
                <div className="bg-cloudflow-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-xs text-cloudflow-gray-500">SALES PERFORMANCE</div>
                    <div className="text-xs text-cloudflow-blue-600">This Week</div>
                  </div>
                  <div className="h-24 flex items-end space-x-2">
                    {[40, 65, 45, 80, 55, 30, 70].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-cloudflow-blue-500 rounded-t-sm" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-cloudflow-gray-500 mt-1">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </div>
                      </div>
                    ))}
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

export default FeaturesSection;
