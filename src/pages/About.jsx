import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaDollarSign, FaShoppingBag, FaMoneyBillWave, FaTruck, FaHeadset, FaCheckCircle } from 'react-icons/fa';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './About.css';
import Footer from '../components/Footer';
import service3 from '../img/Services (3).svg';
import service4 from '../img/Services (4).svg';
import service5 from '../img/Services (5).svg';

const About = () => {
  return (
    <div className="about-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>About</span>
      </div>

      <section className="our-story">
        <div className="story-content">
          <h1>Our Story</h1>
          <p>
            Launched in 2015, Exclusive Ikeja is Lagos's premier online shopping marketplace with a deep focus on the mainland's vibrant community. Supported by wide range of tailored marketing, data and service solutions, we have become the go-to destination for thousands of shoppers in Ikeja and beyond.
          </p>
          <p>
            From our strategic hub near Ikeja City Mall, we offer a diverse assortment in categories ranging from consumer electronics to premium fashion, growing rapidly serving over 500,000 customers across Lagos.
          </p>
        </div>
        <div className="story-image">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500" alt="Shopping" />
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-icon"><img src={service3} alt="Store" /></div>
          <h2>10.5k</h2>
          <p>Sellers active our site</p>
        </div>
        <div className="stat-card active">
          <div className="stat-icon"><img src={service4} alt="Sales" /></div>
          <h2>33k</h2>
          <p>Monthly Product Sale</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><img src={service5} alt="Customers" /></div>
          <h2>45.5k</h2>
          <p>Customer active in our site</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><img src={service3} alt="Revenue" /></div>
          <h2>25k</h2>
          <p>Annual gross sale in our site</p>
        </div>
      </section>

      <section className="team">
        <div className="team-member">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300" alt="Tom Cruise" />
          <h3>Tom Cruise</h3>
          <p>Founder & Chairman</p>
          <div className="social-links">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
        <div className="team-member">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300" alt="Emma Watson" />
          <h3>Emma Watson</h3>
          <p>Managing Director</p>
          <div className="social-links">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
        <div className="team-member">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300" alt="Will Smith" />
          <h3>Will Smith</h3>
          <p>Product Designer</p>
          <div className="social-links">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="service-card">
          <div className="service-icon"><FaTruck /></div>
          <h3>FREE AND FAST DELIVERY</h3>
          <p>Free delivery for all orders over ₦50,000</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><FaHeadset /></div>
          <h3>24/7 CUSTOMER SERVICE</h3>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><FaCheckCircle /></div>
          <h3>MONEY BACK GUARANTEE</h3>
          <p>We return money within 30 days</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
