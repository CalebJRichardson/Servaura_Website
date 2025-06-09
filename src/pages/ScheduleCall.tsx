import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useScheduleDatabase } from '../main';

interface Day {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  isWeekend: boolean;
}

const ScheduleCall: React.FC = () => {
  // Use the schedule database context
  const {
    scheduleConsultation,
    getUnavailableTimeSlots,
    consultationsLoading,
    consultationsError,
    refreshData
  } = useScheduleDatabase();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for calendar
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<Day[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // State for form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [message, setMessage] = useState('');
  
  // State for success message and submission
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Generate calendar days whenever month/year changes
  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, currentYear, selectedDate]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days: Day[] = [];
    const today = new Date();
    
    // First day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get the day of the week (0-6) for the first day
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Add days from previous month to fill first week
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = 0; i < firstDayWeekday; i++) {
      const date = daysInPrevMonth - firstDayWeekday + i + 1;
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isPast: true,
        isWeekend: false,
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday = 
        today.getDate() === i && 
        today.getMonth() === currentMonth && 
        today.getFullYear() === currentYear;
      
      const isPast = date < new Date(
        today.getFullYear(), 
        today.getMonth(), 
        today.getDate()
      );
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      const isSelected = selectedDate !== null && 
        selectedDate.getDate() === i && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear;
      
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isPast,
        isWeekend,
      });
    }
    
    // Add days from next month if needed to complete the last week
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isPast: false,
        isWeekend: false,
      });
    }
    
    setCalendarDays(days);
  };

  // Next month handler
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Previous month handler
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Date selection handler
  const handleDateSelection = (day: Day, index: number) => {
    if (!day.isCurrentMonth || day.isPast || day.isWeekend) {
      return;
    }
    
    const newDate = new Date(currentYear, currentMonth, day.date);
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
  };

  // Form submission handler - now uses the database context
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!selectedDate || !selectedTimeSlot || !name || !email || !phone || !propertyType) {
      alert('Please fill out all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Create consultation data object matching the expected interface
      const consultationData = {
        name,
        email,
        phone,
        propertyType,
        message: message || undefined,
        selectedDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        selectedTimeSlot
      };
      
      // Use the database context to schedule the consultation
      const consultationId = await scheduleConsultation(consultationData);
      
      console.log('Consultation scheduled with ID:', consultationId);
      
      // Display success message
      setShowSuccess(true);
      
      // Refresh data to get updated availability
      await refreshData();
      
    } catch (error) {
      console.error('Failed to schedule consultation:', error);
      setSubmitError('Failed to schedule consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowSuccess(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setName('');
    setEmail('');
    setPhone('');
    setPropertyType('');
    setMessage('');
    setSubmitError(null);
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'Please select a date from the calendar';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get month name
  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleDateString('en-US', { month: 'long' });
  };

  // Time slots data
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  // Get unavailable time slots using the database context
  const unavailableTimeSlots = selectedDate ? getUnavailableTimeSlots(selectedDate) : [];

  return (
    <>
      <section className="pt-60 pb-8 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-gold bg-clip-text text-transparent">
            Schedule a Consultation Call
          </h1>
          <p className="text-center max-w-3xl mx-auto text-lg">
            Speak with one of our home service specialists to explore how Servaura can deliver 
            the perfect maintenance plan for your home.
          </p>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="container">
          {/* Display loading state */}
          {consultationsLoading && (
            <div className="text-center mb-8">
              <p className="text-accent">Loading availability...</p>
            </div>
          )}
          
          {/* Display error state */}
          {(consultationsError || submitError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p>{submitError || consultationsError}</p>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar Column */}
            <div className="lg:w-1/2 bg-secondary p-8 rounded shadow-card">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-accent">
                  {getMonthName(currentMonth)} {currentYear}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={prevMonth} 
                    className="w-10 h-10 rounded-full border border-accent flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
                    disabled={consultationsLoading}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextMonth}
                    className="w-10 h-10 rounded-full border border-accent flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
                    disabled={consultationsLoading}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center rounded cursor-pointer text-sm font-medium
                      transition-all duration-200
                      ${day.isCurrentMonth ? '' : 'opacity-30'}
                      ${day.isToday ? 'border-2 border-accent font-bold' : ''}
                      ${day.isSelected ? 'bg-gradient-gold text-primary font-bold' : ''}
                      ${(day.isPast || day.isWeekend) && !day.isSelected ? 'opacity-30 cursor-not-allowed' : ''}
                      ${day.isCurrentMonth && !day.isPast && !day.isWeekend && !day.isSelected ? 'hover:bg-accent/20 hover:border hover:border-accent' : ''}
                      ${consultationsLoading ? 'pointer-events-none opacity-50' : ''}
                    `}
                    onClick={() => !consultationsLoading && handleDateSelection(day, index)}
                  >
                    {day.date}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:w-1/2 bg-secondary p-8 rounded shadow-card">
              <h2 className="text-xl font-bold text-accent mb-6">Your Consultation Details</h2>
              
              {/* Selected date display */}
              <div className="p-4 bg-primary rounded flex items-center justify-between mb-6">
                <span className={selectedDate ? 'font-bold text-accent' : ''}>
                  {formatDate(selectedDate)}
                </span>
                {selectedDate && (
                  <button 
                    className="text-gray hover:text-accent"
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedTimeSlot(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Change
                  </button>
                )}
              </div>
              
              {selectedDate && (
                <>
                  {/* Time slots */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {timeSlots.map((time, index) => (
                        <div
                          key={time}
                          className={`
                            p-3 text-center border rounded cursor-pointer transition-all duration-200 text-sm
                            ${unavailableTimeSlots.includes(index) ? 'bg-gray text-primary opacity-50 cursor-not-allowed' : ''}
                            ${selectedTimeSlot === time ? 'bg-gradient-gold text-primary border-transparent' : 'border-gray hover:border-accent hover:bg-accent/10'}
                            ${isSubmitting ? 'pointer-events-none opacity-50' : ''}
                          `}
                          onClick={() => !unavailableTimeSlots.includes(index) && !isSubmitting && setSelectedTimeSlot(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Contact form */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-primary border border-gray rounded text-text-color focus:border-accent focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-primary border border-gray rounded text-text-color focus:border-accent focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 bg-primary border border-gray rounded text-text-color focus:border-accent focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="property-type" className="block text-sm font-medium mb-2">Property Type</label>
                      <select
                        id="property-type"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-3 bg-primary border border-gray rounded text-text-color focus:border-accent focus:outline-none appearance-none"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="" disabled>Select your property type</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condominium</option>
                        <option value="single-family">Single-Family Home</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="estate">Estate</option>
                        <option value="multi-family">Multi-Family Home</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Any specific services you're interested in?
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full p-3 bg-primary border border-gray rounded text-text-color focus:border-accent focus:outline-none"
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full"
                      disabled={isSubmitting || consultationsLoading}
                    >
                      {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Success Message Modal */}
      {showSuccess && (
        <>
          <div className="fixed inset-0 bg-dark/70 z-50" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary p-8 rounded shadow-card z-50 max-w-md w-full text-center">
            <h3 className="text-xl font-bold text-accent mb-4">Consultation Scheduled!</h3>
            <p className="mb-4">
              Thank you for scheduling a consultation with Servaura. One of our home service specialists 
              will call you at the scheduled time.
            </p>
            <p className="mb-6">
              A confirmation email has been sent to your email address with all the details.
            </p>
            <Button variant="primary" onClick={resetForm}>Back to Home</Button>
          </div>
        </>
      )}
    </>
  );
};

export default ScheduleCall;