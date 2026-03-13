import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useStoreSettings } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import "./Navbar.css"
import cartIcon from '../icons/Cart1 with buy.svg';
import wishlistIcon from '../icons/Wishlist.svg';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function Navbar(props) {
  const cartCount = props.cartCount || 0;
  const { user, isAdmin, signOut } = useAuth();
  const { storeSettings } = useStoreSettings();
  const { currency, toggleCurrency } = useCurrency();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: "Smartphones", query: "Smartphones" },
    { name: "Laptops & Computing", query: "Laptops & Computing" },
    { name: "Audio & Speakers", query: "Audio & Speakers" },
    { name: "Gaming", query: "Gaming" },
    { name: "Smartwatches", query: "Smartwatches" },
    { name: "Cameras & Photography", query: "Cameras & Photography" },
    { name: "Tablets", query: "Tablets" },
    { name: "Computer Accessories", query: "Computer Accessories" },
    { name: "Home Automation", query: "Home Automation" },
    { name: "Monitors & Displays", query: "Monitors & Displays" },
  ];

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMenu();
    }
  };

  const navRef = useRef(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  });

  return (
    <>
      <div
        className={"menu-overlay " + (isMenuOpen ? 'active' : '')}
        onClick={closeMenu}
      ></div>

      <header className="main-header" ref={navRef}>
        <div className='banner'>
          <p>{storeSettings?.banner_message || 'Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!'}
            <span><Link to="/" className="shopnow">ShopNow</Link></span>
          </p>
        </div>

        <nav className='navbar'>
          <h2>{storeSettings?.store_name || 'EXCLUSIVE'}</h2>

          <ul className={"nav-menu " + (isMenuOpen ? 'active' : '')}>
            <li><Link to="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/products" className="nav-link" onClick={closeMenu}>Shop</Link></li>
            
            <li className="mobile-category-dropdown">
              <div className="nav-link cat-toggle" onClick={() => setIsCatOpen(!isCatOpen)}>
                 Categories {isCatOpen ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
              </div>
              <ul className={`mobile-category-list ${isCatOpen ? 'open' : ''}`}>
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <Link to={`/products?category=${encodeURIComponent(cat.query)}`} className="nav-link sub-link" onClick={closeMenu}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li><Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link></li>
            <li><Link to="/about" className="nav-link" onClick={closeMenu}>About</Link></li>
            
            <li className="mobile-divider"></li>

            {!user ? (
               <li className="mobile-only-link"><Link to="/login" className="nav-link font-bold" onClick={closeMenu}>Login / Sign Up</Link></li>
            ) : (
               <>
                 {isAdmin && <li className="desktop-hidden"><Link to="/admin" className="nav-link" onClick={closeMenu}>Admin Panel</Link></li>}
                 <li className="mobile-only-link"><Link to="/account" className="nav-link" onClick={closeMenu}>My Account</Link></li>
                 <li className="mobile-only-link">
                   <button onClick={() => { signOut(); closeMenu(); }} className="nav-link text-red-500 font-bold" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                     Logout
                   </button>
                 </li>
               </>
            )}

            {!user && <li className="desktop-only-link"><Link to="/signup" className="nav-link" onClick={closeMenu}>Sign Up</Link></li>}
            {user && isAdmin && <li className="desktop-only-link"><Link to="/admin" className="nav-link" onClick={closeMenu}>Admin</Link></li>}
            {user && <li className="desktop-only-link"><button onClick={() => { signOut(); closeMenu(); }} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Logout</button></li>}
            
            <div className="mobile-divider"></div>
            
            <li className="mobile-preferences">
               <div className="pref-item">
                 <span>Theme</span>
                 <button onClick={toggleTheme} className="theme-toggle-small">
                   {isDarkMode ? <FaSun color="#ffbd00" /> : <FaMoon />}
                 </button>
               </div>
               <div className="pref-item">
                 <span>Currency</span>
                 <button onClick={toggleCurrency} className="currency-toggle-small">
                   {currency}
                 </button>
               </div>
            </li>
          </ul>

          <div className="navbar-right">
            <form onSubmit={handleSearch} className="nav-search-form">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nav-search-input"
              />
              <button type="submit" className="nav-search-btn">
                <FaSearch />
              </button>
            </form>

            <Link to="/wishlist" className="hide-on-mobile">
              <img src={wishlistIcon} alt="Wishlist" className="icon" />
            </Link>

            <Link to="/cart" className="cart-icon-container" style={{ textDecoration: 'none', position: 'relative' }}>
              <img src={cartIcon} alt="Cart" className="icon" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* User account icon */}
            <Link to={user ? '/account' : '/login'} className="hide-on-mobile user-account-link" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <FaUserCircle size={22} style={{ color: '#1a1a1a', flexShrink: 0 }} />
            </Link>

            {/* Currency Switcher */}
            <button 
              onClick={toggleCurrency}
              className="currency-switcher-btn hide-on-mobile bg-gray-100 hover:bg-gray-200 text-xs font-bold px-3 py-1.5 rounded transition-all duration-200 border border-gray-200"
              title={`Switch to ${currency === 'USD' ? 'NGN' : 'USD'}`}
            >
              {currency}
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn hide-on-mobile p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            >
              {isDarkMode ? <FaSun size={20} color="#ffbd00" /> : <FaMoon size={20} color="#1a1a1a" />}
            </button>
            
            <div className="mobile-search-toggle">
              <button onClick={() => navigate('/products')}>
                 <FaSearch size={18} />
              </button>
            </div>

            <div
              className={"hamburger " + (isMenuOpen ? 'open' : '')}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
