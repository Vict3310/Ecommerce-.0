import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaTruck, FaUndo } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './ProductDetail.css';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [bundleProduct, setBundleProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`*, categories(name)`)
        .eq('id', id)
        .single();
        
      if (productError) throw productError;
      
      setProduct(productData);
      
      if (productData.category_id) {
        // Fetch related products
        const { data: relatedData } = await supabase
          .from('products')
          .select(`*, categories(name)`)
          .eq('category_id', productData.category_id)
          .neq('id', productData.id)
          .limit(4);
          
        if (relatedData) {
          setRelatedProducts(relatedData);
          // Use the first related product as the "Frequently Bought Together" item
          if (relatedData.length > 0) {
            setBundleProduct(relatedData[0]);
          }
        }
      }
      
      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });
        
      if (reviewsData) setReviews(reviewsData);
      
      // Check wishlist status
      if (user) {
         const { data: wishlistData } = await supabase
           .from('wishlists')
           .select('id')
           .eq('user_id', user.id)
           .eq('product_id', id)
           .maybeSingle();
           
         if (wishlistData) {
           setIsWishlisted(true);
           setWishlistId(wishlistData.id);
         }
      }
      
    } catch (err) {
      console.error("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review");
    
    setIsSubmittingReview(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          product_id: id,
          user_id: user.id,
          user_name: user?.user_metadata?.full_name || user.email.split('@')[0],
          rating: userReview.rating,
          comment: userReview.comment
        }])
        .select()
        .single();
        
      if (error) throw error;
      setReviews([data, ...reviews]);
      setUserReview({ rating: 5, comment: '' });
      alert("Review submitted!");
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="p-24 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-24 text-center">Product not found</div>;
  }

  // Use product images array or fallback to placeholder
  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : ['https://via.placeholder.com/600'];
  
  const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors = product.colors || ['black', 'red'];

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity
      });
    }
  };

  const handleAddBundleToCart = () => {
    if (onAddToCart && bundleProduct) {
      // Add main product
      onAddToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity: 1
      });
      // Add bundle product
      onAddToCart({
        ...bundleProduct,
        quantity: 1
      });
      alert(`Bundle added: ${product.title} + ${bundleProduct.title}`);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      alert("Please login to add items to your wishlist.");
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted && wishlistId) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('id', wishlistId);
          
        if (error) throw error;
        setIsWishlisted(false);
        setWishlistId(null);
      } else {
        // Add to wishlist
        const { data, error } = await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, product_id: product.id }])
          .select()
          .single();
          
        if (error) throw error;
        setIsWishlisted(true);
        setWishlistId(data.id);
      }
    } catch (err) {
       console.error("Error toggling wishlist:", err);
       alert("Failed to update wishlist.");
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        style={{ color: i < Math.round(rating) ? '#FFD700' : '#ddd' }} 
      />
    ));
  };

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">{product.categories?.name || 'Uncategorized'}</Link> / <span>{product.title}</span>
      </div>

      <div className="product-detail-container">
        <div className="product-images">
          <div className="thumbnail-list">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={images[selectedImage]} alt={product.title} />
          </div>
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <div className="rating">
            <div className="stars">
              {renderStars(product.rating || 5)}
            </div>
            <span>({product.reviewCount || 0} Reviews)</span>
            <span className="stock">{product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          <div className="price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="old-price">{formatPrice(product.compare_at_price)}</span>
            )}
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="discount-badge">
                -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
              </span>
            )}
          </div>

          <p className="description">
            {product.description}
          </p>

          {/* Color and Size Options */}
          <div className="options">
            {colors.length > 1 && (
              <div className="option-group">
                <label>Colours:</label>
                <div className="color-options">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      style={{ background: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && sizes[0] !== 'One Size' && (
              <div className="option-group">
                <label>Size:</label>
                <div className="size-options">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock_quantity === 0}
              >-</button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                disabled={product.stock_quantity === 0}
              >+</button>
            </div>
            <button 
              className="buy-btn"
              disabled={product.stock_quantity === 0}
              style={product.stock_quantity === 0 ? { background: '#999', cursor: 'not-allowed' } : {}}
            >
              {product.stock_quantity === 0 ? 'Sold Out' : 'Buy Now'}
            </button>
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              style={product.stock_quantity === 0 ? { background: '#999', cursor: 'not-allowed' } : {}}
            >
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add To Cart'}
            </button>
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              <FaHeart />
            </button>
          </div>

          <div className="delivery-info">
            <div className="info-item">
              <FaTruck />
              <div>
                <strong>Free Delivery</strong>
                <p>Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="info-item">
              <FaUndo />
              <div>
                <strong>Return Delivery</strong>
                <p>Free 30 Days Delivery Returns. Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      {(() => {
        let specs = product.specifications || {};
        
        // If specifications object is empty, try to parse from description
        if (Object.keys(specs).length === 0 && product.description?.includes('TECHNICAL SPECIFICATIONS:')) {
          const parts = product.description.split('TECHNICAL SPECIFICATIONS:');
          const specText = parts[1]?.trim();
          if (specText) {
            specs = specText.split('\n').reduce((acc, line) => {
              const [key, ...valParts] = line.split(':');
              if (key && valParts.length > 0) {
                acc[key.trim()] = valParts.join(':').trim();
              }
              return acc;
            }, {});
          }
        }

        if (Object.keys(specs).length > 0) {
          return (
            <div className="specifications-section">
              <h2>Specifications</h2>
              <div className="specifications-table">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Add Review Form */}
      <div className="add-review-section">
        <h2>Write a Review</h2>
        {user ? (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-input">
              <label>Your Rating:</label>
              <select 
                value={userReview.rating} 
                onChange={(e) => setUserReview({...userReview, rating: Number(e.target.value)})}
              >
                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <textarea
              placeholder="What did you like or dislike?"
              value={userReview.comment}
              onChange={(e) => setUserReview({...userReview, comment: e.target.value})}
              required
            ></textarea>
            <button type="submit" disabled={isSubmittingReview}>
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">Please <Link to="/login">login</Link> to leave a review.</p>
        )}
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleProduct && (
        <div className="bundle-section">
          <h2>Frequently Bought Together</h2>
          <div className="bundle-container">
            <div className="bundle-images">
              <div className="bundle-item-img">
                <img src={product.image} alt={product.title} />
              </div>
              <span className="bundle-plus">+</span>
              <div className="bundle-item-img">
                <img src={bundleProduct.image} alt={bundleProduct.title} />
              </div>
            </div>
            <div className="bundle-info">
              <div className="bundle-text">
                <p><strong>Total Price:</strong> <span className="total-price">${(product.price + bundleProduct.price).toFixed(2)}</span></p>
                <p className="bundle-savings">Buy together and save 5% with code BUNDLE5</p>
              </div>
              <button className="add-bundle-btn" onClick={handleAddBundleToCart}>
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-section">
        <h2>Customer Reviews ({reviews.length})</h2>
        <div className="reviews-list">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-user">{review.user_name}</span>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-footer">
                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          )) : (
            <p className="no-reviews">No reviews yet. Be the first to rate this product!</p>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2>Related Products</h2>
          <div className="related-products">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
