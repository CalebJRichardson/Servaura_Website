import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Services from './pages/Services';
import CustomService from './pages/CustomService';
import ScheduleCall from './pages/ScheduleCall';
import ServiceFrequency from './pages/ServiceFrequency';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
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
  );
}

export default App;