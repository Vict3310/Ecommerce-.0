import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminCalendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [orderEvents, setOrderEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = currentDate.getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    fetchOrderEvents();
  }, [currentDate]);

  const fetchOrderEvents = async () => {
    try {
      setLoading(true);
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, created_at, total_amount, status')
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by day
      const events = {};
      (orders || []).forEach(order => {
        const day = new Date(order.created_at).getDate();
        if (!events[day]) events[day] = [];
        
        const statusColors = {
          pending: 'var(--ta-warning)',
          processing: 'var(--ta-info)',
          shipped: 'var(--ta-primary)',
          delivered: 'var(--ta-success)',
          cancelled: 'var(--ta-danger)'
        };

        events[day].push({
          title: `$${order.total_amount?.toFixed(0)} - ${order.status}`,
          color: statusColors[order.status] || 'var(--ta-text-muted)',
          id: order.id
        });
      });

      setOrderEvents(events);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const isToday = (day) => {
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  // Count total orders for the month
  const totalMonthOrders = Object.values(orderEvents).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div>
      {/* Calendar Header */}
      <div className="ta-card" style={{ padding: 20, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={prevMonth} className="ta-btn ta-btn-outline" style={{ padding: '8px 12px' }}>
            <FaChevronLeft style={{ fontSize: '0.75rem' }} />
          </button>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ta-text-primary)', minWidth: 200, textAlign: 'center' }}>
            {monthName}
          </h3>
          <button onClick={nextMonth} className="ta-btn ta-btn-outline" style={{ padding: '8px 12px' }}>
            <FaChevronRight style={{ fontSize: '0.75rem' }} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="ta-badge ta-badge-primary">{totalMonthOrders} orders this month</span>
          {loading && <div className="ta-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />}
        </div>
      </div>

      {/* Status Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Pending', color: 'var(--ta-warning)' },
          { label: 'Processing', color: 'var(--ta-info)' },
          { label: 'Shipped', color: 'var(--ta-primary)' },
          { label: 'Delivered', color: 'var(--ta-success)' },
          { label: 'Cancelled', color: 'var(--ta-danger)' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--ta-text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 'var(--ta-radius-sm)', background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="ta-card" style={{ overflow: 'hidden' }}>
        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--ta-border)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ta-text-secondary)', background: 'var(--ta-bg-body)' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days.map((day, i) => (
            <div key={i} style={{ 
              minHeight: 100, padding: 8, borderRight: '1px solid var(--ta-border)', 
              borderBottom: '1px solid var(--ta-border)',
              background: day && isToday(day) ? 'var(--ta-primary-light)' : 'transparent',
              cursor: day ? 'pointer' : 'default',
              transition: 'background 0.2s'
            }}>
              {day && (
                <>
                  <span style={{ 
                    fontSize: '0.8125rem', fontWeight: isToday(day) ? 700 : 400, 
                    color: isToday(day) ? 'var(--ta-primary)' : 'var(--ta-text-primary)'
                  }}>
                    {day}
                  </span>
                  {orderEvents[day] && (
                    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {orderEvents[day].slice(0, 3).map((ev, j) => (
                        <div key={j} style={{ 
                          fontSize: '0.5625rem', padding: '2px 5px', borderRadius: 'var(--ta-radius-sm)',
                          background: ev.color, color: 'white', fontWeight: 500, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {ev.title}
                        </div>
                      ))}
                      {orderEvents[day].length > 3 && (
                        <span style={{ fontSize: '0.5625rem', color: 'var(--ta-text-muted)', fontWeight: 500 }}>
                          +{orderEvents[day].length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
