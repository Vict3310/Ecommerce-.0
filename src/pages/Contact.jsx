import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import './Contact.css';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>Contact</span>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-box">
            <div className="info-icon">
              <FaPhone />
            </div>
            <h3>Call To Us</h3>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone: +234 812 345 6789</p>
          </div>

          <div className="info-box">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <h3>Write To US</h3>
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Emails: customer@exclusive-ikeja.com</p>
            <p>Emails: support@exclusive-ikeja.com</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone *"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="8"
              required
            ></textarea>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
