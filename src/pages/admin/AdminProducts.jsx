import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBox, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories ( name )`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Reset page when search changes
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="ta-spinner"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="ta-search-box" style={{ minWidth: 280 }}>
          <FaSearch style={{ color: 'var(--ta-text-muted)', flexShrink: 0, fontSize: '0.875rem' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>Show</span>
            <select 
              className="ta-select" 
              style={{ width: 70, padding: '6px 30px 6px 12px' }}
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <Link to="/admin/products/new" className="ta-btn ta-btn-primary">
            <FaPlus style={{ fontSize: '0.75rem' }} /> Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="ta-table-container">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 48 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--ta-text-muted)' }}>
                    <FaBox style={{ fontSize: '2rem' }} />
                    <p style={{ fontWeight: 500 }}>No products found</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 48, height: 48, borderRadius: 'var(--ta-radius-md)', 
                        overflow: 'hidden', flexShrink: 0, background: 'var(--ta-bg-body)',
                        border: '1px solid var(--ta-border)'
                      }}>
                        <img 
                          src={product.image_urls?.[0] || 'https://via.placeholder.com/48'} 
                          alt={product.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--ta-text-primary)', fontSize: '0.875rem' }}>
                          {product.title}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--ta-text-muted)' }}>
                          SKU-{product.id?.split('-')[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="ta-badge ta-badge-primary">
                      {product.categories?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{product.stock_quantity}</span>
                  </td>
                  <td>
                    <span className={
                      product.stock_quantity > 10 ? 'ta-badge ta-badge-success' :
                      product.stock_quantity > 0 ? 'ta-badge ta-badge-warning' :
                      'ta-badge ta-badge-danger'
                    }>
                      {product.stock_quantity > 10 ? 'In Stock' : product.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="ta-btn ta-btn-outline" 
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="ta-btn" 
                        style={{ padding: '6px 10px', fontSize: '0.75rem', background: 'var(--ta-danger-bg)', color: 'var(--ta-danger)', border: 'none' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            padding: '12px 20px', borderTop: '1px solid var(--ta-border)', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--ta-text-secondary)' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
            </span>
            <div className="ta-pagination">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <FaChevronLeft style={{ fontSize: '0.625rem' }} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <FaChevronRight style={{ fontSize: '0.625rem' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
