import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

// ✅ Import the image asset properly
import headerImage from '../assets/iStock-471100910.jpg';

const Plans: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageHeader 
        title="Our Subscription Plans" 
        description="Choose the perfect plan for your home maintenance needs. From basic essentials to comprehensive luxury services, we have you covered."
        backgroundImage={headerImage} // ✅ Use imported asset here
        descriptionClassName="text-white"
      />

      <section className="py-20 bg-primary relative">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Plan Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse shadow-card rounded overflow-hidden">
              <thead>
                <tr>
                  <th className="bg-secondary p-6 text-left">Service</th>
                  <th className="bg-secondary p-6 text-center">Basic</th>
                  <th className="bg-secondary p-6 text-center">Standard</th>
                  <th className="bg-secondary p-6 text-center">Premium</th>
                  <th className="bg-secondary p-6 text-center">Luxury</th>
                </tr>
              </thead>
              <tbody>
                {serviceComparisonData.map((service, index) => (
                  <tr key={index} className="border-b border-secondary">
                    <td className="p-6 font-semibold text-accent">{service.name}</td>
                    <td className="p-6 text-center">{service.basic}</td>
                    <td className="p-6 text-center">{service.standard}</td>
                    <td className="p-6 text-center">{service.premium}</td>
                    <td className="p-6 text-center">{service.luxury}</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-6"></td>
                  <td className="p-6 text-center">
                    <Button variant="primary" className="w-full" onClick={() => selectPlan('Basic')}>Select</Button>
                  </td>
                  <td className="p-6 text-center">
                    <Button variant="primary" className="w-full" onClick={() => selectPlan('Standard')}>Select</Button>
                  </td>
                  <td className="p-6 text-center">
                    <Button variant="primary" className="w-full" onClick={() => selectPlan('Premium')}>Select</Button>
                  </td>
                  <td className="p-6 text-center">
                    <Button variant="primary" className="w-full" onClick={() => selectPlan('Luxury')}>Select</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-gold text-primary text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">Need a Custom Solution?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            We can create a tailored plan designed specifically for your home's unique needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/customize">
              <Button variant="white">Customize Your Plan</Button>
            </Link>
            <Link to="/schedule-call">
              <Button variant="secondary" className="border-white text-white hover:bg-white/10">
                Speak to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

// Helper function to handle plan selection
const selectPlan = (planName: string) => {
  window.location.href = '/schedule-call';
};

// Plan comparison data
const serviceComparisonData = [
  {
    name: 'Cleaning Service',
    basic: 'Monthly',
    standard: 'Bi-weekly',
    premium: 'Weekly',
    luxury: 'Twice Weekly',
  },
  {
    name: 'Lawn Maintenance',
    basic: 'Quarterly',
    standard: 'Monthly',
    premium: 'Bi-weekly',
    luxury: 'Weekly',
  },
  {
    name: 'HVAC Service',
    basic: 'Annually',
    standard: 'Quarterly',
    premium: 'Quarterly',
    luxury: 'Quarterly',
  },
  {
    name: 'Window Washing',
    basic: '—',
    standard: 'Annually',
    premium: 'Quarterly',
    luxury: 'Monthly',
  },
  {
    name: 'Power Washing',
    basic: '—',
    standard: '-',
    premium: 'Annually',
    luxury: 'Quarterly',
  },
  {
    name: 'Service Contractor Visits',
    basic: '—',
    standard: 'One',
    premium: 'Two',
    luxury: 'Unlimited',
  },
];

export default Plans;
