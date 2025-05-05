
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
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-blue-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block py-1.5 px-4 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-100 rounded-full">
            PRICING
          </div>
          <h2 className="text-4xl font-bold mb-6 text-cloudflow-gray-900 leading-tight">
            Simple, <span className="text-blue-600">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-cloudflow-gray-600 leading-relaxed">
            Choose the plan that fits your business needs. All plans come with a 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing toggle - Annual/Monthly */}
        <div className="flex justify-center items-center mb-12">
          <span className="text-cloudflow-gray-600 mr-3 font-medium">Monthly</span>
          <div className="relative inline-block w-12 h-6 bg-blue-100 rounded-full cursor-pointer">
            <div className="absolute left-1 top-1 bg-blue-600 w-4 h-4 rounded-full transition-transform duration-300"></div>
          </div>
          <span className="text-cloudflow-gray-900 ml-3 font-medium">Annual <span className="text-green-600 text-xs font-bold">Save 20%</span></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl transition-all duration-500 p-8 hover:-translate-y-2 ${
                plan.popular
                  ? 'shadow-xl border-2 border-blue-500 relative z-10 scale-105 md:scale-110'
                  : 'shadow-lg border border-gray-200 hover:border-blue-200 hover:shadow-xl'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-md">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-4 ${plan.popular ? 'text-blue-600' : 'text-cloudflow-gray-900'}`}>{plan.name}</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-cloudflow-gray-500 text-xl">$</span>
                  <span className="text-5xl font-bold text-cloudflow-gray-900">{plan.price}</span>
                  <span className="text-cloudflow-gray-500 ml-1 text-lg">/month</span>
                </div>
                <p className="text-cloudflow-gray-600 leading-relaxed">{plan.description}</p>
              </div>

              <div className={`h-px w-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'} my-6`}></div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mt-0.5`}>
                      <Check size={12} className={`${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <span className="ml-3 text-cloudflow-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.buttonVariant as "outline" | "default"}
                size="lg"
                className={`w-full rounded-xl py-6 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                    : 'border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>

          <div className="text-center mb-12 relative z-10">
            <div className="inline-block py-1.5 px-4 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-100 rounded-full">
              ENTERPRISE
            </div>
            <h3 className="text-3xl font-bold text-cloudflow-gray-900 mb-4">
              Need a custom solution?
            </h3>
            <p className="text-xl text-cloudflow-gray-600 max-w-2xl mx-auto leading-relaxed">
              We offer customized plans for businesses with specific requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Custom Integrations",
                description: "Connect Cloud Flow with your existing business tools and systems.",
                icon: "🔄"
              },
              {
                title: "Personalized Training",
                description: "Get your team up to speed with dedicated training sessions.",
                icon: "🎓"
              },
              {
                title: "Dedicated Support",
                description: "Access to a dedicated account manager and priority support.",
                icon: "🛡️"
              }
            ].map((item, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold text-cloudflow-gray-900 mb-3">{item.title}</h4>
                <p className="text-cloudflow-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Our Sales Team
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-cloudflow-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-cloudflow-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll be able to use Cloud Flow until the end of your billing period."
              },
              {
                question: "Is there a free trial available?",
                answer: "Yes, we offer a 14-day free trial on all paid plans. No credit card required to start your trial."
              },
              {
                question: "Can I change my plan later?",
                answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h4 className="text-lg font-bold text-cloudflow-gray-900 mb-3">{faq.question}</h4>
                <p className="text-cloudflow-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
