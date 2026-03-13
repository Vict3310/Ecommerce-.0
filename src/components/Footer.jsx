import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import './Footer.css';
import qrcode from '../img/Qr Code.png'
import appstore from '../img/appstore.png'
import playstore from '../img/playstore.png'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          alert("You are already subscribed!");
        } else {
          throw error;
        }
      } else {
        alert("Thank you for subscribing!");
        setEmail('');
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>EXCLUSIVE IKEJA</h2>
            <h3>Subscribe</h3>
            <p>Get 10% off your first order</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="newsletter-input-wrapper">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="newsletter-btn" aria-label="Subscribe to newsletter">
                  {loading ? '...' : '→'}
                </button>
              </div>
            </form>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/contact">Obafemi Awolowo Way, Ikeja, Lagos, Nigeria.
              </Link></li>
              <li><Link to="/about">support@exclusive-ikeja.com</Link></li>
              <li><a href="#">+234 812 345 6789</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">My Account</Link></li>
              <li><Link to="/signup">Login/Register</Link></li>
              <li><a href="#">Cart</a></li>
              <li><a href="#">Wishlist</a></li>
              <li><a href="#">Shop</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section app-section">
            <h3>Download App</h3>
            <p>Save ₦5,000 with App New User Only</p>
            <div className='app'>
              <img src={qrcode} alt="qrcode" />
              <div className='col'>
                <img src={appstore} alt="appstore" />
                <img src={playstore} alt="playstore" />
              </div>
            </div>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; 2024 Exclusive Ikeja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
