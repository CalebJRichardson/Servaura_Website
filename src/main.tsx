import { StrictMode, createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Types for consultation scheduling
interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  message?: string;
  selectedDate: string;
  selectedTimeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface TimeSlotAvailability {
  date: string;
  unavailableSlots: number[]; // indices of unavailable time slots
}

interface ScheduleData {
  consultations: ConsultationRequest[];
  availability: TimeSlotAvailability[];
}

// Types for custom service functionality
interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomPlan {
  id: string;
  userId?: string;
  name: string;
  selectedServices: string[];
  serviceFrequencies: { [serviceId: string]: string };
  totalPrice?: number;
  status: 'draft' | 'pending' | 'active' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface ServiceData {
  services: Service[];
  customPlans: CustomPlan[];
}

// Types for service frequency functionality
interface ServiceFrequencyOption {
  serviceId: string;
  frequencies: string[];
  defaultFrequency?: string;
}

interface CustomerProfile {
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

interface ServiceRequest {
  id: string;
  customerId?: string;
  customerInfo: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>;
  selectedServices: string[];
  serviceFrequencies: { [serviceId: string]: string };
  status: 'submitted' | 'reviewed' | 'approved' | 'scheduled' | 'active' | 'cancelled';
  estimatedPrice?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FrequencyData {
  serviceFrequencyOptions: ServiceFrequencyOption[];
  customerProfiles: CustomerProfile[];
  serviceRequests: ServiceRequest[];
}

// Database Context for Schedule Call functionality
interface ScheduleDatabaseContextType {
  // Consultation data
  consultations: ConsultationRequest[];
  consultationsLoading: boolean;
  consultationsError: string | null;
  
  // Availability data
  availability: TimeSlotAvailability[];
  availabilityLoading: boolean;
  availabilityError: string | null;
  
  // Methods
  scheduleConsultation: (consultationData: Omit<ConsultationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getUnavailableTimeSlots: (date: Date) => number[];
  fetchConsultations: () => Promise<void>;
  fetchAvailability: () => Promise<void>;
  updateConsultationStatus: (id: string, status: ConsultationRequest['status']) => Promise<void>;
  cancelConsultation: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ScheduleDatabaseContext = createContext<ScheduleDatabaseContextType | undefined>(undefined);

// Schedule Database Provider Component
const ScheduleDatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const API_BASE_URL = 'https://servaura-api.onrender.com';

  // Consultations state
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [consultationsLoading, setConsultationsLoading] = useState(true);
  const [consultationsError, setConsultationsError] = useState<string | null>(null);
  
  // Availability state
  const [availability, setAvailability] = useState<TimeSlotAvailability[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Mock data fallbacks
  const getMockConsultations = (): ConsultationRequest[] => [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      propertyType: 'single-family',
      message: 'Interested in lawn care services',
      selectedDate: '2024-06-10',
      selectedTimeSlot: '10:00 AM',
      status: 'confirmed',
      createdAt: '2024-06-04T10:30:00Z',
      updatedAt: '2024-06-04T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 987-6543',
      propertyType: 'condo',
      message: 'Need window cleaning and maintenance',
      selectedDate: '2024-06-12',
      selectedTimeSlot: '2:00 PM',
      status: 'pending',
      createdAt: '2024-06-04T14:15:00Z',
      updatedAt: '2024-06-04T14:15:00Z'
    }
  ];

  const getMockAvailability = (): TimeSlotAvailability[] => [
    { date: '2024-06-10', unavailableSlots: [0, 3, 6] }, // 9:00 AM, 12:00 PM, 3:00 PM unavailable
    { date: '2024-06-11', unavailableSlots: [1, 4] }, // 10:00 AM, 1:00 PM unavailable
    { date: '2024-06-12', unavailableSlots: [2, 5, 7] }, // 11:00 AM, 2:00 PM, 4:00 PM unavailable
  ];

  // Generate pseudo-random unavailable slots for a date (fallback method)
  const generateUnavailableSlots = (date: Date): number[] => {
    const dateString = date.toISOString().split('T')[0];
    const dateNumber = date.getDate();
    
    // Check if we have specific availability data for this date
    const availabilityData = availability.find(a => a.date === dateString);
    if (availabilityData) {
      return availabilityData.unavailableSlots;
    }
    
    // Generate pseudo-random unavailable slots
    const unavailableCount = 2 + (dateNumber % 3);
    const unavailable = [];
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    for (let i = 0; i < unavailableCount; i++) {
      const hash = (dateNumber * (i + 1) * 6151) % timeSlots.length;
      if (!unavailable.includes(hash)) {
        unavailable.push(hash);
      }
    }
    
    return unavailable;
  };

  // Schedule consultation function
  const scheduleConsultation = async (consultationData: Omit<ConsultationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch(`${API_BASE_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultationData,
          status: 'pending',
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
      const newConsultation: ConsultationRequest = {
        ...consultationData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setConsultations(prev => [...prev, newConsultation]);
      return newConsultation.id;
    } finally {
      setConsultationsLoading(false);
    }
  };

  // Get unavailable time slots for a specific date
  const getUnavailableTimeSlots = (date: Date): number[] => {
    return generateUnavailableSlots(date);
  };

  // Fetch consultations function
  const fetchConsultations = async () => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch(`${API_BASE_URL}/api/consultations`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch consultations: ${response.status}`);
      }
      
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      setConsultationsError('Failed to fetch consultations from server');
      // Fallback to mock data
      setConsultations(getMockConsultations());
    } finally {
      setConsultationsLoading(false);
    }
  };

  // Fetch availability function
  const fetchAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      const response = await fetch(`${API_BASE_URL}/api/availability`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch availability: ${response.status}`);
      }
      
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      setAvailabilityError('Failed to fetch availability from server');
      // Fallback to mock data
      setAvailability(getMockAvailability());
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Update consultation status function
  const updateConsultationStatus = async (id: string, status: ConsultationRequest['status']) => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update consultation status: ${response.status}`);
      }
      
      const updatedConsultation = await response.json();
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id ? updatedConsultation : consultation
        )
      );
    } catch (error) {
      console.error('Failed to update consultation status:', error);
      setConsultationsError('Failed to update consultation status');
      
      // Fallback: update status locally
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id 
            ? { ...consultation, status, updatedAt: new Date().toISOString() }
            : consultation
        )
      );
    } finally {
      setConsultationsLoading(false);
    }
  };

  // Cancel consultation function
  const cancelConsultation = async (id: string) => {
    try {
      setConsultationsLoading(true);
      setConsultationsError(null);

      const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to cancel consultation: ${response.status}`);
      }
      
      setConsultations(prev => prev.filter(consultation => consultation.id !== id));
    } catch (error) {
      console.error('Failed to cancel consultation:', error);
      setConsultationsError('Failed to cancel consultation');
      
      // Fallback: update status to cancelled locally
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id 
            ? { ...consultation, status: 'cancelled', updatedAt: new Date().toISOString() }
            : consultation
        )
      );
    } finally {
      setConsultationsLoading(false);
    }
  };

  // Refresh all data function
  const refreshData = async () => {
    await Promise.all([
      fetchConsultations(),
      fetchAvailability()
    ]);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchConsultations();
    fetchAvailability();
  }, []);

  const contextValue: ScheduleDatabaseContextType = {
    consultations,
    consultationsLoading,
    consultationsError,
    availability,
    availabilityLoading,
    availabilityError,
    scheduleConsultation,
    getUnavailableTimeSlots,
    fetchConsultations,
    fetchAvailability,
    updateConsultationStatus,
    cancelConsultation,
    refreshData
  };

  return (
    <ScheduleDatabaseContext.Provider value={contextValue}>
      {children}
    </ScheduleDatabaseContext.Provider>
  );
};

// Custom hook to use schedule database context
export const useScheduleDatabase = () => {
  const context = useContext(ScheduleDatabaseContext);
  if (context === undefined) {
    throw new Error('useScheduleDatabase must be used within a ScheduleDatabaseProvider');
  }
  return context;
};

// Export all types for use in other components
export type { 
  ConsultationRequest, 
  TimeSlotAvailability, 
  ScheduleData, 
  ScheduleDatabaseContextType,
  Service,
  CustomPlan,
  ServiceData,
  ServiceFrequencyOption,
  CustomerProfile,
  ServiceRequest,
  FrequencyData
};

// Main render with ScheduleDatabaseProvider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScheduleDatabaseProvider>
      <App />
    </ScheduleDatabaseProvider>
  </StrictMode>
);