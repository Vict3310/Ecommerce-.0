import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import './Account.css';

const NAV_ITEMS = {
  profile: 'My Profile',
  orders: 'My Orders',
  wishlist: 'My WishList',
  returns: 'My Returns',
  cancellations: 'My Cancellations',
};

function Account() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Pre-fill from profile data
    const names = (profile?.full_name || '').split(' ');
    setFormData(prev => ({
      ...prev,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: user.email || '',
      address: profile?.address || '',
    }));

    if (activeSection === 'orders') {
      fetchOrders();
    }
  }, [user, profile, activeSection]);

  const fetchOrders = async () => {
    setFetchingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    try {
      // Update profile info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          address: formData.address,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Handle password change
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setSaveMsg('New passwords do not match.');
          return;
        }
        const { error: pwError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });
        if (pwError) throw pwError;
      }

      setSaveMsg('Changes saved successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setSaveMsg('Error: ' + (err.message || 'Could not save changes.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const names = (profile?.full_name || '').split(' ');
    setFormData({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: user?.email || '',
      address: profile?.address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSaveMsg('');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="account-page font-poppins">
      {/* Breadcrumb + Welcome */}
      <div className="account-top-bar">
        <nav className="account-breadcrumb">
          <Link to="/">Home</Link> / <span>My Account</span>
        </nav>
        <span className="account-welcome">
          Welcome! <strong>{displayName}</strong>
        </span>
      </div>

      <div className="account-body">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-sidebar-group">
            <h4>Manage My Account</h4>
            <ul>
              <li
                className={activeSection === 'profile' ? 'active' : ''}
                onClick={() => setActiveSection('profile')}
              >My Profile</li>
            </ul>
          </div>

          <div className="account-sidebar-group">
            <h4>My Orders</h4>
            <ul>
              <li
                className={activeSection === 'orders' ? 'active' : ''}
                onClick={() => setActiveSection('orders')}
              >My Orders</li>
              <li
                className={activeSection === 'returns' ? 'active' : ''}
                onClick={() => setActiveSection('returns')}
              >My Returns</li>
              <li
                className={activeSection === 'cancellations' ? 'active' : ''}
                onClick={() => setActiveSection('cancellations')}
              >My Cancellations</li>
            </ul>
          </div>

          <div className="account-sidebar-group">
            <h4
              className={activeSection === 'wishlist' ? 'active-heading' : ''}
              onClick={() => navigate('/wishlist')}
              style={{ cursor: 'pointer' }}
            >My WishList</h4>
          </div>
        </aside>

        {/* Content */}
        <main className="account-content">
          {activeSection === 'profile' && (
            <form className="account-form" onSubmit={handleSave}>
              <h2>Edit Your Profile</h2>

              <div className="account-form-grid">
                <div className="form-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Md"
                  />
                </div>
                <div className="form-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Rimel"
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    placeholder="rimel1111@gmail.com"
                  />
                </div>
                <div className="form-field">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Kingston, 5236, United State"
                  />
                </div>
              </div>

              <div className="account-pw-section">
                <h3>Password Changes</h3>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                />
              </div>

              {saveMsg && (
                <p className={`account-save-msg ${saveMsg.startsWith('Error') ? 'error' : 'success'}`}>
                  {saveMsg}
                </p>
              )}

              <div className="account-form-actions">
                <button type="button" className="account-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="account-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeSection === 'orders' && (
            <div className="account-orders-view">
              <h2>My Orders</h2>
              {fetchingOrders ? (
                <p>Loading your orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <p className="order-id">Order ID: {order.id.slice(0, 8)}...</p>
                          <p className="order-date">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`order-status-badge ${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-items-summary">
                        {order.order_items.map(item => (
                          <div key={item.id} className="order-item-mini">
                            <img src={item.products?.image} alt={item.products?.name} />
                            <div className="item-meta">
                              <p className="item-name">{item.products?.name}</p>
                              <p className="item-qty">Qty: {item.quantity}</p>
                            </div>
                            <p className="item-subtotal">${(item.price_at_time * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <p className="order-total">Total Amount: <span>${order.total_amount.toFixed(2)}</span></p>
                        <button className="view-order-details-btn">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'returns' && (
            <div className="account-placeholder">
              <h2>My Returns</h2>
              <p className="text-gray-500 mt-4">No return requests found.</p>
            </div>
          )}

          {activeSection === 'cancellations' && (
            <div className="account-placeholder">
              <h2>My Cancellations</h2>
              <p className="text-gray-500 mt-4">No cancellations found.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Account;
