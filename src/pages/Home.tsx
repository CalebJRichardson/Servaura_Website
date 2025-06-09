import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  Home as HomeIcon, 
  Droplet, 
  Wind, 
  Sun, 
  Waves, 
  Zap,
  Wrench,
  Thermometer,
  PictureInPicture
} from 'lucide-react';

// Import images
import heroImage from '../assets/iStock-682432560.jpg';
import aboutImage from '../assets/iStock-1127580796.jpg';
import customizeImage from '../assets/iStock-2155879539.jpg';

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex items-center h-[100vh]" 
        style={{
          backgroundImage: `var(--hero-overlay), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-gold bg-clip-text text-transparent">
              Luxury Home Services Made Simple
            </h1>
            <p className="text-lg mb-8 leading-relaxed text-white">
              Experience the ultimate in home maintenance with Servaura's subscription-based services. 
              Professional care for your home, on your schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/plans">
                <Button variant="primary">Explore Plans</Button>
              </Link>
              <Link to="/schedule-call">
                <Button variant="secondary" className="text-white">Schedule a Call</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute w-48 h-48 rounded-full bg-gradient-radial from-accent/10 to-transparent top-24 left-[10%]" />
        <div className="absolute w-48 h-48 rounded-full bg-gradient-radial from-accent/10 to-transparent bottom-24 right-[5%]" />
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary relative overflow-hidden" id="about">
        <div className="container mx-auto px-4">
          <h2 className="section-title">About Servaura</h2>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 animate-slide-up">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-accent">
                Redefining Home Maintenance
              </h3>
              <p className="mb-4 leading-relaxed">
                At Servaura, we believe your home deserves the same level of care and attention as the world's finest 
                luxury vehicles. We've created a revolutionary subscription model that provides consistent, high-quality 
                home services without the hassle of scheduling individual contractors.
              </p>
              <p className="mb-8 leading-relaxed">
                Our vetted network of elite service providers delivers exceptional results every time, while our concierge 
                team ensures your complete satisfaction with every service performed.
              </p>
              <Link to="/plans">
                <Button variant="primary">Learn More</Button>
              </Link>
            </div>
            <div className="lg:w-1/2 h-80 lg:h-96">
              <div className="h-full w-full rounded overflow-hidden border-2 border-accent-gradient-dark shadow-card">
                <img 
                  src={aboutImage} 
                  alt="Luxury home interior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-primary relative" id="plans">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Subscription Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className="bg-secondary p-8 rounded relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-card border border-transparent hover:border-accent-gradient-dark flex flex-col"
              >
                {/* Gold accent at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
                
                {plan.popular && (
                  <div className="absolute top-4 right-0 bg-gradient-gold text-primary text-xs font-bold py-1 px-6 rotate-45 translate-x-4">
                    POPULAR
                  </div>
                )}
                
                <h3 className="text-xl font-bold uppercase mb-2">{plan.name}</h3>
                <div className="flex-grow">
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-accent mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link to="/schedule-call" className="mt-auto">
                  <Button variant="primary" className="w-full">Select Plan</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary relative" id="services">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.title}
                className="bg-primary p-8 rounded transition-all duration-300 hover:-translate-y-2 hover:shadow-card border-b-3 border-transparent hover:border-b-accent"
              >
                <div className="text-accent mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-accent mb-4">{service.title}</h3>
                <p className="text-gray mb-6">{service.description}</p>
                <Link to="/services">
                  <Button variant="secondary" className="text-sm">Learn More</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customize Section */}
      <section className="py-20 bg-primary relative" id="customize">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Customize Your Plan</h2>
          
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="lg:w-1/2 animate-slide-up">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-accent">
                Tailored to Your Home's Needs
              </h3>
              <p className="mb-4 leading-relaxed">
                Every home is unique, and so are your maintenance needs. Our customizable plans allow you to 
                add or modify services to create the perfect maintenance schedule for your home.
              </p>
              <p className="mb-8 leading-relaxed">
                Work with our concierge team to select additional services, adjust service frequencies, or schedule 
                special seasonal services to keep your home in perfect condition year-round.
              </p>
              <Link to="/customize">
                <Button variant="primary">Customize Now</Button>
              </Link>
            </div>
            <div className="lg:w-1/2 h-80 lg:h-96">
              <div className="h-full w-full rounded overflow-hidden border-2 border-accent-gradient-dark shadow-card">
                <img 
                  src={customizeImage} 
                  alt="Luxury home interior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-gold text-primary text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">Speak With a Home Services Specialist</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Let our experts help you design the perfect maintenance plan for your home. 
            Schedule a consultation call today.
          </p>
          <Link to="/schedule-call">
            <Button variant="white" className="inline-flex items-center gap-2">
              <span>📞</span> Schedule a Call
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

// Data
const plans = [
  {
    name: 'Basic',
    features: [
      'Monthly cleaning service',
      'Quarterly lawn maintenance',
      'Annual HVAC inspection',
    ],
    popular: false,
  },
  {
    name: 'Standard',
    features: [
      'Bi-weekly cleaning service',
      'Monthly lawn maintenance',
      'Quarterly HVAC service',
      'Annual window washing',
      'One service contractor visit',
    ],
    popular: false,
  },
  {
    name: 'Premium',
    features: [
      'Weekly cleaning service',
      'Bi-weekly lawn care',
      'Quarterly HVAC service',
      'Quarterly window washing',
      'Annual power washing',
      'Two service contractor visits',
    ],
    popular: true,
  },
  {
    name: 'Luxury',
    features: [
      'Twice weekly cleaning',
      'Weekly lawn and garden care',
      'Quarterly HVAC service',
      'Monthly window washing',
      'Quarterly power washing',
      'Unlimited service contractor visits',
    ],
    popular: false,
  },
];

const services = [
  {
    title: 'Home Cleaning',
    description: 'Professional cleaning services tailored to your home\'s unique needs, using premium eco-friendly products.',
    icon: <HomeIcon size={32} />,
  },
  {
    title: 'Window Cleaning',
    description: 'Crystal clear results for all your windows, enhancing natural light and your home\'s appearance.',
    icon: <PictureInPicture size={32} />,
  },
  {
    title: 'Lawn & Garden',
    description: 'Expert landscaping and garden maintenance to keep your outdoor spaces beautiful year-round.',
    icon: <Droplet size={32} />,
  },
  {
    title: 'Power Washing',
    description: 'High-pressure cleaning for driveways, decks, and exteriors to remove dirt, grime, and restore surfaces.',
    icon: <Wind size={32} />,
  },
  {
    title: 'Solar Panel Cleaning',
    description: 'Specialized cleaning to maintain optimal efficiency and longevity of your solar panel investment.',
    icon: <Sun size={32} />,
  },
  {
    title: 'Pool Maintenance',
    description: 'Complete pool care services to keep your swimming pool clean, balanced, and ready to enjoy.',
    icon: <Waves size={32} />,
  },
  {
    title: 'HVAC',
    description: 'Regular maintenance and inspections to ensure your heating and cooling systems operate at peak efficiency.',
    icon: <Thermometer size={32} />,
  },
  {
    title: 'Plumbing',
    description: 'Professional plumbing services to maintain your home\'s water systems and prevent costly damages.',
    icon: <Droplet size={32} />,
  },
  {
    title: 'Electrical',
    description: 'Licensed electricians to handle everything from fixture installations to complex electrical issues.',
    icon: <Zap size={32} />,
  },

];

export default Home;