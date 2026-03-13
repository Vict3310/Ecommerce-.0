import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import Footer from '../components/Footer';
import './Cart.css';

function Cart({ cartItems, onRemove, onUpdateQuantity, onClearCart }) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // free shipping
  const total = subtotal + shipping;

  const handleApplyCoupon = () => {
    if (coupon.trim()) {
      setCouponApplied(true);
      alert(`Coupon "${coupon}" applied! (demo only)`);
    }
  };

  const handleQtyChange = (id, delta) => {
    if (onUpdateQuantity) onUpdateQuantity(id, delta);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-empty">
        <nav className="cart-breadcrumb">
          <Link to="/">Home</Link> / <span>Cart</span>
        </nav>
        <div className="cart-empty-body">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="cart-return-btn">Return To Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page font-poppins">
      {/* Breadcrumb */}
      <nav className="cart-breadcrumb">
        <Link to="/">Home</Link> / <span>Cart</span>
      </nav>

      {/* Table */}
      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id} className="cart-row">
                <td className="cart-product-cell">
                  <button
                    className="cart-remove-x"
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove"
                  >✕</button>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <span className="cart-item-name">{item.name}</span>
                </td>
                <td className="cart-price" data-label="Price">{formatPrice(item.price)}</td>
                <td className="cart-qty-cell" data-label="Quantity">
                  <div className="cart-qty-input">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                      readOnly
                    />
                    <div className="cart-qty-arrows">
                      <button onClick={() => handleQtyChange(item.id, 1)}>▲</button>
                      <button onClick={() => handleQtyChange(item.id, -1)}>▼</button>
                    </div>
                  </div>
                </td>
                <td className="cart-subtotal" data-label="Subtotal">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons row */}
      <div className="cart-actions">
        <Link to="/products" className="cart-return-btn">Return To Shop</Link>
        <button className="cart-update-btn" onClick={() => {}}>Update Cart</button>
      </div>

      {/* Bottom section: coupon + summary */}
      <div className="cart-bottom">
        <div className="cart-coupon">
          <input
            type="text"
            placeholder="Coupon Code"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
          />
          <button onClick={handleApplyCoupon}>Apply Coupon</button>
        </div>

        <div className="cart-total-box">
          <h3>Cart Total</h3>
          <div className="cart-total-row">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-total-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="cart-total-row cart-total-final">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            className="cart-checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Process to checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
