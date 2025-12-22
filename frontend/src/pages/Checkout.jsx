import React, { useState, useEffect } from 'react';
import { getCart, createOrder, fetchOrders, fetchAddresses, fetchProfile } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Checkout.css';

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
  });

  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [readOnlyMode, setReadOnlyMode] = useState(false); // New state to lock form

  useEffect(() => {
    if(isReturning) {
       // Fetch both explicit Saved Addresses and previous Orders
       Promise.all([fetchAddresses().catch(e=>[]), fetchOrders().catch(e=>[])]).then(([addresses, orders]) => {
           const candidates = [];

           // 1. From Saved Addresses (Structured)
           if(addresses) {
               addresses.forEach(a => {
                   candidates.push({
                       type: 'saved',
                       name: a.name || '',
                       street: a.street,
                       city: a.city,
                       zip: a.zip,
                       mobile: a.mobile
                   });
               });
           }

           // 2. From Orders (Unstructured/String) - Fallback
           // We only add if we don't have a similar structured address
           if(orders) {
               const addressSet = new Set(candidates.map(c => c.street.toLowerCase())); // Simple duplicate check
               orders.forEach(o => {
                   if(o.address && !addressSet.has(o.address.toLowerCase().split(',')[0].trim())) { // Very rough check
                       // Try to parse string
                       let addr = { type: 'order', fullString: o.address, street: o.address };
                       // ... parsing logic here if needed, but better to just treat as Blob
                       
                       // Check duplicates by full string
                       if(!candidates.some(c => c.type === 'order' && c.fullString === o.address)) {
                            // Parse order string into components
                            try {
                                const mobileMatch = o.address.match(/\(Mobile: (\d+)\)$/);
                                const mobile = mobileMatch ? mobileMatch[1] : '';
                                let remaining = o.address.replace(/\(Mobile: .*\)$/, '').trim();
                                if(remaining.endsWith(',')) remaining = remaining.slice(0, -1);
                                const parts = remaining.split(',').map(s => s.trim());
                                const zip = parts.length > 1 ? parts.pop() : '';
                                const city = parts.length > 1 ? parts.pop() : '';
                                const street = parts.join(', ');
                                
                                candidates.push({
                                    type: 'order',
                                    fullString: o.address,
                                    name: '', // Orders don't store name in address string usually
                                    street: street,
                                    city: city,
                                    zip: zip,
                                    mobile: mobile
                                });
                            } catch(e) {
                                candidates.push({ type: 'order', fullString: o.address, street: o.address, name:'', city:'', zip:'', mobile:'' });
                            }
                       }
                   }
               });
           }
           
           // Filter Exact Duplicates
           const unique = [];
           const seen = new Set();
           candidates.forEach(c => {
               const key = `${c.street}|${c.city}|${c.zip}`.toLowerCase();
               if(!seen.has(key)) {
                   seen.add(key);
                   unique.push(c);
               }
           });

           setSavedAddresses(unique);
       });
       
       // Also fetch profile to pre-fill email/name if missing
       fetchProfile().then(user => {
           if(user) {
               setFormData(prev => ({
                   ...prev,
                   email: user.email || prev.email,
                   firstName: prev.firstName || (user.name ? user.name.split(' ')[0] : ''),
                   lastName: prev.lastName || (user.name && user.name.includes(' ') ? user.name.split(' ').slice(1).join(' ') : ''),
                   mobile: prev.mobile || user.mobile || ''
               }));
           }
       }).catch(e => console.log('No profile'));
    }
  }, [isReturning]);

  useEffect(() => {
    getCart().then(setCart).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    let newErrors = {};
    if(!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if(!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if(!formData.address.trim()) newErrors.address = "Address is required";
    if(!formData.city.trim()) newErrors.city = "City is required";
    if(!formData.zip.trim()) newErrors.zip = "Zip Code is required";
    
    // Mobile Validation (10 digits)
    if(!formData.mobile) {
        newErrors.mobile = "Mobile is required";
    } else if(!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Mobile must be exactly 10 digits";
    }

    if(!formData.email.trim()) newErrors.email = "Email is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSelect = (addr) => {
    setFormData(prev => {
        // Parse name if present
        let fName = prev.firstName;
        let lName = prev.lastName;
        if(addr.name) {
            const parts = addr.name.split(' ');
            if (parts.length > 0) fName = parts[0];
            if (parts.length > 1) lName = parts.slice(1).join(' ');
        }

        return {
            ...prev,
            address: addr.street || addr.fullString || prev.address,
            city: addr.city || prev.city,
            zip: addr.zip || prev.zip,
            mobile: addr.mobile || prev.mobile,
            firstName: fName,
            lastName: lName
        };
    });
    setReadOnlyMode(true);
  };

  const handleEditAddress = () => {
      setReadOnlyMode(false);
  };

  const handleRazorpayPayment = async (fullAddress) => { /* ... existing ... */ 
      const res = await loadRazorpay();
      if (!res) { alert('Razorpay SDK failed to load. Are you online?'); return; }

      // Use calculated amounts!
      const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      const discount = Math.floor(subtotal * 0.10); 
      const deliveryFee = 0.0;
      const totalAmount = subtotal - discount + deliveryFee;

      try {
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const orderUrl = `${API_BASE}/api/payments/create_order`;
          const orderData = await fetch(orderUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: totalAmount }) // Use corrected total
          }).then((t) => t.json());

          if (orderData.error) { alert(orderData.error); return; }

          const options = {
              key: orderData.key_id,
              amount: orderData.amount,
              currency: orderData.currency,
              name: "ShopNow",
              description: "Test Transaction",
              order_id: orderData.id,
              handler: async function (response) {
                  const verifyUrl = `${API_BASE}/api/payments/verify`;
                  const verifyData = await fetch(verifyUrl, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature
                      })
                  }).then((t) => t.json());

                  if (verifyData.status === 'ok') {
                      await createOrder(cart.id, fullAddress);
                      alert('Payment Successful!');
                      navigate('/orders');
                  } else {
                      alert('Payment Verification Failed');
                  }
              },
              prefill: {
                  name: `${formData.firstName} ${formData.lastName}`,
                  email: formData.email,
                  contact: formData.mobile
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
    if(!validate()) return;
    
    // Construct address string again for Order model (since it uses string)
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.zip} (Mobile: ${formData.mobile})`;
    
    // Should we also SAVE this address to profile if it's new? 
    // For now we just place order.
    
    if (formData.paymentMethod === 'card') {
        await handleRazorpayPayment(fullAddress);
    } else {
        try {
          await createOrder(cart.id, fullAddress);
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

  // Recalculate Totals (Client Side mirroring Cart)
  const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const discount = Math.floor(subtotal * 0.10); 
  const deliveryFee = 0.0;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="container checkout-page">
       <div className="cart-breadcrumb"><Link to="/">Home</Link> / <span>Checkout</span></div>

       <div className="checkout-grid">
         {/* LEFT COLUMN */}
         <div>
            {/* Review Item Box */}
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

            <div className="returning-customer">
               <input type="checkbox" id="ret-cust" checked={isReturning} onChange={(e) => setIsReturning(e.target.checked)} />
               <label htmlFor="ret-cust">Returning Customer? (Select Saved Address)</label>
            </div>
            
            {isReturning && (
               <div className="checkout-card" style={{background:'#f0fdf4', borderColor:'#bbf7d0', padding: 0, overflow: 'hidden'}}>
                  {savedAddresses.length === 0 && <div style={{padding:20}}>No saved addresses found.</div>}
                  {savedAddresses.map((addr, idx) => (
                    <div key={idx} className="saved-addr-row" onClick={() => handleAddressSelect(addr)}>
                        <div className="saved-addr-text">
                           {addr.name && <div style={{fontWeight:600}}>{addr.name}</div>}
                           <div>{addr.street} {addr.city} {addr.zip}</div>
                           {addr.mobile && <div style={{fontSize:12, color:'#6b7280'}}>Mobile: {addr.mobile}</div>}
                        </div>
                        <span style={{fontSize:12, color:'#4f46e5', fontWeight:600, whiteSpace:'nowrap'}}>Use This</span>
                    </div>
                  ))}
               </div>
            )}

            {/* Delivery Form */}
             <div className="checkout-card">
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
                   <h3 className="checkout-section-title" style={{margin:0}}>Delivery Information</h3>
                   {readOnlyMode && (
                       <button onClick={handleEditAddress} style={{background:'none', border:'none', color:'#4f46e5', textDecoration:'underline', cursor:'pointer'}}>
                           Edit Address
                       </button>
                   )}
               </div>
               
               <div className="form-row">
                 <div className="form-group"><label>First Name*</label><input name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName?'error':''} disabled={readOnlyMode} />{errors.firstName && <span className="error-text">{errors.firstName}</span>}</div>
                 <div className="form-group"><label>Last Name*</label><input name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName?'error':''} disabled={readOnlyMode} />{errors.lastName && <span className="error-text">{errors.lastName}</span>}</div>
               </div>
               <div className="form-group"><label>Address*</label><input name="address" value={formData.address} onChange={handleChange} className={errors.address?'error':''} disabled={readOnlyMode} />{errors.address && <span className="error-text">{errors.address}</span>}</div>
               <div className="form-row">
                   <div className="form-group"><label>City*</label><input name="city" value={formData.city} onChange={handleChange} className={errors.city?'error':''} disabled={readOnlyMode} />{errors.city && <span className="error-text">{errors.city}</span>}</div>
                   <div className="form-group"><label>Zip*</label><input name="zip" value={formData.zip} onChange={handleChange} className={errors.zip?'error':''} disabled={readOnlyMode} />{errors.zip && <span className="error-text">{errors.zip}</span>}</div>
               </div>
               <div className="form-row">
                  <div className="form-group"><label>Mobile* (10 digits)</label><input name="mobile" value={formData.mobile} onChange={handleChange} className={errors.mobile?'error':''} disabled={readOnlyMode} placeholder="e.g. 9876543210" maxLength={10} />{errors.mobile && <span className="error-text">{errors.mobile}</span>}</div>
                  <div className="form-group"><label>Email*</label><input name="email" value={formData.email} onChange={handleChange} className={errors.email?'error':''} disabled={readOnlyMode} />{errors.email && <span className="error-text">{errors.email}</span>}</div>
               </div>
             </div>
         </div>

         {/* RIGHT COLUMN */}
         <div className="checkout-summary">
             <h3 className="checkout-section-title">Order Summary</h3>
             <div className="checkout-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
             <div className="checkout-row" style={{color:'#ef4444'}}><span>Discount (10%)</span><span>-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
             <div className="checkout-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
             <div className="checkout-row total"><span>Total</span><span>₹{Math.max(0, total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>

             <h3 className="checkout-section-title" style={{marginTop:24}}>Payment Details</h3>
             <div className="payment-methods">
               <div className={`payment-option ${formData.paymentMethod==='cash'?'selected':''}`} onClick={()=>setFormData({...formData, paymentMethod:'cash'})}>
                  <div className="radio-custom"></div> Cash on Delivery
               </div>
               <div className={`payment-option ${formData.paymentMethod==='card'?'selected':''}`} onClick={()=>setFormData({...formData, paymentMethod:'card'})}>
                  <div className="radio-custom"></div> Razorpay (UPI/Card/Netbanking)
               </div>
             </div>

             <button className="btn-pay-now" onClick={handleSubmit}>
                {formData.paymentMethod === 'card' ? 'Proceed to Pay' : 'Place Order'}
             </button>
         </div>
       </div>
    </div>
  );
}
