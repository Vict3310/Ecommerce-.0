import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

function CartDrawer(props) {
  const navigate = useNavigate();
  let total = 0;
  for (let i = 0; i < props.cartItems.length; i++) {
    const item = props.cartItems[i];
    const qty = item.quantity || 1;
    total = total + (item.price * qty);
  }

  return (
    <div>
      <div 
        className={"cart-overlay " + (props.isOpen ? 'active' : '')} 
        onClick={props.onClose}
      ></div>
      
      <div className={"cart-drawer " + (props.isOpen ? 'open' : '')}>
        
        <div className="cart-drawer-header">
          <h2>Shopping Cart</h2>
          <button onClick={props.onClose} className="close-btn">X</button>
        </div>
        
        <div className="cart-drawer-body">
          {props.cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            props.cartItems.map(function(item) {
              const qty = item.quantity || 1;
              const subtotal = item.price * qty;
              
              return (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price} x {qty}</p>
                    <p className="item-total">Subtotal: ${subtotal.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={function() { props.onRemove(item.id); }} 
                    className="remove-btn"
                  >
                    X
                  </button>
                </div>
              );
            })
          )}
        </div>
        
        {props.cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button 
              className="checkout-btn"
              onClick={() => {
                props.onClose();
                navigate('/checkout');
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
