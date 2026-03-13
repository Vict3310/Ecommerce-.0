import './productcard.css'
import viewmore from '../icons/Quick View.svg'
import whishlist from '../icons/heart small.svg'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { supabase } from '../lib/supabase'

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (user && product.id) {
      checkWishlistStatus();
    }
  }, [user, product.id]);

  const checkWishlistStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (data) {
        setIsWishlisted(true);
        setWishlistId(data.id);
      }
    } catch (err) {
      console.error("Error checking wishlist status:", err);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star" />)
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star" />)
    }
    
    // Fill remaining with empty stars
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star" style={{ color: '#ddd' }} />)
    }
    
    return stars
  }

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
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
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image_urls?.[0] || 'https://via.placeholder.com/300',
        quantity: 1
      });
    }
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  }

  return (
    <div className="productcard" onClick={handleCardClick}>
      <img src={product.image_urls?.[0] || product.image || 'https://via.placeholder.com/300'} alt={product.title || product.name} className='imggg' loading="lazy" />
      {product.compare_at_price && product.compare_at_price > product.price && (
        <span className="discount-badge">
          -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
        </span>
      )}
      {product.stock_quantity === 0 && (
        <span className="sold-out-badge" style={{ 
          position: 'absolute', top: 12, left: 12, background: '#000', color: '#fff', 
          padding: '4px 8px', fontSize: '12px', fontWeight: 600, borderRadius: '4px', zIndex: 10 
        }}>
          SOLD OUT
        </span>
      )}
      <button 
        onClick={handleAddToCart} 
        disabled={product.stock_quantity === 0}
        style={product.stock_quantity === 0 ? { cursor: 'not-allowed', background: '#999' } : {}}
      >
        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
      <div className="productcard-icons">
        <img 
          src={viewmore} 
          alt="Quick view" 
          className="productcard-icon"
          onClick={handleCardClick}
        />
        <img 
          src={whishlist} 
          alt="Add to wishlist" 
          className={`productcard-icon ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlist}
        />
      </div>
       
      <h3 className="product-name">{product.title || product.name}</h3>
      <p className="product-category">{product.categories?.name || product.category}</p>
      <div className='price'>
        <p className="product-price"><strong>{formatPrice(product.price)}</strong></p>
        {product.compare_at_price && (
          <p className="product-before-price">{formatPrice(product.compare_at_price)}</p>
        )}
      </div>
      {product.rating && (
        <div className="rating">
          {renderStars(product.rating)}
          <span>{product.rating?.toFixed(1)}</span>
        </div>
      )}
      
    </div>
  );
}

export default ProductCard;
