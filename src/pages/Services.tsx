import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
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
  PictureInPicture,
  CleaningServices,
  Snowflake,
  Hexagon
} from 'lucide-react';

// ✅ Import the image properly
import backgroundImage from '../assets/iStock-1329806139.jpg';

const Services: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageHeader 
        title="Our Services" 
        description="Servaura offers a comprehensive range of premium home services to keep your property in perfect condition."
        backgroundImage={backgroundImage} // ✅ Use imported image
        descriptionClassName="text-white"
      />

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title">Premium Home Services</h2>
            <p className="text-lg leading-relaxed">
              Our elite network of service providers delivers the highest quality home maintenance services. 
              Each service can be included in your subscription plan or scheduled as needed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-secondary p-8 rounded transition-all duration-300 hover:-translate-y-2 hover:shadow-card relative group"
              >
                {/* Gold accent at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
                
                <div className="flex items-start gap-4">
                  <div className="text-accent mt-1 flex-shrink-0">{service.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-3">{service.name}</h3>
                    <p className="text-gray mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="font-semibold mb-2">Available Frequencies:</h4>
                      <ul className="text-sm space-y-1 mb-6">
                        {service.frequencies.map((frequency, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="text-accent mr-2">✓</span>
                            <span>{frequency}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link to="/customize">
                        <Button variant="primary" className="text-sm">Add to Plan</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto bg-secondary p-8 rounded shadow-card">
            <h3 className="text-2xl font-bold text-accent mb-6 text-center">Looking for Something Specific?</h3>
            <p className="text-center mb-8">
              If you need a service not listed here, we're happy to discuss your specific requirements. 
              Our goal is to make home maintenance completely hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customize">
                <Button variant="primary">Customize Your Plan</Button>
              </Link>
              <Link to="/schedule-call">
                <Button variant="secondary">Schedule a Consultation</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-gold">
        <div className="container mx-auto px-4 text-primary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4 flex justify-center">
                <Hexagon strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold mb-3">Elite Service Providers</h3>
              <p>Our network includes only the top 5% of service professionals in each field, ensuring exceptional quality.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4 flex justify-center">
                <Hexagon strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p>We stand behind our work with a 100% satisfaction guarantee on all services performed.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4 flex justify-center">
                <Hexagon strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Scheduling</h3>
              <p>Schedule services at your convenience, with options for recurring maintenance or one-time appointments.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Services data
const services = [
  {
    id: 1,
    name: 'Home Cleaning',
    description: 'Professional cleaning services tailored to your home\'s unique needs, using premium eco-friendly products.',
    icon: <HomeIcon size={32} />,
    frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'One-time'],
  },
  {
    id: 2,
    name: 'Window Cleaning',
    description: 'Crystal clear results for all your windows, enhancing natural light and your home\'s appearance.',
    icon: <PictureInPicture size={32} />,
    frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
  },
  {
    id: 3,
    name: 'Lawn & Garden',
    description: 'Expert landscaping and garden maintenance to keep your outdoor spaces beautiful year-round.',
    icon: <Droplet size={32} />,
    frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'Seasonal'],
  },
  {
    id: 9,
    name: 'Power Washing',
    description: 'High-pressure cleaning for driveways, decks, and exteriors to remove dirt, grime, and restore surfaces.',
    icon: <Wind size={32} />,
    frequencies: ['Quarterly', 'Bi-annually', 'Annually'],
  },
  {
    id: 4,
    name: 'Solar Panel Cleaning',
    description: 'Specialized cleaning to maintain optimal efficiency and longevity of your solar panel investment.',
    icon: <Sun size={32} />,
    frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
  },
  {
    id: 5,
    name: 'Pool Maintenance',
    description: 'Complete pool care services to keep your swimming pool clean, balanced, and ready to enjoy.',
    icon: <Waves size={32} />,
    frequencies: ['Weekly', 'Bi-weekly', 'Monthly'],
  },
  {
    id: 6,
    name: 'HVAC Service',
    description: 'Regular maintenance and inspections to ensure your heating and cooling systems operate at peak efficiency.',
    icon: <Thermometer size={32} />,
    frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
  },
  {
    id: 7,
    name: 'Plumbing',
    description: 'Professional plumbing services to maintain your home\'s water systems and prevent costly damages.',
    icon: <Droplet size={32} />,
    frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
  },
  {
    id: 8,
    name: 'Electrical',
    description: 'Licensed electricians to handle everything from fixture installations to complex electrical issues.',
    icon: <Zap size={32} />,
    frequencies: ['Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
  },

];

export default Services;