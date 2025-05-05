
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
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50",
    delay: "0s"
  },
  {
    title: "Contact Management",
    description: "Organize and manage all your customer contacts in one place.",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    lightColor: "bg-purple-50",
    delay: "0.1s"
  },
  {
    title: "Sales Pipeline Tracking",
    description: "Visualize your sales process and track deals effortlessly.",
    icon: BarChart3,
    color: "from-teal-500 to-teal-600",
    lightColor: "bg-teal-50",
    delay: "0.2s"
  },
  {
    title: "Task Automation",
    description: "Automate repetitive tasks to save time and focus on what matters.",
    icon: Zap,
    color: "from-amber-500 to-amber-600",
    lightColor: "bg-amber-50",
    delay: "0.3s"
  },
  {
    title: "Cloud-Based Access",
    description: "Access your CRM from anywhere, anytime, on any device.",
    icon: Cloud,
    color: "from-blue-400 to-blue-500",
    lightColor: "bg-blue-50",
    delay: "0.4s"
  },
  {
    title: "Real-Time Analytics",
    description: "Get insights into your business performance with real-time reports.",
    icon: Clock,
    color: "from-green-500 to-green-600",
    lightColor: "bg-green-50",
    delay: "0.5s"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-blue-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block py-1.5 px-4 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-100 rounded-full">
            FEATURES
          </div>
          <h2 className="text-4xl font-bold mb-6 text-cloudflow-gray-900 leading-tight">
            Powerful Features, <span className="text-blue-600">Simple Experience</span>
          </h2>
          <p className="text-xl text-cloudflow-gray-600 leading-relaxed">
            Everything you need to manage customer relationships effectively, without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl p-8 border border-gray-100 hover:border-blue-100 hover:-translate-y-2 group"
              style={{ transitionDelay: feature.delay }}
            >
              <div className={`${feature.lightColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`bg-gradient-to-br ${feature.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md`}>
                  <feature.icon size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-cloudflow-gray-900 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
              <p className="text-cloudflow-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-10 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block py-1.5 px-4 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-100 rounded-full">
                CROSS-PLATFORM
              </div>
              <h3 className="text-3xl font-bold mb-6 text-cloudflow-gray-900 leading-tight">
                Access Your CRM <span className="text-blue-600">Anywhere</span>
              </h3>
              <p className="text-lg text-cloudflow-gray-600 mb-8 leading-relaxed">
                Cloud Flow is designed to work seamlessly across all your devices.
                Manage your customer relationships from your office desktop, laptop at home,
                or your smartphone on the go.
              </p>
              <ul className="space-y-5">
                {[
                  "Real-time data synchronization across all devices",
                  "Responsive design that adapts to any screen size",
                  "Offline capabilities for uninterrupted workflow",
                  "Mobile app with push notifications"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mt-0.5 shadow-md shadow-blue-100">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-4 text-cloudflow-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative order-1 lg:order-2">
              {/* Phone mockup */}
              <div className="relative mx-auto max-w-xs">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-[3rem] h-[600px] w-[300px] absolute -top-6 -right-6 opacity-20 blur-lg"></div>
                <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl relative border-8 border-gray-800">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl"></div>
                  <div className="bg-white rounded-[2.5rem] h-[550px] overflow-hidden">
                    {/* App header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-xs opacity-80">Welcome back</div>
                          <div className="text-lg font-semibold">John Doe</div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Smartphone size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 flex justify-between text-xs">
                        <div className="text-center">
                          <div className="font-bold text-lg">36</div>
                          <div>Tasks</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">12</div>
                          <div>Deals</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">248</div>
                          <div>Contacts</div>
                        </div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-semibold text-gray-900">Today's Tasks</div>
                        <div className="text-xs text-blue-600">View All</div>
                      </div>

                      {/* Task items */}
                      {[
                        { title: "Call with Marketing Team", time: "10:00 AM", completed: true },
                        { title: "Review Sales Proposal", time: "1:30 PM", completed: false },
                        { title: "Send Follow-up Email", time: "3:00 PM", completed: false }
                      ].map((task, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${task.completed ? 'bg-green-100' : 'border-2 border-gray-300'}`}>
                            {task.completed && (
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</div>
                            <div className="text-xs text-gray-500">{task.time}</div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6 mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-semibold text-gray-900">Recent Activity</div>
                          <div className="text-xs text-blue-600">View All</div>
                        </div>

                        <div className="space-y-3">
                          {[
                            { title: "New lead created", time: "5m ago", icon: "+" },
                            { title: "Deal status updated", time: "1h ago", icon: "↑" },
                            { title: "Meeting scheduled", time: "3h ago", icon: "📅" }
                          ].map((activity, i) => (
                            <div key={i} className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-bold">
                                {activity.icon}
                              </div>
                              <div>
                                <div className="text-sm text-gray-900">{activity.title}</div>
                                <div className="text-xs text-gray-500">{activity.time}</div>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
