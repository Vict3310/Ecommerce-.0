import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaBox, 
  FaUsers,
  FaArrowUp, 
  FaArrowDown,
  FaEye,
  FaPlus,
  FaChevronRight,
  FaCog
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sales: 0, orders: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [deliveredRate, setDeliveredRate] = useState(0);
  const [monthTarget] = useState(10000); // Can be made configurable from settings

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (ordersError) throw ordersError;

      // Fetch product count
      const { count: productCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (productsError) throw productsError;

      // Fetch unique customers count (distinct user_ids from orders)
      const uniqueCustomers = new Set(orders.map(o => o.user_id).filter(Boolean));

      // Calculate total sales (non-cancelled)
      const activeOrders = orders.filter(o => o.status !== 'cancelled');
      const totalSales = activeOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0);

      // Average order value
      const aov = activeOrders.length > 0 ? totalSales / activeOrders.length : 0;
      setAvgOrderValue(aov);

      // Delivered rate
      const delivered = orders.filter(o => o.status === 'delivered').length;
      setDeliveredRate(orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0);

      // Monthly revenue breakdown (last 12 months)
      const now = new Date();
      const monthlyData = [];
      for (let m = 11; m >= 0; m--) {
        const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        const monthOrders = activeOrders.filter(o => {
          const d = new Date(o.created_at);
          return d >= date && d <= monthEnd;
        });
        const revenue = monthOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
        monthlyData.push({
          month: date.toLocaleString('default', { month: 'short' }),
          revenue
        });
      }
      setMonthlyRevenue(monthlyData);

      // Current month revenue for target gauge
      const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;

      setStats({
        sales: totalSales,
        orders: orders.length,
        products: productCount || 0,
        customers: uniqueCustomers.size,
        currentMonthRevenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  const targetPercent = monthTarget > 0 ? Math.min(Math.round((stats.currentMonthRevenue / monthTarget) * 100), 100) : 0;
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FaDollarSign,
      iconBg: '#ECFDF5',
      iconColor: '#10B981'
    },
    {
      label: 'Total Orders',
      value: stats.orders.toLocaleString(),
      icon: FaShoppingCart,
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6'
    },
    {
      label: 'Total Products',
      value: stats.products.toLocaleString(),
      icon: FaBox,
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6'
    },
    {
      label: 'Unique Customers',
      value: stats.customers.toLocaleString(),
      icon: FaUsers,
      iconBg: '#FFF7ED',
      iconColor: '#F59E0B'
    },
  ];

  const getStatusBadge = (status) => {
    const map = {
      'pending': 'ta-badge ta-badge-warning',
      'processing': 'ta-badge ta-badge-info',
      'shipped': 'ta-badge ta-badge-primary',
      'delivered': 'ta-badge ta-badge-success',
      'cancelled': 'ta-badge ta-badge-danger',
    };
    return map[status] || 'ta-badge';
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="ta-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--ta-text-secondary)', fontWeight: 500 }}>
                  {card.label}
                </p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ta-text-primary)', marginTop: 8, letterSpacing: '-0.02em' }}>
                  {card.value}
                </h3>
              </div>
              <div style={{ 
                width: 48, height: 48, borderRadius: 'var(--ta-radius-lg)', 
                background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.iconColor, fontSize: '1.125rem'
              }}>
                <card.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue Chart — dynamic from orders */}
        <div className="xl:col-span-2 ta-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>Revenue Overview</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)' }}>Last 12 months</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, padding: '0 8px' }}>
            {monthlyRevenue.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.5625rem', color: 'var(--ta-text-muted)', fontWeight: 500 }}>
                  {d.revenue > 0 ? `$${d.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}
                </span>
                <div style={{ 
                  width: '100%', height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%`, 
                  background: d.revenue > 0 
                    ? `linear-gradient(180deg, var(--ta-primary), rgba(70, 95, 255, 0.4))` 
                    : 'var(--ta-border)',
                  borderRadius: 'var(--ta-radius-sm)',
                  transition: 'height 0.5s ease',
                  minHeight: 4
                }} />
                <span style={{ fontSize: '0.625rem', color: 'var(--ta-text-muted)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Target — dynamic */}
        <div className="ta-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>Monthly Target</h4>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ta-border)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ta-primary)" strokeWidth="8" 
                  strokeDasharray={`${(targetPercent / 100) * 264} ${264}`}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ta-text-primary)' }}>{targetPercent}%</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)' }}>Achieved</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>
                ${monthTarget.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--ta-text-muted)' }}>Target</p>
            </div>
            <div style={{ width: 1, background: 'var(--ta-border)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-success)' }}>
                ${(stats.currentMonthRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--ta-text-muted)' }}>Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 ta-table-container">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ta-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>Recent Orders</h4>
            <button 
              onClick={() => navigate('/admin/orders')}
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ta-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View All <FaChevronRight style={{ fontSize: '0.6rem' }} />
            </button>
          </div>
          <table className="ta-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--ta-text-muted)' }}>
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>#{order.id?.slice(0, 8)}</td>
                    <td>{order.shipping_info?.name || order.contact_email || 'N/A'}</td>
                    <td style={{ fontWeight: 600 }}>${order.total_amount?.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="ta-btn ta-btn-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => navigate('/admin/orders')}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions + Dynamic Performance */}
        <div className="ta-card" style={{ padding: 24 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Quick Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button 
              onClick={() => navigate('/admin/products/new')}
              className="ta-btn ta-btn-primary w-full" style={{ justifyContent: 'flex-start' }}
            >
              <FaPlus /> Add New Product
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="ta-btn ta-btn-outline w-full" style={{ justifyContent: 'flex-start' }}
            >
              <FaShoppingCart /> Manage Orders
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="ta-btn ta-btn-outline w-full" style={{ justifyContent: 'flex-start' }}
            >
              <FaBox /> View All Products
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="ta-btn ta-btn-outline w-full" style={{ justifyContent: 'flex-start' }}
            >
              <FaCog /> Store Settings
            </button>
          </div>

          {/* Dynamic Performance Metrics */}
          <div style={{ marginTop: 24, padding: 16, background: 'var(--ta-bg-body)', borderRadius: 'var(--ta-radius-lg)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ta-text-secondary)', marginBottom: 12 }}>Performance</p>
            {[
              { label: 'Delivery Rate', value: `${deliveredRate}%`, width: `${deliveredRate}%` },
              { label: 'Avg. Order Value', value: `$${avgOrderValue.toFixed(2)}`, width: `${Math.min((avgOrderValue / 200) * 100, 100)}%` },
              { label: 'Products Listed', value: stats.products.toString(), width: `${Math.min((stats.products / 100) * 100, 100)}%` },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ta-text-secondary)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>{item.value}</span>
                </div>
                <div style={{ height: 4, background: 'var(--ta-border)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: item.width, background: 'var(--ta-primary)', borderRadius: 9999, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
