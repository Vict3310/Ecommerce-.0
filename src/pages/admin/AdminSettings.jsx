import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FaSave, FaStore, FaGlobe, FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState({
    store_name: '', hero_headline: '', hero_subheadline: '',
    contact_email: '', currency_symbol: '$', banner_message: '',
    hero_images: [],
    promo_banner: {
      title: "", category: "", image_url: "", button_text: "", countdown_date: ""
    }
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      if (error) throw error;
      if (data) setSettings({
        store_name: data.store_name || '', 
        hero_headline: data.hero_headline || '',
        hero_subheadline: data.hero_subheadline || '', 
        contact_email: data.contact_email || '',
        currency_symbol: data.currency_symbol || '$', 
        banner_message: data.banner_message || '',
        hero_images: data.hero_images || [],
        promo_banner: {
          title: data.promo_banner?.title || '',
          category: data.promo_banner?.category || '',
          image_url: data.promo_banner?.image_url || '',
          button_text: data.promo_banner?.button_text || '',
          countdown_date: data.promo_banner?.countdown_date || ''
        }
      });
    } catch (err) { console.error("Error fetching settings:", err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('promo_')) {
      const field = name.replace('promo_', '');
      setSettings({
        ...settings,
        promo_banner: { ...settings.promo_banner, [field]: value }
      });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleHeroImageChange = (index, value) => {
    const newImages = [...settings.hero_images];
    newImages[index] = value;
    setSettings({ ...settings, hero_images: newImages });
  };

  const addHeroImage = () => {
    setSettings({ ...settings, hero_images: [...settings.hero_images, ''] });
  };

  const removeHeroImage = (index) => {
    setSettings({ ...settings, hero_images: settings.hero_images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase.from('store_settings').update(settings).eq('id', 1);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, paddingBottom: 40 }}>
      {message.text && (
        <div style={{ 
          padding: '12px 16px', marginBottom: 24, borderRadius: 'var(--ta-radius-md)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', fontWeight: 500,
          background: message.type === 'success' ? 'var(--ta-success-bg)' : 'var(--ta-danger-bg)',
          color: message.type === 'success' ? 'var(--ta-success)' : 'var(--ta-danger)',
          border: `1px solid ${message.type === 'success' ? 'var(--ta-success)' : 'var(--ta-danger)'}20`
        }}>
          {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* General */}
        <div className="ta-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--ta-radius-md)', background: 'var(--ta-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ta-primary)' }}>
              <FaStore />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>General Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div>
              <label className="ta-label">Store Name</label>
              <input className="ta-input" name="store_name" value={settings.store_name} onChange={handleChange} required placeholder="My Store" />
            </div>
            <div>
              <label className="ta-label">Contact Email</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ta-text-muted)', fontSize: '0.8rem' }} />
                <input className="ta-input" style={{ paddingLeft: 38 }} name="contact_email" type="email" value={settings.contact_email} onChange={handleChange} placeholder="admin@store.com" />
              </div>
            </div>
            <div>
              <label className="ta-label">Currency Symbol</label>
              <input className="ta-input" name="currency_symbol" value={settings.currency_symbol} onChange={handleChange} maxLength={3} style={{ maxWidth: 100, textAlign: 'center' }} />
            </div>
          </div>
        </div>

        {/* Homepage Swiper */}
        <div className="ta-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--ta-radius-md)', background: 'var(--ta-bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ta-text-muted)' }}>
              <FaGlobe />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>Hero Swiper Images</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {settings.hero_images.map((img, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10 }}>
                <input className="ta-input" value={img} onChange={(e) => handleHeroImageChange(idx, e.target.value)} placeholder="https://image-url.com/hero.jpg" />
                <button type="button" onClick={() => removeHeroImage(idx)} className="ta-btn ta-btn-danger" style={{ padding: '0 12px' }}>×</button>
              </div>
            ))}
            <button type="button" onClick={addHeroImage} className="ta-btn" style={{ background: 'var(--ta-bg-body)', alignSelf: 'flex-start' }}>+ Add Image</button>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="ta-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--ta-radius-md)', background: 'rgba(0, 255, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff66' }}>
              <FaGlobe />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>Promotional Banner (Featured)</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="ta-label">Banner Title</label>
              <input className="ta-input" name="promo_title" value={settings.promo_banner.title} onChange={handleChange} placeholder="Enhance Your Music Experience" />
            </div>
            <div>
              <label className="ta-label">Category Text</label>
              <input className="ta-input" name="promo_category" value={settings.promo_banner.category} onChange={handleChange} placeholder="Category" />
            </div>
            <div>
              <label className="ta-label">Image URL</label>
              <input className="ta-input" name="promo_image_url" value={settings.promo_banner.image_url} onChange={handleChange} placeholder="https://..." />
            </div>
            <div>
              <label className="ta-label">Button Text</label>
              <input className="ta-input" name="promo_button_text" value={settings.promo_banner.button_text} onChange={handleChange} placeholder="Buy Now" />
            </div>
            <div>
              <label className="ta-label">Countdown End Date</label>
              <input className="ta-input" type="datetime-local" name="promo_countdown_date" value={settings.promo_banner.countdown_date} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} className="ta-btn ta-btn-primary" style={{ padding: '12px 32px' }}>
            {saving ? <div className="ta-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <FaSave />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
