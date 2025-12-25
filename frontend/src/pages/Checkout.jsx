import React, { useState, useEffect } from 'react';
import { getCart, createOrder, fetchOrders, fetchAddresses, fetchProfile, createAddress, validateCoupon } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Checkout.css';
import '../styles/Cart.css'; // Reuse Cart styles for Address Bar & Modal

// Add helper to load script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Address Bar State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
      name: '', street: '', city: '', zip: '', mobile: '', is_default: false
  });
  
  // Payment & User State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [userEmail, setUserEmail] = useState('');


  useEffect(() => {
    async function init() {
        try {
            const [cartData, addrData, profileData] = await Promise.all([
                getCart(),
                fetchAddresses().catch(e => []),
                fetchProfile().catch(e => null)
            ]);
            setCart(cartData);
            setAddresses(addrData || []);
            if(profileData) setUserEmail(profileData.email);

            // Auto-select address
            if(addrData && addrData.length > 0) {
                const def = addrData.find(a => a.is_default);
                setSelectedAddress(def || addrData[0]);
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    init();
  }, []);

  const handleSaveAddress = async (e) => {
      e.preventDefault();
      try {
          // Clean non-digits and take last 10 digits
          const cleanMobile = newAddrForm.mobile.replace(/\D/g, '');
          const finalMobile = cleanMobile.length > 10 ? cleanMobile.slice(-10) : cleanMobile;
          
          const payload = { ...newAddrForm, mobile: finalMobile }; 
          const res = await createAddress(payload);
          
          // Refresh addresses
          const updatedAddrs = await fetchAddresses();
          setAddresses(updatedAddrs);
          
          // Select the new one
          const newAddr = updatedAddrs.find(a => a.id === res.id) || updatedAddrs[updatedAddrs.length-1];
          setSelectedAddress(newAddr);
          
          setIsAddingNew(false);
          setNewAddrForm({name: '', street: '', city: '', zip: '', mobile: '', is_default: false}); // Reset
      } catch(err) {
          console.error(err);
          const errorMsg = err.response?.data?.errors?.join(', ') || "Failed to save address. Please check all fields.";
          alert(errorMsg);
      }
  };

  const [appliedDiscount, setAppliedDiscount] = useState(0); 
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");

  const applyCoupon = async () => {
     if(!couponInput.trim()) return;
     try {
       const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
       const res = await validateCoupon(couponInput, subtotal);
       if(res.valid) {
          setAppliedDiscount(res.discount);
          setCouponCode(res.code);
          alert(`Coupon ${res.code} Applied! You saved ₹${res.discount}`);
       }
     } catch(err) {
       setAppliedDiscount(0);
       setCouponCode("");
       alert(err.response?.data?.error || "Invalid Coupon");
     }
  };

  const removeCoupon = () => {
    setAppliedDiscount(0);
    setCouponCode("");
    setCouponInput("");
  };

  const handleRazorpayPayment = async (fullAddress) => {
      const res = await loadRazorpay();
      if (!res) { alert('Razorpay SDK failed to load. Are you online?'); return; }

      const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      const deliveryFee = 0.0;
      const totalAmount = subtotal - appliedDiscount + deliveryFee;

      try {
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const orderUrl = `${API_BASE}/api/payments/create_order`;
          const orderData = await fetch(orderUrl, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}` 
              },
              body: JSON.stringify({ amount: totalAmount }) 
          }).then((t) => t.json());

          if (orderData.error) { alert(orderData.error); return; }

          const options = {
              key: orderData.key_id,
              amount: orderData.amount,
              currency: orderData.currency,
              name: "ShopNow",
              description: "Order Transaction",
              order_id: orderData.id,
              handler: async function (response) {
                  const verifyUrl = `${API_BASE}/api/payments/verify`;
                  const verifyData = await fetch(verifyUrl, {
                      method: 'POST',
                      headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature
                      })
                  }).then((t) => t.json());

                  if (verifyData.status === 'ok') {
                      await createOrder(cart.id, fullAddress, 'Razorpay', appliedDiscount, couponCode);
                      alert('Payment Successful!');
                      navigate('/orders');
                  } else {
                      alert('Payment Verification Failed');
                  }
              },
              prefill: {
                  name: selectedAddress.name,
                  email: userEmail,
                  contact: selectedAddress.mobile
              },
              theme: { color: "#4f46e5" }
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();

      } catch (err) {
          console.error(err);
          alert("Payment processing error");
      }
  };

  const handleSubmit = async () => {
    if(!selectedAddress) {
        alert("Please select a delivery address.");
        return;
    }
    
    // Construct address string for backend
    const fullAddress = `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip} (Mobile: ${selectedAddress.mobile})`;
    
    // Calculate Totals for passing (if needed)
    const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    
    if (paymentMethod === 'card') {
        await handleRazorpayPayment(fullAddress);
    } else {
        try {
          await createOrder(cart.id, fullAddress, 'Cash on Delivery', appliedDiscount, couponCode);
          alert("Order placed successfully! Redirecting to Orders...");
          navigate('/orders');
        } catch(e) {
          console.error(e);
          alert("Failed to place order. Please try again.");
        }
    }
  };

  if(loading) return <div className="container" style={{marginTop:40}}>Loading...</div>;
  if(!cart || cart.items.length === 0) return <div className="container" style={{marginTop:40}}>Cart is empty</div>;

  const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const deliveryFee = 0.0;
  const total = subtotal - appliedDiscount + deliveryFee;

  return (
    <div className="container checkout-page">
       <h2 className="cart-page-title">Order Summary</h2>

       <div className="checkout-grid">
         {/* LEFT COLUMN */}
         <div>
            {/* 1. Address Bar (Amazon Style) */}
            {selectedAddress ? (
                <div className="cart-address-bar" style={{marginBottom:24, border:'1px solid #e5e7eb'}}>
                <div className="cab-info">
                    <span className="cab-label">Deliver to:</span>
                    <span className="cab-name">{selectedAddress.name}</span>
                    <span className="cab-badge">Home</span>
                    <div className="cab-detail">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.zip}</div>
                </div>
                <button className="cab-change-btn" onClick={() => setShowAddressModal(true)}>Change</button>
                </div>
            ) : (
                <div className="cart-address-bar" style={{marginBottom:24}}>
                <div className="cab-info">Please select a delivery location</div>
                <button className="cab-change-btn" onClick={() => setShowAddressModal(true)}>Select Address</button>
                </div>
            )}

            {/* 2. Review Item Box */}
            <div className="checkout-card">
              <div className="checkout-section-title">Review Item And Shipping</div>
              {cart.items.map(it => (
                 <div key={it.id} className="review-item" style={{marginBottom:16}}>
                     <div className="review-img-box"><img src={it.product.image_url} alt={it.product.name} /></div>
                     <div className="review-info"><h3>{it.product.name}</h3><p className="review-meta">Quantity: {it.quantity}</p></div>
                     <div className="review-price">₹{Number(it.product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                 </div>
              ))}
            </div>
         </div>

         {/* RIGHT COLUMN */}
         <div className="checkout-summary">
             <h3 className="checkout-section-title">Price Details</h3>
             <div className="checkout-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
             
             {/* COUPON SECTION */}
             <div className="coupon-section" style={{margin:'16px 0', padding:'12px', background:'#f9fafb', borderRadius:8}}>
                {!couponCode ? (
                    <div style={{display:'flex', gap:10}}>
                        <input 
                          type="text" 
                          placeholder="Enter Coupon Code" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          style={{flex:1, padding:'8px 12px', borderRadius:4, border:'1px solid #d1d5db'}}
                        />
                        <button onClick={applyCoupon} style={{background:'#2563eb', color:'white', border:'none', borderRadius:4, padding:'0 16px', cursor:'pointer'}}>Apply</button>
                    </div>
                ) : (
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', color:'#166534', fontWeight:500}}>
                        <span>Coupon Applied: {couponCode}</span>
                        <button onClick={removeCoupon} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:13}}>Remove</button>
                    </div>
                )}
             </div>

             <div className="checkout-row" style={{color:'#16a34a'}}><span>Discount</span><span>-₹{appliedDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
             <div className="checkout-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
             <div className="checkout-row total"><span>Total</span><span>₹{Math.max(0, total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>

             <h3 className="checkout-section-title" style={{marginTop:24}}>Complete Payment</h3>
             <div className="payment-methods">
               <div className={`payment-option ${paymentMethod==='cash'?'selected':''}`} onClick={()=>setPaymentMethod('cash')}>
                  <div className="radio-custom"></div> Cash on Delivery
               </div>
               <div className={`payment-option ${paymentMethod==='card'?'selected':''}`} onClick={()=>setPaymentMethod('card')}>
                  <div className="radio-custom"></div> Razorpay (UPI/Card/Netbanking)
               </div>
             </div>

             <button className="btn-pay-now" onClick={handleSubmit}>
                {paymentMethod === 'card' ? 'Proceed to Pay' : 'Place Order'}
             </button>
         </div>
       </div>

       {/* Address Selection Modal (Reused) */}
       {showAddressModal && (
        <div className="modal-overlay">
           <div className="modal-content address-modal">
              <div className="modal-header">
                <h3>{isAddingNew ? "Add New Address" : "Choose a delivery address"}</h3>
                <button className="close-btn" onClick={() => { setShowAddressModal(false); setIsAddingNew(false); }}>&times;</button>
              </div>
              <div className="modal-body">
                 {!isAddingNew ? (
                     <>
                        {addresses.length === 0 && <div className="no-addr">No addresses found.</div>}
                        
                        <div className="addr-list">
                            {addresses.map(addr => (
                              <div key={addr.id} 
                                   className={`addr-option ${selectedAddress && selectedAddress.id === addr.id ? 'selected' : ''}`}
                                   onClick={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                              >
                                 <div className="addr-radio">
                                    <div className="radio-circle"></div>
                                 </div>
                                 <div className="addr-details">
                                    <div className="addr-name">{addr.name} {addr.mobile}</div>
                                    <div className="addr-text">{addr.street}, {addr.city}, {addr.zip}</div>
                                    {addr.is_default && <span className="def-badge">Default</span>}
                                 </div>
                              </div>
                            ))}
                        </div>
                        
                        <div className="add-new-addr-link">
                             <div className="add-addr-btn" onClick={() => setIsAddingNew(true)}>
                                <span style={{fontSize:20, marginRight:8}}>+</span> Add a new address
                             </div>
                        </div>
                     </>
                 ) : (
                     <form className="new-addr-form" onSubmit={handleSaveAddress}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input value={newAddrForm.name} onChange={e=>setNewAddrForm({...newAddrForm, name:e.target.value})} required placeholder="John Doe" />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input value={newAddrForm.mobile} onChange={e=>setNewAddrForm({...newAddrForm, mobile:e.target.value})} required placeholder="10-digit mobile" />
                        </div>
                        <div className="form-group">
                            <label>Address (Area and Street)</label>
                            <input value={newAddrForm.street} onChange={e=>setNewAddrForm({...newAddrForm, street:e.target.value})} required placeholder="Flat/House No, Street, Landmark" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input value={newAddrForm.city} onChange={e=>setNewAddrForm({...newAddrForm, city:e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input value={newAddrForm.zip} onChange={e=>setNewAddrForm({...newAddrForm, zip:e.target.value})} required />
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={()=>setIsAddingNew(false)}>Cancel</button>
                            <button type="submit" className="btn-save">Save & Use</button>
                        </div>
                     </form>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
