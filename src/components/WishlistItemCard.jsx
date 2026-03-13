import './wishlistitemcard.css';
import viewmore from '../icons/Fill Eye.svg';
import trashIcon from '../icons/Component 2.svg'; /* Need to check this one or use a better trash icon */
import cartIcon from '../icons/Cart1 with buy.svg';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function WishlistItemCard({ product, variant = 'wishlist', onAddToCart, onRemove }) {
    const navigate = useNavigate();

    const renderStars = (rating) => {
        if (!rating) return null;

        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="star" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star" />);
        }

        const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="star" style={{ color: '#ddd' }} />);
        }

        return stars;
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(product.id);
        }
    }

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="wishlist-card" onClick={handleCardClick}>
            <div className="wishlist-image-container">
                <img src={product.image} alt={product.name} className='wishlist-imggg' />

                {product.discount > 0 && (
                    <span className="wishlist-discount-badge">-{product.discount}%</span>
                )}
                {product.isNew && (
                    <span className="wishlist-new-badge">NEW</span>
                )}

                <div className="wishlist-card-icons">
                    {variant === 'wishlist' ? (
                        <div className="wishlist-icon-btn" onClick={handleRemove}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 6C19 6 18.25 19.3333 18.068 20.3016C17.9158 21.1105 17.2007 21.6667 16.3789 21.6667H7.62106C6.79934 21.6667 6.08419 21.1105 5.932 20.3016C5.75 19.3333 5 6 5 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.5 10.5V17" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.5 10V17.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.5 10.5V17" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.5 6H20.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.5 6C8.5 6 9 3 12 3C15 3 15.5 6 15.5 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    ) : (
                        <div className="wishlist-icon-btn" onClick={handleCardClick}>
                            <img src={viewmore} alt="Quick view" />
                        </div>
                    )}
                </div>

                <button className="wishlist-add-btn" onClick={handleAddToCart}>
                    <img src={cartIcon} alt="" style={{ width: '20px', height: '20px', filter: 'invert(1)' }} /> Add To Cart
                </button>
            </div>

            <div className="wishlist-card-content">
                <h3 className="wishlist-product-name">{product.name}</h3>

                <div className='wishlist-price-row'>
                    <p className="wishlist-product-price">${product.price?.toFixed(0)}</p>
                    {product.before_price && (
                        <p className="wishlist-product-before-price">${product.before_price?.toFixed(0)}</p>
                    )}
                </div>

                {variant !== 'wishlist' && product.rating && (
                    <div className="wishlist-rating">
                        {renderStars(product.rating)}
                        <span className="wishlist-rating-count">({product.reviewCount || 65})</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WishlistItemCard;
