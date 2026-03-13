import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { FaEnvelope, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileStats, setProfileStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Count products
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders for stats + recent activity
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      const totalRevenue = (orders || [])
        .filter(o => o.status !== 'cancelled')
        .reduce((acc, o) => acc + (o.total_amount || 0), 0);

      setProfileStats({
        products: productCount || 0,
        orders: orders?.length || 0,
        revenue: totalRevenue
      });

      // Recent activity from last 5 orders
      const activity = (orders || []).slice(0, 5).map(o => ({
        action: `Order #${o.id?.slice(0, 8)} — $${o.total_amount?.toFixed(2)} (${o.status})`,
        time: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      }));
      setRecentActivity(activity);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Cover + Avatar */}
      <div className="ta-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: 180, background: 'linear-gradient(135deg, var(--ta-primary), #7B8CFF)', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', bottom: -40, left: 24, width: 80, height: 80, borderRadius: '50%',
            background: 'var(--ta-primary)', border: '4px solid var(--ta-bg-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '2rem', fontWeight: 700
          }}>
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
        </div>
        <div style={{ padding: '48px 24px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ta-text-primary)' }}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin User'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--ta-text-secondary)', marginTop: 2 }}>Store Administrator</p>
            </div>
            <button className="ta-btn ta-btn-outline">
              <FaEdit style={{ fontSize: '0.75rem' }} /> Edit Profile
            </button>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>
              <FaEnvelope /> {user?.email || '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>
              <FaCalendarAlt /> Joined {joinDate}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Products Listed', value: profileStats.products.toLocaleString() },
          { label: 'Orders Managed', value: profileStats.orders.toLocaleString() },
          { label: 'Revenue Generated', value: `$${profileStats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        ].map((stat, i) => (
          <div key={i} className="ta-stat-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ta-text-primary)' }}>{stat.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)', marginTop: 4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Account Information */}
      <div className="ta-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Email', value: user?.email || '—' },
            { label: 'User ID', value: user?.id?.slice(0, 12) + '...' || '—' },
            { label: 'Role', value: 'Admin' },
            { label: 'Member Since', value: joinDate },
            { label: 'Last Sign In', value: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' },
            { label: 'Auth Provider', value: user?.app_metadata?.provider || 'Email' },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)', marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ta-text-primary)' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="ta-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p style={{ color: 'var(--ta-text-muted)', fontSize: '0.875rem' }}>No recent activity</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--ta-bg-body)', borderRadius: 'var(--ta-radius-md)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--ta-text-primary)', fontWeight: 500 }}>{a.action}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)', flexShrink: 0, marginLeft: 12 }}>{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
