import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FaUser, FaClipboardCheck } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, profiles:user_id (full_name, email)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status");
    }
  };

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

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'var(--ta-primary)' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'var(--ta-warning)' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'var(--ta-success)' },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: 'var(--ta-danger)' },
        ].map((item, i) => (
          <div key={i} className="ta-stat-card" style={{ padding: 16 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--ta-text-secondary)', fontWeight: 500 }}>{item.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: item.color, marginTop: 4 }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="ta-table-container">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', background: 'var(--ta-bg-body)', 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
              color: 'var(--ta-text-muted)', marginBottom: 16 
            }}>
              <FaClipboardCheck style={{ fontSize: '1.5rem' }} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>No orders yet</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--ta-text-muted)', marginTop: 4 }}>Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <table className="ta-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      #{order.id?.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ 
                        width: 36, height: 36, borderRadius: '50%', 
                        background: 'var(--ta-bg-body)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center',
                        color: 'var(--ta-text-muted)', fontSize: '0.75rem'
                      }}>
                        <FaUser />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--ta-text-primary)' }}>
                          {order.contact_email || order.profiles?.email || 'N/A'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)' }}>
                          {order.shipping_address?.slice(0, 30) || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ${order.total_amount?.toFixed(2)}
                  </td>
                  <td>
                    <span className={getStatusBadge(order.status)}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="ta-select"
                      style={{ width: 'auto', minWidth: 130, fontSize: '0.8125rem' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
