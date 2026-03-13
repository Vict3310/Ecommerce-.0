import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  FaChartPie, 
  FaBoxOpen, 
  FaClipboardList, 
  FaCog, 
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaChartBar
} from 'react-icons/fa';
import './Admin.css';

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Toggle dark mode class on root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fetch real notifications from Supabase
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notifs = [];

      // Get latest 3 orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, created_at, total_amount, status')
        .order('created_at', { ascending: false })
        .limit(3);

      (orders || []).forEach(order => {
        notifs.push({
          title: `New order #${order.id?.slice(0, 8)} — $${order.total_amount?.toFixed(2)}`,
          time: getRelativeTime(order.created_at),
          unread: isRecent(order.created_at, 24)
        });
      });

      // Check for low-stock products
      const { data: lowStock } = await supabase
        .from('products')
        .select('title, stock_quantity')
        .lte('stock_quantity', 5)
        .gt('stock_quantity', 0)
        .limit(2);

      (lowStock || []).forEach(p => {
        notifs.push({
          title: `Low stock: "${p.title}" (${p.stock_quantity} left)`,
          time: 'Action needed',
          unread: true
        });
      });

      // Check for out-of-stock products
      const { count: outOfStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('stock_quantity', 0);

      if (outOfStockCount > 0) {
        notifs.push({
          title: `${outOfStockCount} product${outOfStockCount > 1 ? 's' : ''} out of stock`,
          time: 'Action needed',
          unread: true
        });
      }

      setNotifications(notifs);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const getRelativeTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isRecent = (dateStr, hours) => {
    return (Date.now() - new Date(dateStr).getTime()) < hours * 3600000;
  };

  // Search handler
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (q.includes('product')) navigate('/admin/products');
      else if (q.includes('order')) navigate('/admin/orders');
      else if (q.includes('setting')) navigate('/admin/settings');
      else if (q.includes('chart') || q.includes('analytic')) navigate('/admin/charts');
      else if (q.includes('calendar')) navigate('/admin/calendar');
      else if (q.includes('profile')) navigate('/admin/profile');
      else navigate('/admin/products');
      setSearchQuery('');
    }
  };

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    const titles = { 
      dashboard: 'Dashboard', admin: 'Dashboard',
      products: 'Products', orders: 'Orders', 
      settings: 'Settings', calendar: 'Calendar',
      profile: 'Profile', charts: 'Charts',
      new: 'Add Product'
    };
    return titles[path] || 'Dashboard';
  };

  const navItems = [
    { to: '/admin/dashboard', icon: FaChartPie, label: 'Dashboard' },
    { to: '/admin/products', icon: FaBoxOpen, label: 'Products' },
    { to: '/admin/orders', icon: FaClipboardList, label: 'Orders' },
    { to: '/admin/calendar', icon: FaCalendarAlt, label: 'Calendar' },
    { to: '/admin/profile', icon: FaUser, label: 'Profile' },
    { to: '/admin/charts', icon: FaChartBar, label: 'Charts' },
    { to: '/admin/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden font-inter ${darkMode ? 'dark' : ''}`} 
         style={{ background: 'var(--ta-bg-body)' }}>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`ta-sidebar ta-scrollbar fixed lg:static transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand */}
        <div className="ta-sidebar-brand">
          <div style={{ 
            background: 'var(--ta-primary)', 
            padding: '8px', 
            borderRadius: 'var(--ta-radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaChartPie className="text-white text-lg" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            TailAdmin
          </h2>
          <button 
            className="lg:hidden ml-auto text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu Section */}
        <div className="ta-sidebar-section">
          <p className="ta-sidebar-section-title">Menu</p>
          <nav>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `ta-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="ta-nav-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="ta-badge-new">{item.badge}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sign Out */}
        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <button 
            onClick={signOut}
            className="ta-nav-item w-full"
            style={{ color: 'var(--ta-text-sidebar-muted)' }}
          >
            <FaSignOutAlt className="ta-nav-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="ta-header">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden ta-header-btn" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>

          {/* Search */}
          <div className="ta-search-box hidden sm:flex">
            <FaSearch style={{ color: 'var(--ta-text-muted)', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Type to search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <span className="ta-search-shortcut">⌘K</span>
          </div>

          {/* Right Actions */}
          <div className="ta-header-actions">
            {/* Dark Mode Toggle */}
            <button 
              className="ta-header-btn" 
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button 
                className="ta-header-btn" 
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              >
                <FaBell />
                <span className="ta-badge-dot"></span>
              </button>
              
              {notifOpen && (
                <div className="ta-dropdown" style={{ width: '320px' }}>
                  <div className="ta-dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Notifications</span>
                    <span className="ta-badge ta-badge-primary" style={{ fontSize: '0.6875rem' }}>
                      {notifications.filter(n => n.unread).length} new
                    </span>
                  </div>
                  {notifications.map((n, i) => (
                    <div key={i} className="ta-dropdown-item">
                      <div style={{ 
                        width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                        background: n.unread ? 'var(--ta-primary)' : 'var(--ta-border)' 
                      }} />
                      <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ta-text-primary)' }}>{n.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)', marginTop: 2 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--ta-border)', textAlign: 'center' }}>
                    <button style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ta-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div 
                className="ta-profile-trigger" 
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              >
                <div className="hidden sm:block text-right">
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ta-text-primary)', lineHeight: 1.2 }}>
                    Admin User
                  </p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--ta-text-muted)' }}>
                    {user?.email}
                  </p>
                </div>
                <div className="ta-profile-avatar">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <FaChevronDown style={{ fontSize: '0.625rem', color: 'var(--ta-text-muted)' }} />
              </div>

              {profileOpen && (
                <div className="ta-dropdown" style={{ width: '220px' }}>
                  <NavLink 
                    to="/admin/profile" 
                    className="ta-dropdown-item" 
                    style={{ textDecoration: 'none', color: 'var(--ta-text-primary)', fontSize: '0.8125rem' }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaUser style={{ marginTop: 2 }} /> <span>My Profile</span>
                  </NavLink>
                  <NavLink 
                    to="/admin/settings" 
                    className="ta-dropdown-item"
                    style={{ textDecoration: 'none', color: 'var(--ta-text-primary)', fontSize: '0.8125rem' }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaCog style={{ marginTop: 2 }} /> <span>Settings</span>
                  </NavLink>
                  <div style={{ borderTop: '1px solid var(--ta-border)' }}>
                    <button 
                      onClick={signOut}
                      className="ta-dropdown-item w-full" 
                      style={{ color: 'var(--ta-danger)', fontSize: '0.8125rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FaSignOutAlt style={{ marginTop: 2 }} /> <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto ta-scrollbar" style={{ padding: '24px' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <h1 className="ta-page-title">{getPageTitle()}</h1>
            <div className="ta-breadcrumb" style={{ marginTop: '4px' }}>
              <span>Admin</span>
              <span>/</span>
              <span className="ta-breadcrumb-active">{getPageTitle()}</span>
            </div>
          </div>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
