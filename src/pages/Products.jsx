import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaSearch, FaFilter, FaThLarge, FaList } from 'react-icons/fa';
import './Products.css';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    // Handle URL search params
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const category = params.get('category');
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories(name)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const loadedProducts = data || [];
      setProducts(loadedProducts);
      setFilteredProducts(loadedProducts);
      
      // Extract unique categories
      const uniqueCats = ['All', ...new Set(loadedProducts.map(p => p.categories?.name || 'Uncategorized'))];
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };



  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(product => {
        const title = product.title || '';
        const catName = product.categories?.name || 'Uncategorized';
        const desc = product.description || '';
        
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               desc.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => (product.categories?.name || 'Uncategorized') === selectedCategory);
    }

    // Price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Animation logic
  const gridRef = React.useRef(null);
  
  useGSAP(() => {
    if (gridRef.current && currentProducts.length > 0 && !loading) {
      gsap.from(gridRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }, { dependencies: [currentProducts, viewMode, loading] });

  return (
    <div className="products-container min-h-screen">
      <div className="products-header">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>Products</span>
        </div>
        <h1>All Products</h1>
      </div>

      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <h2><FaFilter /> Filters</h2>
            <button className="close-filter" onClick={() => setIsFilterOpen(false)}>×</button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h3>Category</h3>
            <div className="category-list">
              {categories.map((category) => (
                <label key={category} className="category-item">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h3>Avg. Customer Review</h3>
            <div className="rating-filter">
              {[4, 3, 2, 1].map((stars) => (
                <label key={stars} className="rating-item">
                  <input
                    type="radio"
                    name="rating"
                    onChange={() => {
                      const result = products.filter(p => (p.rating || 0) >= stars);
                      setFilteredProducts(result);
                    }}
                  />
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < stars ? 'star filled' : 'star empty'} />
                    ))}
                    <span>& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="price-slider"
            />
          </div>

          <button 
            className="clear-filters"
            onClick={() => {
              setSelectedCategory('All');
              setPriceRange([0, 1000]);
              setSearchQuery('');
              setSortBy('default');
            }}
          >
            Clear All Filters
          </button>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="toolbar-left">
              <button className="filter-toggle" onClick={() => setIsFilterOpen(true)}>
                <FaFilter /> Filters
              </button>
              <p className="results-count">{filteredProducts.length} products found</p>
            </div>

            <div className="toolbar-right">
              {/* Search */}
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch />
              </div>

              {/* Sort */}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="rating">Rating: High to Low</option>
              </select>

              {/* View Mode */}
              <div className="view-toggle">
                <button 
                  className={viewMode === 'grid' ? 'active' : ''} 
                  onClick={() => setViewMode('grid')}
                >
                  <FaThLarge />
                </button>
                <button 
                  className={viewMode === 'list' ? 'active' : ''} 
                  onClick={() => setViewMode('list')}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`products-${viewMode}`} ref={gridRef}>
            {loading ? (
              <div className="w-full text-center py-12 text-gray-500 font-poppins col-span-full">Loading products...</div>
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 1000]);
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination UI */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
