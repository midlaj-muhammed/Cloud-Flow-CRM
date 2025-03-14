import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                CloudFlow{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  CRM
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                A streamlined SaaS CRM dashboard that enables you to manage
                customer relationships through an intuitive interface with
                comprehensive tracking capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href={user ? "/dashboard" : "/sign-up"}
                  className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                  alt="CloudFlow CRM Dashboard"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful CRM Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage customer relationships effectively
              in one intuitive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Comprehensive Dashboard",
                description:
                  "View key metrics, recent interactions, and upcoming follow-ups at a glance",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Customer Management",
                description:
                  "Searchable and filterable customer database with complete interaction history",
              },
              {
                icon: <ClipboardList className="w-6 h-6" />,
                title: "Task Management",
                description:
                  "Organize follow-ups with reminder notifications and priority indicators",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Quick-Add Functionality",
                description:
                  "Add new customers and log interactions with customizable fields",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Data Storage",
                description:
                  "Enterprise-grade security for all your customer information",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Mobile Optimized",
                description:
                  "Access your CRM on any device with responsive design",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Customers Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Streamline Your Customer Relationships?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust CloudFlow CRM to manage
            their customer relationships effectively.
          </p>
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {user ? "Go to Dashboard" : "Start Your Free Trial"}
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
