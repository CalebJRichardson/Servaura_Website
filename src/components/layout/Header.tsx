import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import servauraLogo from '../../assets/servaura-logo.png'; // adjust path if needed

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled ? 'Py-2 bg-header-bg-scroll shadow-lg' : 'py-5 bg-header-bg'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src={servauraLogo} 
              alt="SERVAURA" 
              className="w-auto" 
              style={{ height: '130px' }} 
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8">
            <li>
              <Link to="/" className="text-text-color hover:text-accent uppercase text-lg tracking-wider transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/plans" className="text-text-color hover:text-accent uppercase text-lg tracking-wider transition-colors font-medium">
                Plans
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-text-color hover:text-accent uppercase text-lg tracking-wider transition-colors font-medium">
                Services
              </Link>
            </li>
            <li>
              <Link to="/customize" className="text-text-color hover:text-accent uppercase text-lg tracking-wider transition-colors font-medium">
                Customize
              </Link>
            </li>
          </ul>

          <div className="hidden md:flex">
            <Link to="/schedule-call" className="btn btn-primary text-xs md:text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1">
                <span className={`h-0.5 bg-text-color transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 bg-text-color transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`h-0.5 bg-text-color transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-64 mt-4' : 'max-h-0'}`}>
          <ul className="flex flex-col gap-4 py-4">
            <li>
              <Link to="/" className="block py-2 text-text-color hover:text-accent uppercase text-sm tracking-wider transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/plans" className="block py-2 text-text-color hover:text-accent uppercase text-sm tracking-wider transition-colors">
                Plans
              </Link>
            </li>
            <li>
              <Link to="/services" className="block py-2 text-text-color hover:text-accent uppercase text-sm tracking-wider transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/customize" className="block py-2 text-text-color hover:text-accent uppercase text-sm tracking-wider transition-colors">
                Customize
              </Link>
            </li>
            <li>
              <Link to="/schedule-call" className="btn btn-primary text-xs w-full text-center">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
