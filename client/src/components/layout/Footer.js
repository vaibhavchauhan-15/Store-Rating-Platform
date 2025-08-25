import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaStar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3 d-flex align-items-center">
              <FaStore className="me-2" /> Store Ratings
            </h5>
            <p className="mb-3">
              Discover and rate the best stores around you. 
              Share your experiences and help others find great places to shop.
            </p>
            <div className="social-icons d-flex">
              <a href="#" className="me-2 text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="me-2 text-white">
                <FaTwitter />
              </a>
              <a href="#" className="me-2 text-white">
                <FaInstagram />
              </a>
              <a href="#" className="me-2 text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/stores" className="text-white text-decoration-none">Stores</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-white text-decoration-none">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white text-decoration-none">Register</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" /> 123 Store Street, City, Country
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2" /> +1 234 567 8900
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaEnvelope className="me-2" /> info@storeratings.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="row mt-4 pt-3 border-top">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {currentYear} Store Ratings. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">
              <Link to="/privacy" className="text-white text-decoration-none me-3">Privacy Policy</Link>
              <Link to="/terms" className="text-white text-decoration-none">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
