
import { StarIcon } from "lucide-react";

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

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-cloudflow-gray-900">
            Loved by Businesses Everywhere
          </h2>
          <p className="text-xl text-cloudflow-gray-600">
            Don't just take our word for it. See what our customers have to say about Cloud Flow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-cloudflow-gray-100 p-6"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <StarIcon key={i + testimonial.rating} size={20} className="text-cloudflow-gray-300 fill-cloudflow-gray-300" />
                ))}
              </div>
              
              <p className="text-cloudflow-gray-600 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover" 
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-cloudflow-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-cloudflow-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-cloudflow-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-cloudflow-gray-800">
              Trusted by innovative companies
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="h-12">
                <div className="h-full w-32 bg-cloudflow-gray-200 rounded-md opacity-50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
