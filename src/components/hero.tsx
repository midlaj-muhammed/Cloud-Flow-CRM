import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                CloudFlow{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  CRM
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                A streamlined SaaS CRM dashboard that enables you to manage
                customer relationships through an intuitive interface with
                comprehensive tracking capabilities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Get Started Free
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="#features"
                  className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                >
                  Learn More
                </Link>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
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
      </div>
    </div>
  );
}
