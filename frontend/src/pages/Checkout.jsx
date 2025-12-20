import React, { useState, useEffect } from 'react';
import { getCart, createOrder, fetchOrders } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    mobile: '',
    email: '',
    paymentMethod: 'card', // cash, card, paypal
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if(isReturning) {
      fetchOrders().then(orders => {
        // Extract unique addresses
        const unique = [];
        const map = new Map();
        if(orders && orders.length > 0) {
            orders.forEach(o => {
                if(o.address && !map.has(o.address)) {
                    map.set(o.address, true);
                    unique.push(o.address);
                }
            });
        }
        setSavedAddresses(unique);
      }).catch(err => console.error("Failed to fetch orders for addresses", err));
    }
  }, [isReturning]);

  useEffect(() => {
    getCart().then(setCart).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if(errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    let newErrors = {};
    if(!formData.firstName) newErrors.firstName = "First Name is required";
    if(!formData.lastName) newErrors.lastName = "Last Name is required";
    if(!formData.address) newErrors.address = "Address is required";
    if(!formData.city) newErrors.city = "City is required";
    if(!formData.zip) newErrors.zip = "Zip Code is required";
    if(!formData.mobile) newErrors.mobile = "Mobile is required";
    if(!formData.email) newErrors.email = "Email is required";
    
    // Payment validation (only if Card is selected)
    if(formData.paymentMethod === 'card') {
      if(!formData.cardHolder) newErrors.cardHolder = "Name is required";
      if(!formData.cardNumber) newErrors.cardNumber = "Card Number is required";
      if(!formData.expiry) newErrors.expiry = "Expiry is required";
      if(!formData.cvc) newErrors.cvc = "CVC is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if(!validate()) return;
    
    // Combine address fields for the simplistic backend text field
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.zip} (Mobile: ${formData.mobile})`;
    
    try {
      await createOrder(cart.id, fullAddress);
      alert("Order placed successfully! Redirecting to Orders...");
      navigate('/orders');
    } catch(e) {
      console.error(e);
      alert("Failed to place order. Please try again.");
    }
  };

  if(loading) return <div className="container" style={{marginTop:40}}>Loading...</div>;
  if(!cart || cart.items.length === 0) return <div className="container" style={{marginTop:40}}>Cart is empty</div>;

  // Mock first item for "Review Item" box as per image (showing just one or all)
  const item = cart && cart.items.length > 0 ? cart.items[0] : null;

  const handleSaveInfo = () => {
    // Validate only delivery fields
    let deliveryErrors = {};
    if(!formData.firstName) deliveryErrors.firstName = "Required";
    if(!formData.lastName) deliveryErrors.lastName = "Required";
    if(!formData.address) deliveryErrors.address = "Required";
    if(!formData.city) deliveryErrors.city = "Required";
    if(!formData.zip) deliveryErrors.zip = "Required";
    if(!formData.mobile) deliveryErrors.mobile = "Required";
    if(!formData.email) deliveryErrors.email = "Required";

    if(Object.keys(deliveryErrors).length > 0) {
      setErrors(deliveryErrors);
      alert("Please fill all delivery fields.");
      return;
    }
    
    // Success flow
    setErrors({});
    alert("Delivery information saved temporarily!");
  };

  const handleApplyCoupon = () => {
    if(!couponCode.trim()) {
       alert("Please enter a coupon code");
       return;
    }
    if(couponCode.toUpperCase() === "SHOPCART20") {
       alert("Coupon Applied! You saved 20%.");
       // In a real app, update cart total state here
    } else {
       alert("Invalid Coupon Code");
    }
  };




  const handleAddressSelect = (fullAddrString) => {
    // Try to parse using the format we save: "Address, City, Zip (Mobile: ...)"
    // Regex: (.*), (.*), (.*) \(Mobile: (.*)\)
    const regex = /^(.*), (.*), (.*) \(Mobile: (.*)\)$/;
    const match = fullAddrString.match(regex);
    
    if(match) {
        setFormData({
            ...formData,
            address: match[1],
            city: match[2],
            zip: match[3],
            mobile: match[4]
        });
        alert("Address Auto-filled!");
    } else {
        // Fallback: just put it all in address
        setFormData({
            ...formData,
            address: fullAddrString
        });
        alert("Address partially filled. Please check details.");
    }
    setErrors({});
  };

  return (
    <div className="container checkout-page">
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link> / <span>Checkout</span>
      </div>

      <div className="checkout-grid">
        
        {/* LEFT COLUMN */}
        <div>
          {/* Review Item Box */}
          <div className="checkout-card">
            <div className="checkout-section-title">Review Item And Shipping</div>
            {/* Just showing first item as representative, or map all */}
            {cart.items.map(it => (
                <div key={it.id} className="review-item" style={{marginBottom:16}}>
                    <div className="review-img-box">
                        <img src={it.product.image_url} alt={it.product.name} />
                    </div>
                    <div className="review-info">
                        <h3>{it.product.name}</h3>
                        <p className="review-meta">Quantity: {it.quantity}</p>
                    </div>
                    <div className="review-price">${Math.floor(it.product.price)}</div>
                </div>
            ))}
          </div>

          <div className="returning-customer">
             <input 
                type="checkbox" 
                id="ret-cust" 
                checked={isReturning}
                onChange={(e) => setIsReturning(e.target.checked)}
             />
             <label htmlFor="ret-cust">Returning Customer? (Select Saved Address)</label>
          </div>

          {isReturning && (
            <div className="checkout-card" style={{background:'#f0fdf4', borderColor:'#bbf7d0'}}>
               <h4 style={{margin:'0 0 10px 0', color:'#111827'}}>Select a Saved Address (from past orders):</h4>
               {savedAddresses.length === 0 && <p style={{fontSize:13, color:'#666'}}>No past orders found.</p>}
               {savedAddresses.map((addr, idx) => (
                 <div 
                    key={idx} 
                    style={{padding:10, borderBottom:'1px solid #ddd', cursor:'pointer'}}
                    onClick={() => handleAddressSelect(addr)}
                 >
                    {addr}
                 </div>
               ))}
            </div>
          )}

          {/* Delivery Info Form */}
          <div className="checkout-card">
             <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <h3 className="checkout-section-title" style={{marginBottom:0}}>Delivery Information</h3>
                <button className="btn-save-info" onClick={handleSaveInfo}>Save Information</button>
             </div>

             <div className="form-row">
                <div className="form-group">
                   <label>First Name*</label>
                   <input type="text" name="firstName" value={formData.firstName} placeholder="Type here..." className={errors.firstName ? 'error' : ''} onChange={handleChange} />
                   {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                   <label>Last Name*</label>
                   <input type="text" name="lastName" value={formData.lastName} placeholder="Type here..." className={errors.lastName ? 'error' : ''} onChange={handleChange} />
                   {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
                </div>
             </div>

             <div className="form-group" style={{marginBottom:20}}>
                <label>Address*</label>
                <input type="text" name="address" value={formData.address} placeholder="Type here..." className={errors.address ? 'error' : ''} onChange={handleChange} />
                {errors.address && <span className="error-msg">{errors.address}</span>}
             </div>

             <div className="form-row">
                <div className="form-group">
                   <label>City/ Town*</label>
                   <input type="text" name="city" value={formData.city} placeholder="Type here..." className={errors.city ? 'error' : ''} onChange={handleChange} />
                   {errors.city && <span className="error-msg">{errors.city}</span>}
                </div>
                <div className="form-group">
                   <label>Zip Code*</label>
                   <input type="text" name="zip" value={formData.zip} placeholder="Type here..." className={errors.zip ? 'error' : ''} onChange={handleChange} />
                   {errors.zip && <span className="error-msg">{errors.zip}</span>}
                </div>
             </div>

             <div className="form-row">
                <div className="form-group">
                   <label>Mobile*</label>
                   <input type="text" name="mobile" value={formData.mobile} placeholder="Type here..." className={errors.mobile ? 'error' : ''} onChange={handleChange} />
                   {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
                </div>
                <div className="form-group">
                   <label>Email*</label>
                   <input type="email" name="email" value={formData.email} placeholder="Type here..." className={errors.email ? 'error' : ''} onChange={handleChange} />
                   {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="checkout-summary">
           <h3 className="checkout-section-title">Order Summary</h3>
           
           <div className="coupon-box">
              <input 
                type="text" 
                placeholder="Enter Coupon Code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="btn-apply" onClick={handleApplyCoupon}>Apply coupon</button>
           </div>
           
           <h3 className="checkout-section-title" style={{fontSize:18}}>Payment Details</h3>
           
           <div className="payment-methods">
              <div 
                  className={`payment-option ${formData.paymentMethod==='cash'?'selected':''}`} 
                  onClick={()=>setFormData({...formData, paymentMethod:'cash'})}
              >
                 <div className="radio-custom"></div> Cash on Delivery
              </div>
              <div 
                  className={`payment-option ${formData.paymentMethod==='card'?'selected':''}`}
                  onClick={()=>setFormData({...formData, paymentMethod:'card'})}
              >
                 <div className="radio-custom"></div> Credit or Debit card
              </div>
              {/* Card Icons */}
              {formData.paymentMethod === 'card' && (
                  <div className="payment-icons">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" className="card-icon" alt="mastercard"/>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="card-icon" alt="visa"/>
                  </div>
              )}
              
              <div 
                  className={`payment-option ${formData.paymentMethod==='paypal'?'selected':''}`}
                  onClick={()=>setFormData({...formData, paymentMethod:'paypal'})}
              >
                 <div className="radio-custom"></div> Paypal
              </div>
           </div>

           {/* Card Form - Only show if Card selected */}
           {formData.paymentMethod === 'card' && (
             <div className="card-form">
                <div className="form-group" style={{marginBottom:16}}>
                   <label>Email*</label>
                   <input type="email" placeholder="Type here..." value={formData.email} readOnly style={{background:'#f3f4f6'}} />
                </div>
                <div className="form-group" style={{marginBottom:16}}>
                   <label>Card Holder Name*</label>
                   <input type="text" name="cardHolder" placeholder="Type here..." className={errors.cardHolder?'error':''} onChange={handleChange} />
                   {errors.cardHolder && <span className="error-msg">{errors.cardHolder}</span>}
                </div>
                <div className="form-group" style={{marginBottom:16}}>
                   <label>Card Number*</label>
                   <div className="card-input-box">
                      <span className="card-icon-overlay">💳</span>
                      <input type="text" name="cardNumber" placeholder="0000******1245" className={errors.cardNumber?'error':''} onChange={handleChange} />
                   </div>
                   {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                </div>
                <div className="form-row">
                    <div className="form-group">
                       <label>Expiry*</label>
                       <input type="text" name="expiry" placeholder="MM/YY" className={errors.expiry?'error':''} onChange={handleChange} />
                       {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                    </div>
                    <div className="form-group">
                       <label>CVC*</label>
                       <input type="text" name="cvc" placeholder="123" className={errors.cvc?'error':''} onChange={handleChange} />
                       {errors.cvc && <span className="error-msg">{errors.cvc}</span>}
                    </div>
                </div>
             </div>
           )}

           <button className="btn-pay-now" onClick={handleSubmit}>
              Pay Now
           </button>

        </div>

      </div>
    </div>
  );
}
