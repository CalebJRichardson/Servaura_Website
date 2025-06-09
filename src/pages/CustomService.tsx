import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { CheckCircle, PlusCircle, X } from 'lucide-react';
import { Service } from '../main'; // Import Service type from main.tsx

// ✅ Import the image correctly
import headerImage from '../assets/iStock-2179171045.jpg'; // adjust path if needed

const CustomService: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load selected services from memory (no localStorage)
    const savedServices = sessionStorage.getItem('selectedServices');
    if (savedServices) {
      try {
        setSelectedServices(JSON.parse(savedServices));
      } catch (e) {
        console.error('Error loading saved services:', e);
      }
    }

    // Fetch services from API or use fallback data
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data.filter((service: Service) => service.isActive));
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setError('Failed to fetch services from server');
      // Fallback to mock data
      setServices(getMockServices());
    } finally {
      setLoading(false);
    }
  };

  const getMockServices = (): Service[] => [
    {
      id: 'home-cleaning',
      name: 'Home Cleaning',
      description: 'Professional cleaning services tailored to your home\'s unique needs.',
      category: 'cleaning',
      basePrice: 120,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'window-cleaning',
      name: 'Window Cleaning',
      description: 'Crystal clear results for all your windows, enhancing natural light.',
      category: 'cleaning',
      basePrice: 80,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'lawn-garden',
      name: 'Lawn & Garden',
      description: 'Expert landscaping and garden maintenance for beautiful outdoor spaces.',
      category: 'landscaping',
      basePrice: 150,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'solar-cleaning',
      name: 'Solar Panel Cleaning',
      description: 'Specialized cleaning to maintain optimal efficiency of your solar panels.',
      category: 'maintenance',
      basePrice: 200,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pool-maintenance',
      name: 'Pool Maintenance',
      description: 'Complete pool care services to keep your swimming pool clean and balanced.',
      category: 'maintenance',
      basePrice: 180,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'power-washing',
      name: 'Power Washing',
      description: 'High-pressure cleaning for driveways, decks, and exterior surfaces.',
      category: 'cleaning',
      basePrice: 100,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      description: 'Professional plumbing services to maintain your home\'s water systems.',
      category: 'maintenance',
      basePrice: 250,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'electrical',
      name: 'Electrical',
      description: 'Licensed electricians for everything from fixture installations to complex issues.',
      category: 'maintenance',
      basePrice: 300,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hvac',
      name: 'HVAC',
      description: 'Regular maintenance to ensure your heating and cooling systems operate efficiently.',
      category: 'maintenance',
      basePrice: 220,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const proceedToFrequency = () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service to continue.');
      return;
    }
    // Store in sessionStorage instead of localStorage
    sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    window.location.href = '/service-frequency';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Customize Your Services" 
        description="Select the services you want to include in your personalized home maintenance plan."
        backgroundImage={headerImage}
        descriptionClassName="text-white"
      />

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title">Select Your Services</h2>
            <p className="text-lg leading-relaxed">
              Choose the services you want to include in your custom plan. In the next step, 
              you'll be able to select how frequently each service should be performed.
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error} - Using fallback data
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => {
              const isSelected = selectedServices.includes(service.id);

              return (
                <div 
                  key={service.id}
                  className={`
                    bg-secondary p-8 rounded transition-all duration-300 
                    hover:shadow-card cursor-pointer relative overflow-hidden
                    ${isSelected ? 'border-2 border-accent' : 'border border-transparent hover:border-gray'}
                  `}
                  onClick={() => toggleService(service.id)}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-accent">
                      <CheckCircle size={24} />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-accent mb-3">{service.name}</h3>
                  <p className="text-gray mb-4">{service.description}</p>
                  
                  {service.basePrice && (
                    <p className="text-sm text-accent font-medium mb-6">
                      Starting at ${service.basePrice}
                    </p>
                  )}

                  <button 
                    className={`
                      flex items-center gap-2 text-sm font-medium
                      ${isSelected ? 'text-accent' : 'text-gray hover:text-accent'}
                    `}
                  >
                    {isSelected ? (
                      <>
                        <X size={16} /> Remove Service
                      </>
                    ) : (
                      <>
                        <PlusCircle size={16} /> Add Service
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto bg-secondary p-8 rounded shadow-card">
            <h3 className="text-2xl font-bold text-accent mb-6 text-center">Your Selections</h3>

            {selectedServices.length === 0 ? (
              <p className="text-center mb-8">
                You haven't selected any services yet. Choose the services above that you'd like to include in your plan.
              </p>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {selectedServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="bg-primary px-4 py-2 rounded flex items-center gap-2">
                          <span>{service.name}</span>
                          {service.basePrice && (
                            <span className="text-accent text-sm">(${service.basePrice})</span>
                          )}
                          <button 
                            className="text-gray hover:text-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(serviceId);
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <p className="text-center mb-8">
                  In the next step, you'll be able to choose how frequently each service should be performed.
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                onClick={proceedToFrequency}
                className={selectedServices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Continue to Frequency Selection
              </Button>
              <Link to="/plans">
                <Button variant="secondary">View Standard Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomService;