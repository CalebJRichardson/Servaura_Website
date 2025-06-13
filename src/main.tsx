import { StrictMode, createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Services from './pages/Services';
import CustomService from './pages/CustomService';
import ScheduleCall from './pages/ScheduleCall';
import ServiceFrequency from './pages/ServiceFrequency';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// ===== TYPE DEFINITIONS =====

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'cleaning' | 'landscaping' | 'maintenance';
  basePrice?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFrequencyOption {
  serviceId: string;
  frequencies: string[];
  defaultFrequency: string;
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    specialRequirements?: string;
  };
  selectedServices: string[];
  serviceFrequencies: { [serviceId: string]: string };
  status: 'submitted' | 'reviewed' | 'approved' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  message?: string;
  selectedDate: string; // YYYY-MM-DD format
  selectedTimeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  message?: string;
  selectedDate: string;
  selectedTimeSlot: string;
}

export interface FrequencyData {
  [serviceId: string]: string;
}

// ===== DATABASE CONTEXT TYPES =====

interface DatabaseContextType {
  // Services
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;
  
  // Service Frequency Options
  serviceFrequencyOptions: ServiceFrequencyOption[];
  frequencyOptionsLoading: boolean;
  frequencyOptionsError: string | null;
  
  // Customer Profiles
  customerProfiles: CustomerProfile[];
  customerProfilesLoading: boolean;
  customerProfilesError: string | null;
  
  // Service Requests
  serviceRequests: ServiceRequest[];
  serviceRequestsLoading: boolean;
  serviceRequestsError: string | null;
  
  // Consultations
  consultations: Consultation[];
  consultationsLoading: boolean;
  consultationsError: string | null;
  
  // Methods
  fetchServices: () => Promise<void>;
  fetchServiceFrequencyOptions: () => Promise<void>;
  fetchCustomerProfiles: () => Promise<void>;
  fetchServiceRequests: () => Promise<void>;
  fetchConsultations: () => Promise<void>;
  createService: (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  createCustomerProfile: (profileData: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  createServiceRequest: (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  scheduleConsultation: (consultationData: ConsultationData) => Promise<string>;
  updateServiceRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<void>;
  updateConsultation: (id: string, updates: Partial<Consultation>) => Promise<void>;
  getUnavailableTimeSlots: (date: Date) => number[];
  refreshData: () => Promise<void>;
}

interface ScheduleDatabaseContextType {
  consultations: Consultation[];
  consultationsLoading: boolean;
  consultationsError: string | null;
  scheduleConsultation: (consultationData: ConsultationData) => Promise<string>;
  getUnavailableTimeSlots: (date: Date) => number[];
  refreshData: () => Promise<void>;
}

// ===== MOCK DATA =====

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

// ===== DATABASE CONTEXT =====

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  
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
  
  // Consultations state
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [consultationsError, setConsultationsError] = useState<string | null>(null);

  // ===== API FUNCTIONS =====

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);

      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data.filter((service: Service) => service.isActive));
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServicesError('Failed to fetch services from server');
      // Fallback to mock data
      setServices(getMockServices());
    } finally {
      setServicesLoading(false);
    }
  };

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

  const fetchConsultations = async () => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch('/api/consultations');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch consultations: ${response.status}`);
      }
      
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      setConsultationsError('Failed to fetch consultations from server');
      setConsultations([]);
    } finally {
      setConsultationsLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setServicesLoading(true);
      setServicesError(null);

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...serviceData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create service: ${response.status}`);
      }
      
      const newService = await response.json();
      setServices(prev => [...prev, newService]);
      
      return newService.id;
    } catch (error) {
      console.error('Failed to create service:', error);
      setServicesError('Failed to create service');
      
      // Fallback: create service with generated ID
      const newService: Service = {
        ...serviceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setServices(prev => [...prev, newService]);
      return newService.id;
    } finally {
      setServicesLoading(false);
    }
  };

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

  const scheduleConsultation = async (consultationData: ConsultationData): Promise<string> => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultationData,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to schedule consultation: ${response.status}`);
      }
      
      const newConsultation = await response.json();
      setConsultations(prev => [...prev, newConsultation]);
      
      return newConsultation.id;
    } catch (error) {
      console.error('Failed to schedule consultation:', error);
      setConsultationsError('Failed to schedule consultation');
      
      // Fallback: create consultation with generated ID
      const newConsultation: Consultation = {
        ...consultationData,
        id: Date.now().toString(),
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setConsultations(prev => [...prev, newConsultation]);
      return newConsultation.id;
    } finally {
      setConsultationsLoading(false);
    }
  };

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

  const updateConsultation = async (id: string, updates: Partial<Consultation>) => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch(`/api/consultations/${id}`, {
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
        throw new Error(`Failed to update consultation: ${response.status}`);
      }
      
      const updatedConsultation = await response.json();
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id ? updatedConsultation : consultation
        )
      );
    } catch (error) {
      console.error('Failed to update consultation:', error);
      setConsultationsError('Failed to update consultation');
      
      // Fallback: update locally
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id 
            ? { ...consultation, ...updates, updatedAt: new Date().toISOString() }
            : consultation
        )
      );
    } finally {
      setConsultationsLoading(false);
    }
  };

  const getUnavailableTimeSlots = (date: Date): number[] => {
    const dateString = date.toISOString().split('T')[0];
    const dayConsultations = consultations.filter(
      consultation => consultation.selectedDate === dateString && consultation.status === 'scheduled'
    );
    
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    const unavailableSlots: number[] = [];
    
    dayConsultations.forEach(consultation => {
      const slotIndex = timeSlots.indexOf(consultation.selectedTimeSlot);
      if (slotIndex !== -1) {
        unavailableSlots.push(slotIndex);
      }
    });
    
    return unavailableSlots;
  };

  const refreshData = async () => {
    await Promise.all([
      fetchServices(),
      fetchServiceFrequencyOptions(),
      fetchCustomerProfiles(),
      fetchServiceRequests(),
      fetchConsultations()
    ]);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchServices();
    fetchServiceFrequencyOptions();
    fetchConsultations();
  }, []);

  const value: DatabaseContextType = {
    services,
    servicesLoading,
    servicesError,
    serviceFrequencyOptions,
    frequencyOptionsLoading,
    frequencyOptionsError,
    customerProfiles,
    customerProfilesLoading,
    customerProfilesError,
    serviceRequests,
    serviceRequestsLoading,
    serviceRequestsError,
    consultations,
    consultationsLoading,
    consultationsError,
    fetchServices,
    fetchServiceFrequencyOptions,
    fetchCustomerProfiles,
    fetchServiceRequests,
    fetchConsultations,
    createService,
    createCustomerProfile,
    createServiceRequest,
    scheduleConsultation,
    updateServiceRequest,
    updateConsultation,
    getUnavailableTimeSlots,
    refreshData
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

// ===== CUSTOM HOOKS =====

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const useScheduleDatabase = (): ScheduleDatabaseContextType => {
  const {
    consultations,
    consultationsLoading,
    consultationsError,
    scheduleConsultation,
    getUnavailableTimeSlots,
    refreshData
  } = useDatabase();

  return {
    consultations,
    consultationsLoading,
    consultationsError,
    scheduleConsultation,
    getUnavailableTimeSlots,
    refreshData
  };
};

// ===== MAIN APP COMPONENT =====

function MainApp() {
  return (
    <DatabaseProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/services" element={<Services />} />
                <Route path="/customize" element={<CustomService />} />
                <Route path="/schedule-call" element={<ScheduleCall />} />
                <Route path="/service-frequency" element={<ServiceFrequency />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </DatabaseProvider>
  );
}

// ===== RENDER APPLICATION =====

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);