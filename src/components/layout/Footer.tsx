import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import servauraLogo from '../../assets/servaura-logo.png'; // adjust path if needed

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer-bg py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <img src={servauraLogo} alt="Servaura Logo" className="h-32 w-auto" />
            </div>
            <p className="text-gray mb-6 leading-relaxed">
              Servaura provides premium home services through an innovative subscription model, 
              connecting homeowners with elite service providers for a seamless home maintenance experience.
            </p>
          </div>
          
          <div>
            <h4 className="text-accent uppercase font-semibold tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray hover:text-accent transition-colors">
                  Plans
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/customize" className="text-gray hover:text-accent transition-colors">
                  Customize
                </Link>
              </li>
              <li>
                <Link to="/schedule-call" className="text-gray hover:text-accent transition-colors">
                  Schedule a Call
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent uppercase font-semibold tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="text-gray hover:text-accent transition-colors">
                <a href="tel:+1800SERVAURA">1-800-SERVAURA</a>
              </li>
              <li className="text-gray hover:text-accent transition-colors">
                <a href="mailto:info@servaura.com">info@servaura.com</a>
              </li>
              <li className="text-gray">123 Luxury Lane</li>
              <li className="text-gray">Suite 400</li>
              <li className="text-gray">Beverly Hills, CA 90210</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent uppercase font-semibold tracking-wider mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-gray hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-gray hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-gray hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center text-gray text-sm">
          &copy; {new Date().getFullYear()} Servaura. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
