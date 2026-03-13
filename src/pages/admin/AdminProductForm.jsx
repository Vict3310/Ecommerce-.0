import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaImage, FaTag, FaLayerGroup, FaWarehouse, FaStar, FaPlus, FaTrash } from 'react-icons/fa';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    stock_quantity: '',
    is_featured: false,
    image_urls: [], 
    specifications: {}
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        title: data.title,
        description: data.description || '',
        price: data.price,
        compare_at_price: data.compare_at_price || '',
        category_id: data.category_id || '',
        stock_quantity: data.stock_quantity,
        is_featured: data.is_featured,
        image_urls: data.image_urls || [],
        specifications: data.specifications || {}
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddImage = (url) => {
    if (!url) return;
    setFormData({ ...formData, image_urls: [...formData.image_urls, url] });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.image_urls];
    newImages.splice(index, 1);
    setFormData({ ...formData, image_urls: newImages });
  };

  const handleAddSpec = () => {
    if (!newSpec.key || !newSpec.value) return;
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [newSpec.key]: newSpec.value }
    });
    setNewSpec({ key: '', value: '' });
  };

  const handleRemoveSpec = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      category_id: formData.category_id || null,
      stock_quantity: parseInt(formData.stock_quantity || 0, 10),
      is_featured: formData.is_featured,
      image_urls: formData.image_urls,
      specifications: formData.specifications
    };

    try {
      if (isEditing) {
        const { error } = await supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      navigate('/admin/products');
    } catch (err) {
       console.error("Error saving product:", err);
       alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button 
          onClick={() => navigate('/admin/products')}
          className="ta-btn ta-btn-outline"
          style={{ padding: 10 }}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="ta-page-title">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--ta-text-secondary)', marginTop: 2 }}>Fill in the product details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Product Identity */}
          <div className="ta-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Product Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="ta-label">Product Name *</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="ta-input"
                  placeholder="e.g. Wireless Headphones"
                />
              </div>

              <div>
                <label className="ta-label">Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange} rows="5"
                  className="ta-input" style={{ resize: 'vertical' }}
                  placeholder="Describe the product..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Media Assets */}
          <div className="ta-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>Product Images</h3>
              <span className="ta-badge ta-badge-primary">{formData.image_urls.length} images</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                {formData.image_urls.map((url, index) => (
                  <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--ta-radius-md)', overflow: 'hidden', border: '1px solid var(--ta-border)', background: 'var(--ta-bg-body)' }} className="group">
                    <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button 
                      type="button" onClick={() => handleRemoveImage(index)}
                      style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 'var(--ta-radius-sm)', background: 'rgba(255,255,255,0.9)', color: 'var(--ta-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: '0.625rem', opacity: 0, transition: 'opacity 0.2s' }}
                      className="group-hover:opacity-100!"
                    >
                      <FaTrash />
                    </button>
                    {index === 0 && (
                      <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--ta-primary)', color: 'white', fontSize: '0.5625rem', fontWeight: 600, padding: '2px 6px', borderRadius: 'var(--ta-radius-sm)' }}>
                        Cover
                      </div>
                    )}
                  </div>
                ))}
                
                <div style={{ position: 'relative', aspectRatio: '1', border: '2px dashed var(--ta-border)', borderRadius: 'var(--ta-radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                   <input 
                    type="file" accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoading(true);
                      try {
                        const fileExt = file.name.split('.').pop();
                        const filePath = `${Math.random()}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
                        if (uploadError) throw uploadError;
                        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
                        handleAddImage(publicUrl);
                      } catch (err) {
                        console.error("Upload error:", err);
                        alert("Failed to upload image.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
                  />
                  <FaPlus style={{ color: 'var(--ta-text-muted)' }} />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--ta-text-muted)', fontWeight: 500 }}>Upload</span>
                </div>
              </div>

              <div style={{ maxWidth: 400 }}>
                <label className="ta-label">Or add image URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="url" id="image-url-input"
                    className="ta-input" 
                    placeholder="https://example.com/image.jpg"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('image-url-input');
                      if (input.value) {
                        handleAddImage(input.value);
                        input.value = '';
                      }
                    }}
                    className="ta-btn ta-btn-primary" style={{ whiteSpace: 'nowrap' }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="ta-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Specifications</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, padding: 16, background: 'var(--ta-bg-body)', borderRadius: 'var(--ta-radius-md)' }}>
                <div>
                  <label className="ta-label">Key</label>
                  <input 
                    type="text" value={newSpec.key} onChange={(e) => setNewSpec({...newSpec, key: e.target.value})}
                    className="ta-input" placeholder="e.g. Screen Size"
                  />
                </div>
                <div>
                  <label className="ta-label">Value</label>
                  <input 
                    type="text" value={newSpec.value} onChange={(e) => setNewSpec({...newSpec, value: e.target.value})}
                    className="ta-input" placeholder="e.g. 6.7 inches"
                  />
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                  <button type="button" onClick={handleAddSpec} className="ta-btn ta-btn-primary" style={{ padding: '10px 16px' }}>
                    <FaPlus />
                  </button>
                </div>
              </div>

              {Object.entries(formData.specifications).length === 0 ? (
                <p style={{ textAlign: 'center', padding: 24, color: 'var(--ta-text-muted)', fontSize: '0.875rem' }}>No specifications added yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--ta-bg-card)', border: '1px solid var(--ta-border)', borderRadius: 'var(--ta-radius-md)' }}>
                      <div>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--ta-text-muted)', fontWeight: 500 }}>{key}</p>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ta-text-primary)' }}>{value}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveSpec(key)} style={{ background: 'none', border: 'none', color: 'var(--ta-text-muted)', cursor: 'pointer', padding: 4 }}>
                        <FaTrash style={{ fontSize: '0.75rem' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Pricing */}
            <div className="ta-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Pricing</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="ta-label">Price *</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="ta-input" placeholder="0.00" />
                </div>
                <div>
                  <label className="ta-label">Compare at Price</label>
                  <input type="number" step="0.01" name="compare_at_price" value={formData.compare_at_price} onChange={handleChange} className="ta-input" placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="ta-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ta-text-primary)', marginBottom: 16 }}>Organization</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="ta-label">Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} className="ta-select">
                    <option value="">Select category</option>
                    {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="ta-label">Stock Quantity *</label>
                  <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required className="ta-input" placeholder="0" />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--ta-bg-body)', borderRadius: 'var(--ta-radius-md)', cursor: 'pointer' }}>
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--ta-primary)' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ta-text-primary)' }}>Featured Product</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="submit" disabled={loading} className="ta-btn ta-btn-primary w-full" style={{ padding: '12px 24px' }}>
                {loading ? <div className="ta-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <FaSave />}
                <span>{loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}</span>
              </button>
              <button type="button" onClick={() => navigate('/admin/products')} className="ta-btn ta-btn-outline w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;

