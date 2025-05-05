
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "GrowthTech",
    content: "Cloud Flow has transformed how we manage our client relationships. It's intuitive, powerful, and has helped us increase our customer retention by 40%.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    name: "Michael Brown",
    role: "Sales Manager",
    company: "Velocity Inc.",
    content: "As someone who's used many CRMs before, I can confidently say Cloud Flow is the most user-friendly. My team was up and running in minutes, not days.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/34.jpg"
  },
  {
    name: "Emma Garcia",
    role: "Small Business Owner",
    company: "Bright Ideas Studio",
    content: "Cloud Flow has been a game-changer for my small business. It's affordable, easy to use, and gives me insights I never had before. Highly recommend!",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
];

// Company logos with their names
const companyLogos = [
  {
    name: "Dropbox",
    logo: "https://cdn.worldvectorlogo.com/logos/dropbox-1.svg"
  },
  {
    name: "Slack",
    logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg"
  },
  {
    name: "Shopify",
    logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg"
  },
  {
    name: "Spotify",
    logo: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg"
  },
  {
    name: "Airbnb",
    logo: "https://cdn.worldvectorlogo.com/logos/airbnb.svg"
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xem0tMiAwaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yIDBoMXYxaC0xdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block py-1.5 px-4 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-100 rounded-full">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl font-bold mb-6 text-cloudflow-gray-900 leading-tight">
            Loved by <span className="text-blue-600">Businesses Everywhere</span>
          </h2>
          <p className="text-xl text-cloudflow-gray-600 leading-relaxed">
            Don't just take our word for it. See what our customers have to say about Cloud Flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl border border-gray-100 p-8 hover:-translate-y-2 group"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <StarIcon key={i + testimonial.rating} size={20} className="text-cloudflow-gray-300 fill-cloudflow-gray-300" />
                ))}
              </div>

              <p className="text-cloudflow-gray-700 mb-8 leading-relaxed text-lg">"{testimonial.content}"</p>

              <div className="flex items-center pt-4 border-t border-gray-100">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h4 className="font-bold text-cloudflow-gray-900 group-hover:text-blue-600 transition-colors duration-300">{testimonial.name}</h4>
                  <p className="text-sm text-cloudflow-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-gray-200 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-5 blur-2xl"></div>
          <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-purple-500 rounded-full opacity-5 blur-2xl"></div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-cloudflow-gray-900 mb-4">
              Trusted by Innovative Companies
            </h3>
            <p className="text-cloudflow-gray-600 max-w-2xl mx-auto text-lg">
              Join thousands of leading organizations who trust Cloud Flow for their customer relationship management
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
            {companyLogos.map((company, index) => (
              <div key={index} className="group transition-all duration-300 hover:scale-110">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                />
                <div className="text-xs text-cloudflow-gray-500 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {company.name}
                </div>
              </div>
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Active Users" },
              { number: "5M+", label: "Contacts Managed" },
              { number: "98%", label: "Customer Satisfaction" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-cloudflow-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
