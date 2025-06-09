import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { 
  ServiceFrequencyOption, 
  CustomerProfile, 
  ServiceRequest, 
  FrequencyData 
} from '../main';

interface ServiceFrequencyData {
  [key: string]: {
    name: string;
    description: string;
    frequencies: string[];
    selectedFrequency?: string;
  };
}

// Database Context for Service Frequency functionality
interface ServiceFrequencyDatabaseContextType {
  // Service frequency data
  serviceFrequencyOptions: ServiceFrequencyOption[];
  customerProfiles: CustomerProfile[];
  serviceRequests: ServiceRequest[];
  
  // Loading states
  frequencyOptionsLoading: boolean;
  customerProfilesLoading: boolean;
  serviceRequestsLoading: boolean;
  
  // Error states
  frequencyOptionsError: string | null;
  customerProfilesError: string | null;
  serviceRequestsError: string | null;
  
  // Methods
  createServiceRequest: (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  createCustomerProfile: (profileData: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateServiceRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<void>;
  fetchServiceFrequencyOptions: () => Promise<void>;
  fetchCustomerProfiles: () => Promise<void>;
  fetchServiceRequests: () => Promise<void>;
  refreshFrequencyData: () => Promise<void>;
}

// Custom hook for service frequency database operations
const useServiceFrequencyDatabase = (): ServiceFrequencyDatabaseContextType => {
  // Service frequency options state
  const [serviceFrequencyOptions, setServiceFrequencyOptions] = useState<ServiceFrequencyOption[]>([]);
  const [frequencyOptionsLoading, setFrequencyOptionsLoading] = useState(true);
  const [frequencyOptionsError, setFrequencyOptionsError] = useState<string | null>(null);
  
  // Customer profiles state
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>([]);
  const [customerProfilesLoading, setCustomerProfilesLoading] = useState(false);
  const [customerProfilesError, setCustomerProfilesError] = useState<string | null>(null);
  
  // Service requests state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceRequestsLoading, setServiceRequestsLoading] = useState(false);
  const [serviceRequestsError, setServiceRequestsError] = useState<string | null>(null);

  // Mock data fallbacks
  const getMockServiceFrequencyOptions = (): ServiceFrequencyOption[] => [
    {
      serviceId: 'home-cleaning',
      frequencies: ['Twice weekly', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
      defaultFrequency: 'Weekly'
    },
    {
      serviceId: 'window-cleaning',
      frequencies: ['Bi-weekly', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
      defaultFrequency: 'Monthly'
    },
    {
      serviceId: 'lawn-garden',
      frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
      defaultFrequency: 'Bi-weekly'
    },
    {
      serviceId: 'solar-cleaning',
      frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
      defaultFrequency: 'Quarterly'
    },
    {
      serviceId: 'pool-maintenance',
      frequencies: ['Twice weekly', 'Weekly', 'Bi-weekly', 'Monthly'],
      defaultFrequency: 'Weekly'
    },
    {
      serviceId: 'power-washing',
      frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
      defaultFrequency: 'Quarterly'
    },
    {
      serviceId: 'plumbing',
      frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
      defaultFrequency: 'Quarterly'
    },
    {
      serviceId: 'electrical',
      frequencies: ['Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
      defaultFrequency: 'Annually'
    },
    {
      serviceId: 'hvac',
      frequencies: ['Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
      defaultFrequency: 'Bi-annually'
    }
  ];

  // Create service request function
  const createServiceRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setServiceRequestsLoading(true);
      setServiceRequestsError(null);

      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          status: 'submitted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create service request: ${response.status}`);
      }
      
      const newServiceRequest = await response.json();
      setServiceRequests(prev => [...prev, newServiceRequest]);
      
      return newServiceRequest.id;
    } catch (error) {
      console.error('Failed to create service request:', error);
      setServiceRequestsError('Failed to create service request');
      
      // Fallback: create service request with generated ID
      const newServiceRequest: ServiceRequest = {
        ...requestData,
        id: Date.now().toString(),
        status: 'submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setServiceRequests(prev => [...prev, newServiceRequest]);
      return newServiceRequest.id;
    } finally {
      setServiceRequestsLoading(false);
    }
  };

  // Create customer profile function
  const createCustomerProfile = async (profileData: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setCustomerProfilesLoading(true);
      setCustomerProfilesError(null);

      const response = await fetch('/api/customer-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create customer profile: ${response.status}`);
      }
      
      const newCustomerProfile = await response.json();
      setCustomerProfiles(prev => [...prev, newCustomerProfile]);
      
      return newCustomerProfile.id;
    } catch (error) {
      console.error('Failed to create customer profile:', error);
      setCustomerProfilesError('Failed to create customer profile');
      
      // Fallback: create customer profile with generated ID
      const newCustomerProfile: CustomerProfile = {
        ...profileData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCustomerProfiles(prev => [...prev, newCustomerProfile]);
      return newCustomerProfile.id;
    } finally {
      setCustomerProfilesLoading(false);
    }
  };

  // Update service request function
  const updateServiceRequest = async (id: string, updates: Partial<ServiceRequest>) => {
    try {
      setServiceRequestsLoading(true);
      setServiceRequestsError(null);

      const response = await fetch(`/api/service-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update service request: ${response.status}`);
      }
      
      const updatedServiceRequest = await response.json();
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === id ? updatedServiceRequest : request
        )
      );
    } catch (error) {
      console.error('Failed to update service request:', error);
      setServiceRequestsError('Failed to update service request');
      
      // Fallback: update locally
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, ...updates, updatedAt: new Date().toISOString() }
            : request
        )
      );
    } finally {
      setServiceRequestsLoading(false);
    }
  };

  // Fetch service frequency options function
  const fetchServiceFrequencyOptions = async () => {
    try {
      setFrequencyOptionsLoading(true);
      setFrequencyOptionsError(null);

      const response = await fetch('/api/service-frequency-options');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service frequency options: ${response.status}`);
      }
      
      const data = await response.json();
      setServiceFrequencyOptions(data);
    } catch (error) {
      console.error('Failed to fetch service frequency options:', error);
      setFrequencyOptionsError('Failed to fetch service frequency options from server');
      // Fallback to mock data
      setServiceFrequencyOptions(getMockServiceFrequencyOptions());
    } finally {
      setFrequencyOptionsLoading(false);
    }
  };

  // Fetch customer profiles function
  const fetchCustomerProfiles = async () => {
    try {
      setCustomerProfilesLoading(true);
      setCustomerProfilesError(null);

      const response = await fetch('/api/customer-profiles');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customer profiles: ${response.status}`);
      }
      
      const data = await response.json();
      setCustomerProfiles(data);
    } catch (error) {
      console.error('Failed to fetch customer profiles:', error);
      setCustomerProfilesError('Failed to fetch customer profiles from server');
      setCustomerProfiles([]);
    } finally {
      setCustomerProfilesLoading(false);
    }
  };

  // Fetch service requests function
  const fetchServiceRequests = async () => {
    try {
      setServiceRequestsLoading(true);
      setServiceRequestsError(null);

      const response = await fetch('/api/service-requests');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service requests: ${response.status}`);
      }
      
      const data = await response.json();
      setServiceRequests(data);
    } catch (error) {
      console.error('Failed to fetch service requests:', error);
      setServiceRequestsError('Failed to fetch service requests from server');
      setServiceRequests([]);
    } finally {
      setServiceRequestsLoading(false);
    }
  };

  // Refresh all frequency data function
  const refreshFrequencyData = async () => {
    await Promise.all([
      fetchServiceFrequencyOptions(),
      fetchCustomerProfiles(),
      fetchServiceRequests()
    ]);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchServiceFrequencyOptions();
  }, []);

  return {
    serviceFrequencyOptions,
    customerProfiles,
    serviceRequests,
    frequencyOptionsLoading,
    customerProfilesLoading,
    serviceRequestsLoading,
    frequencyOptionsError,
    customerProfilesError,
    serviceRequestsError,
    createServiceRequest,
    createCustomerProfile,
    updateServiceRequest,
    fetchServiceFrequencyOptions,
    fetchCustomerProfiles,
    fetchServiceRequests,
    refreshFrequencyData
  };
};

const ServiceFrequency: React.FC = () => {
  // Use the database hook
  const {
    serviceFrequencyOptions,
    createServiceRequest,
    createCustomerProfile,
    frequencyOptionsLoading,
    frequencyOptionsError
  } = useServiceFrequencyDatabase();

  // State for services and their frequencies
  const [services, setServices] = useState<ServiceFrequencyData>({});
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    specialRequirements: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load selected services from memory instead of localStorage
    const savedServices = sessionStorage.getItem('selectedServices');
    if (!savedServices) {
      // Redirect back if no services selected
      alert('Please select services first');
      window.location.href = '/customize';
      return;
    }
    
    const serviceIds = JSON.parse(savedServices) as string[];
    setSelectedServiceIds(serviceIds);
    
    // Prepare service data with frequencies from database or fallback
    const servicesData: ServiceFrequencyData = {};
    
    serviceIds.forEach(id => {
      // Try to get frequency options from database first
      const dbFrequencyOption = serviceFrequencyOptions.find(option => option.serviceId === id);
      const fallbackService = serviceInfo[id];
      
      if (dbFrequencyOption && fallbackService) {
        servicesData[id] = {
          ...fallbackService,
          frequencies: dbFrequencyOption.frequencies,
          selectedFrequency: dbFrequencyOption.defaultFrequency || dbFrequencyOption.frequencies[0],
        };
      } else if (fallbackService) {
        // Fallback to static service info
        servicesData[id] = {
          ...fallbackService,
          selectedFrequency: fallbackService.frequencies[0],
        };
      }
    });
    
    setServices(servicesData);
  }, [serviceFrequencyOptions]);

  // Handle frequency selection
  const handleFrequencyChange = (serviceId: string, frequency: string) => {
    setServices(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        selectedFrequency: frequency,
      },
    }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.address || !formData.city || !formData.zip) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create customer profile
      const customerId = await createCustomerProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        specialRequirements: formData.specialRequirements,
      });

      // Prepare service frequencies
      const serviceFrequencies: { [serviceId: string]: string } = {};
      selectedServiceIds.forEach(serviceId => {
        const service = services[serviceId];
        if (service && service.selectedFrequency) {
          serviceFrequencies[serviceId] = service.selectedFrequency;
        }
      });

      // Create service request
      await createServiceRequest({
        customerId,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          specialRequirements: formData.specialRequirements,
        },
        selectedServices: selectedServiceIds,
        serviceFrequencies,
        status: 'submitted',
        notes: formData.specialRequirements,
      });

      // Show success message
      setShowSuccess(true);
      
      // Clear sessionStorage
      sessionStorage.removeItem('selectedServices');
      
    } catch (error) {
      console.error('Error submitting service request:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (frequencyOptionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray">Loading service options...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (frequencyOptionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading service options</p>
          <Link to="/customize">
            <Button variant="primary">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="pt-60 pb-8 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-gold bg-clip-text text-transparent">
             Service Frequency
          </h1>
          <p className="text-center max-w-3xl mx-auto text-lg">
            Choose how often you'd like each service to be performed. Our experts will create 
            a personalized schedule based on your selections.
          </p>
        </div>
      </section>

      <section className="py-20 bg-primary relative">
        <div className="absolute w-48 h-48 rounded-full bg-gradient-radial from-accent/10 to-transparent top-24 left-[10%]" />
        <div className="absolute w-48 h-48 rounded-full bg-gradient-radial from-accent/10 to-transparent bottom-24 right-[5%]" />
        
        <div className="container mx-auto px-8">
          {!showSuccess && (
            <>
              <div className="bg-secondary rounded shadow-card mb-16 overflow-hidden">
                <div className="p-6 border-b border-accent/30 bg-accent/5">
                  <h3 className="text-xl font-bold text-accent">Your Selected Services</h3>
                  <p className="text-gray text-sm">
                    Select the frequency for each service you've chosen. You can change these preferences 
                    at any time after your plan begins.
                  </p>
                </div>
                
                <div className="p-6">
                  {selectedServiceIds.map(serviceId => {
                    const service = services[serviceId];
                    if (!service) return null;
                    
                    return (
                      <div 
                        key={serviceId}
                        className="py-6 border-b border-gray/20 last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-bold text-text-color mb-2">{service.name}</h4>
                          <p className="text-gray text-sm">{service.description}</p>
                        </div>
                        
                        <div className="md:w-1/2 flex items-center justify-end gap-4">
                          <label className="text-gray whitespace-nowrap">Frequency:</label>
                          <select
                            className="bg-primary border-2 border-accent py-3 px-4 rounded text-text-color min-w-[180px]"
                            value={service.selectedFrequency}
                            onChange={(e) => handleFrequencyChange(serviceId, e.target.value)}
                          >
                            {service.frequencies.map(freq => (
                              <option key={freq} value={freq}>{freq}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-secondary rounded shadow-card mb-16">
                <div className="p-6 border-b border-accent/30">
                  <h3 className="text-xl font-bold text-accent">Your Contact Information</h3>
                </div>
                
                <form className="p-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray text-sm mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray text-sm mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray text-sm mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray text-sm mb-2">Home Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray text-sm mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray text-sm mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray text-sm mb-2">
                        Special Requirements or Notes (Optional)
                      </label>
                      <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        className="w-full bg-primary border border-gray p-3 rounded min-h-[120px]"
                        disabled={submitting}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="px-8"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Service Request →'}
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
          
          {showSuccess && (
            <div className="bg-secondary border-2 border-accent p-8 rounded text-center max-w-2xl mx-auto animate-fade-in">
              <h3 className="text-2xl font-bold text-accent mb-4">Thank You!</h3>
              <p className="text-lg mb-6">
                Your custom service request has been submitted successfully. One of our representatives 
                will contact you within 5 minutes to finalize your plan.
              </p>
              <Link to="/">
                <Button variant="primary">Return to Home</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// Service information mapping (fallback for when database is unavailable)
const serviceInfo = {
  'home-cleaning': {
    name: 'Home Cleaning',
    description: 'Professional cleaning services tailored to your home\'s unique needs.',
    frequencies: ['Twice weekly', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
  },
  'window-cleaning': {
    name: 'Window Cleaning',
    description: 'Crystal clear results for all your windows, enhancing natural light.',
    frequencies: ['Bi-weekly', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
  },
  'lawn-garden': {
    name: 'Lawn & Garden',
    description: 'Expert landscaping and garden maintenance for beautiful outdoor spaces.',
    frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
  },
  'solar-cleaning': {
    name: 'Solar Panel Cleaning',
    description: 'Specialized cleaning to maintain optimal efficiency of your solar panels.',
    frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
  },
  'pool-maintenance': {
    name: 'Pool Maintenance',
    description: 'Complete pool care services to keep your swimming pool clean and balanced.',
    frequencies: ['Twice weekly', 'Weekly', 'Bi-weekly', 'Monthly'],
  },
  'power-washing': {
    name: 'Power Washing',
    description: 'High-pressure cleaning for driveways, decks, and exterior surfaces.',
    frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'],
  },
  'plumbing': {
    name: 'Plumbing',
    description: 'Professional plumbing services to maintain your home\'s water systems.',
    frequencies: ['Monthly', 'Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
  },
  'electrical': {
    name: 'Electrical',
    description: 'Licensed electricians for everything from fixture installations to complex issues.',
    frequencies: ['Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
  },
  'hvac': {
    name: 'HVAC',
    description: 'Regular maintenance to ensure your heating and cooling systems operate efficiently.',
    frequencies: ['Quarterly', 'Bi-annually', 'Annually', 'On-demand'],
  },
};

export default ServiceFrequency;