
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for individuals and small teams just getting started.",
    features: [
      "Up to 100 contacts",
      "Basic contact management",
      "Email integration",
      "Limited pipeline view",
      "Mobile app access"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
    popular: false
  },
  {
    name: "Pro",
    price: "29",
    description: "Everything you need for growing businesses with advanced needs.",
    features: [
      "Unlimited contacts",
      "Advanced contact management",
      "Email and calendar integration",
      "Full pipeline customization",
      "Task automation",
      "Advanced reporting",
      "Team collaboration tools",
      "API access"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default",
    popular: true
  },
  {
    name: "Enterprise",
    price: "99",
    description: "Custom solutions for large organizations with complex requirements.",
    features: [
      "Everything in Pro",
      "Custom user roles",
      "Dedicated account manager",
      "Enterprise security features",
      "Advanced workflow automation",
      "Custom integrations",
      "Data migration service",
      "24/7 priority support"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-cloudflow-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-cloudflow-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-cloudflow-gray-600">
            Choose the plan that fits your business needs. All plans come with a 30-day money-back guarantee.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl transition-all duration-300 p-8 ${plan.popular ? 'shadow-xl border-2 border-cloudflow-blue-500 relative' : 'shadow-md border border-cloudflow-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cloudflow-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-cloudflow-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-cloudflow-gray-500 text-lg">$</span>
                  <span className="text-4xl font-bold text-cloudflow-gray-900">{plan.price}</span>
                  <span className="text-cloudflow-gray-500 ml-1">/month</span>
                </div>
                <p className="text-cloudflow-gray-600">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-cloudflow-blue-100 flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-cloudflow-blue-600" />
                    </div>
                    <span className="ml-3 text-cloudflow-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.buttonVariant as "outline" | "default"} 
                size="lg"
                className={`w-full ${plan.popular ? 'bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600 text-white' : 'border-cloudflow-blue-500 text-cloudflow-blue-500'}`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-md border border-cloudflow-gray-200 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-cloudflow-gray-900 mb-2">
              Need a custom solution?
            </h3>
            <p className="text-lg text-cloudflow-gray-600">
              We offer customized plans for businesses with specific requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                title: "Custom Integrations",
                description: "Connect Cloud Flow with your existing business tools and systems."
              },
              {
                title: "Personalized Training",
                description: "Get your team up to speed with dedicated training sessions."
              },
              {
                title: "Dedicated Support",
                description: "Access to a dedicated account manager and priority support."
              }
            ].map((item, i) => (
              <div key={i} className="p-4">
                <h4 className="font-semibold text-cloudflow-gray-900 mb-2">{item.title}</h4>
                <p className="text-cloudflow-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="default" size="lg" className="bg-cloudflow-blue-500 hover:bg-cloudflow-blue-600">
              Contact Our Sales Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
