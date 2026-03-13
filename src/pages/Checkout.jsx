import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import './Checkout.css';

const Checkout = ({ cartItems, onClearCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);

  // Enforce login for checkout as per Security Architect requirements
  React.useEffect(() => {
    if (!user) {
      alert("Please login to proceed to checkout.");
      navigate('/login?redirect=checkout');
    }
  }, [user, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [formData, setFormData] = useState({
    firstName: '',
    companyName: '',
    address: '',
    apartment: '',
    city: '',
    phone: '',
    email: user?.email || '',
    saveInfo: false
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; 
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setDiscount(data.amount);
        alert(`Coupon applied: ${data.amount}% off!`);
      } else {
        alert("Invalid or expired coupon code.");
        setDiscount(0);
      }
    } catch (err) {
      console.error("Coupon error:", err);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const generateInvoice = (order, items) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('EXCLUSIVE STORE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Customer: ${formData.firstName}`, 20, 50);
    doc.text(`Email: ${formData.email}`, 20, 55);
    doc.text(`Address: ${formData.address}, ${formData.city}`, 20, 60);

    // Table
    const tableData = items.map(item => {
      const cartItem = cartItems.find(c => c.id === item.product_id);
      return [
        cartItem ? cartItem.name : 'Unknown Product',
        item.quantity,
        formatPrice(item.price_at_time),
        formatPrice(item.price_at_time * item.quantity)
      ];
    });

    doc.autoTable({
      startY: 70,
      head: [['Product', 'Quantity', 'Price', 'Subtotal']],
      body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${formatPrice(subtotal)}`, 150, finalY);
    if (discount > 0) {
      doc.text(`Discount (${discount}%): -${formatPrice(discountAmount)}`, 150, finalY + 5);
    }
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${formatPrice(total)}`, 150, finalY + 12);

    doc.save(`invoice_${order.id.slice(0, 8)}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");
    
    setLoading(true);
    try {
      // 1. Create Order with initial 0 amount (Trigger will calculate)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          status: 'pending',
          total_amount: 0, 
          shipping_address: `${formData.address}, ${formData.apartment}, ${formData.city}`,
          contact_email: formData.email,
          contact_phone: formData.phone,
          payment_method: paymentMethod
        }])
        .select().single();

      if (orderError) throw orderError;

      // 2. Add Items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Payment Flow
      if (paymentMethod === 'bank') {
        const paymentSuccess = window.confirm(`Proceed to pay ${formatPrice(total)} with Paystack?`);
        if (!paymentSuccess) {
          await supabase.from('orders').update({ status: 'failed' }).eq('id', order.id);
          setLoading(false);
          return;
        }
      }

      await supabase.from('orders').update({ status: 'processing' }).eq('id', order.id);
      
      // 4. Generate PDF Invoice
      generateInvoice(order, orderItems);

      if (onClearCart) onClearCart();
      alert("Order placed successfully! Your invoice is downloading.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Error processing order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-empty" style={{textAlign: 'center', padding: '100px'}}>
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products" className="apply-coupon-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Breadcrumb */}
        <div className="checkout-breadcrumb">
           Account / My Account / Product / View Cart / <span>CheckOut</span>
        </div>

        <h1 className="checkout-title">Billing Details</h1>

        <div className="checkout-grid">
          {/* Left: Billing Form */}
          <div className="billing-form-wrapper">
            <form id="checkout-form" onSubmit={handleSubmit} className="billing-form">
              <div className="form-group">
                <label>First Name<span>*</span></label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Street Address<span>*</span></label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Apartment, floor, etc. (optional)</label>
                <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Town/City<span>*</span></label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone Number<span>*</span></label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email Address<span>*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="save-info-checkbox">
                <input 
                  type="checkbox" 
                  name="saveInfo" 
                  id="saveInfo" 
                  checked={formData.saveInfo} 
                  onChange={handleChange}
                />
                <label htmlFor="saveInfo">Save this information for faster check-out next time</label>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary">
            <div className="summary-item-list">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-info">
                    <img src={item.image} alt={item.name} />
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="total-row" style={{color: '#DB4444'}}>
                  <span>Discount ({discount}%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="total-row border-top" style={{marginTop: '16px', paddingTop: '16px'}}>
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row total-final">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <div className="payment-option-row">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank" 
                    checked={paymentMethod === 'bank'} 
                    onChange={() => setPaymentMethod('bank')}
                  />
                  <span>Bank</span>
                </label>
                <div className="payment-logos">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                </div>
              </div>

              <div className="payment-option-row">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span>Cash on delivery</span>
                </label>
              </div>
            </div>

            {/* Coupon */}
            <div className="coupon-section">
              <div className="coupon-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Coupon Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
              </div>
              <button 
                type="button"
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon}
                className="apply-coupon-btn"
              >
                Apply Coupon
              </button>
            </div>

            {/* Place Order Button */}
            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="place-order-btn"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
