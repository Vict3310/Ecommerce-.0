import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AdminCharts = () => {
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [dailyOrders, setDailyOrders] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });
      if (ordersError) throw ordersError;

      // Fetch products with categories
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*, categories(name)');
      if (productsError) throw productsError;

      // === Monthly Revenue (last 12 months) ===
      const now = new Date();
      const monthly = [];
      for (let m = 11; m >= 0; m--) {
        const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        const activeOrders = (orders || []).filter(o => {
          const d = new Date(o.created_at);
          return d >= date && d <= monthEnd && o.status !== 'cancelled';
        });
        monthly.push({
          month: date.toLocaleString('default', { month: 'short' }),
          revenue: activeOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0)
        });
      }
      setMonthlyRevenue(monthly);

      // === Category Breakdown (from products) ===
      const catMap = {};
      (products || []).forEach(p => {
        const name = p.categories?.name || 'Uncategorized';
        catMap[name] = (catMap[name] || 0) + 1;
      });
      const totalProducts = products?.length || 1;
      const colors = ['var(--ta-primary)', 'var(--ta-success)', 'var(--ta-warning)', 'var(--ta-info)', 'var(--ta-danger)', '#8B5CF6', '#EC4899'];
      const catArr = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(([label, count], i) => ({
          label, value: Math.round((count / totalProducts) * 100), color: colors[i % colors.length]
        }));
      setCategoryBreakdown(catArr);

      // === Orders by Status ===
      const statusMap = {};
      (orders || []).forEach(o => {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1;
      });
      const statusColors = { pending: 'var(--ta-warning)', processing: 'var(--ta-info)', shipped: 'var(--ta-primary)', delivered: 'var(--ta-success)', cancelled: 'var(--ta-danger)' };
      setOrdersByStatus(Object.entries(statusMap).map(([status, count]) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: statusColors[status] || 'var(--ta-text-muted)'
      })));

      // === Daily Orders (last 14 days) ===
      const daily = [];
      for (let d = 13; d >= 0; d--) {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const count = (orders || []).filter(o => {
          const od = new Date(o.created_at);
          return od >= date && od < nextDay;
        }).length;
        daily.push({
          day: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
          count
        });
      }
      setDailyOrders(daily);

    } catch (err) {
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
  const maxDaily = Math.max(...dailyOrders.map(d => d.count), 1);
  const maxLineVal = maxDaily;
  const totalOrders = ordersByStatus.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* Monthly Revenue Bar Chart */}
      <div className="ta-card" style={{ padding: 24, gridColumn: 'span 2' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 20 }}>Monthly Revenue</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 220, padding: '0 8px' }}>
          {monthlyRevenue.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.5625rem', color: 'var(--ta-text-muted)', fontWeight: 500 }}>
                {d.revenue > 0 ? `$${d.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}
              </span>
              <div style={{ 
                width: '100%', height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%`, 
                background: d.revenue > 0 
                  ? `linear-gradient(180deg, var(--ta-primary), rgba(70, 95, 255, 0.3))`
                  : 'var(--ta-border)',
                borderRadius: 'var(--ta-radius-sm)', transition: 'height 0.6s ease', minHeight: 4
              }} />
              <span style={{ fontSize: '0.625rem', color: 'var(--ta-text-muted)' }}>{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Orders Area Chart */}
      <div className="ta-card" style={{ padding: 24 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 20 }}>Daily Orders (Last 14 Days)</h4>
        <div style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'flex-end' }}>
          <svg viewBox="0 0 140 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ta-primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--ta-primary)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon
              fill="url(#areaGrad)"
              points={dailyOrders.map((d, i) => `${(i / (dailyOrders.length - 1)) * 140},${100 - (d.count / maxLineVal) * 85}`).join(' ') + ` 140,100 0,100`}
            />
            <polyline
              fill="none" stroke="var(--ta-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              points={dailyOrders.map((d, i) => `${(i / (dailyOrders.length - 1)) * 140},${100 - (d.count / maxLineVal) * 85}`).join(' ')}
            />
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: '0.625rem', color: 'var(--ta-text-muted)' }}>{dailyOrders[0]?.day}</span>
          <span style={{ fontSize: '0.625rem', color: 'var(--ta-text-muted)' }}>{dailyOrders[dailyOrders.length - 1]?.day}</span>
        </div>
      </div>

      {/* Products by Category Donut Chart */}
      <div className="ta-card" style={{ padding: 24 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 20 }}>Products by Category</h4>
        {categoryBreakdown.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--ta-text-muted)', padding: 32 }}>No products yet</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
              <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {(() => {
                  let offset = 0;
                  return categoryBreakdown.map((d, i) => {
                    const el = (
                      <circle key={i} cx="21" cy="21" r="15.91" fill="none"
                        stroke={d.color} strokeWidth="5"
                        strokeDasharray={`${d.value} ${100 - d.value}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += d.value;
                    return el;
                  });
                })()}
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categoryBreakdown.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>{d.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginLeft: 'auto' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Orders by Status */}
      <div className="ta-card" style={{ padding: 24, gridColumn: 'span 2' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Orders by Status</h4>
        {ordersByStatus.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--ta-text-muted)', padding: 32 }}>No orders yet</p>
        ) : (
          ordersByStatus.map((ch, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>{ch.label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>{ch.value} ({Math.round((ch.value / totalOrders) * 100)}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--ta-border)', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(ch.value / totalOrders) * 100}%`, background: ch.color, borderRadius: 9999, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCharts;
