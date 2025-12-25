import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, createOrder, fetchAddresses, createAddress, fetchWishlist, addToCart, removeFromWishlist } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Cart.css";


export default function Cart(){
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
      name: '', street: '', city: '', zip: '', mobile: '', is_default: false
  });
  
  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const navigate = useNavigate();

  async function load(){
    setLoading(true);
    try {
      const [cartData, addrData] = await Promise.all([
        getCart(),
        fetchAddresses().catch(e => [])
      ]);
      setCart(cartData);
      setAddresses(addrData || []);
      
      // Auto-select default or first address if not selected
      if(addrData && addrData.length > 0 && !selectedAddress) {
        const def = addrData.find(a => a.is_default);
        setSelectedAddress(def || addrData[0]);
      }
    } catch(e){
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Load wishlist separately (don't block cart load)
  useEffect(() => {
     if(localStorage.getItem('token')) {
         setWishlistLoading(true);
         fetchWishlist()
            .then(data => setWishlistItems(data))
            .catch(e => console.error(e))
            .finally(() => setWishlistLoading(false));
     }
  }, []);

  useEffect(() => { load(); }, []);

  async function changeQty(itemId, newQty){
    if (newQty < 1) return;
    await updateCartItem(itemId, newQty);
    const updatedCart = await getCart(); // lighter refresh
    setCart(updatedCart);
  }

  async function remove(itemId){
    await removeCartItem(itemId);
    const updatedCart = await getCart();
    setCart(updatedCart);
  }

  async function handleCheckout(){
    if(!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate('/checkout');
  }
  
  // Move from Wishlist to Cart
  async function moveFromWishlist(product) {
      try {
          await addToCart(product.id, 1);
          // Standard pattern: keep in wishlist or remove? 
          // "Move to Cart" implies remove from wishlist.
          // But usually we just add. Let's just Add.
          // If we want to remove:
          // if (product.wishlist_item_id) await removeFromWishlist(product.wishlist_item_id);
          
          alert("Added to cart!");
          load(); // Refresh cart
      } catch (e) {
          console.error(e);
          alert("Failed to add to cart");
      }
  }

  const handleSaveAddress = async (e) => {
      e.preventDefault();
      try {
          // Clean non-digits and take last 10 digits (handles +91 or 0 prefixes)
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

  if(loading) return <div className="container" style={{paddingTop:40}}>Loading...</div>;

  // Calculate Subtotal from items
  const subtotal = cart?.items ? cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0) : 0;
  const deliveryFee = 0.0;
  const total = subtotal + deliveryFee;

  return (
    <div className="container cart-page">
      <h2 className="cart-page-title">Shopping Cart</h2>
      
      {(!cart || !cart.items || cart.items.length === 0) ? (
          <div style={{textAlign:'center', padding:40, background:'white', borderRadius:8}}>
              <h2>Your Cart is Empty</h2>
              <Link to="/" className="button" style={{marginTop:20, display:'inline-block'}}>Go Shopping</Link>
          </div>
      ) : (
          <>
            {/* Address Bar */}
            {selectedAddress ? (
                <div className="cart-address-bar">
                <div className="cab-info">
                    <span className="cab-label">Deliver to:</span>
                    <span className="cab-name">{selectedAddress.name}</span>
                    <span className="cab-badge">Home</span>
                    <div className="cab-detail">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.zip}</div>
                </div>
                <button className="cab-change-btn" onClick={() => setShowAddressModal(true)}>Change</button>
                </div>
            ) : (
                <div className="cart-address-bar">
                <div className="cab-info">Please select a delivery location</div>
                <button className="cab-change-btn" onClick={() => setShowAddressModal(true)}>Select Address</button>
                </div>
            )}

            <div className="cart-grid">
                {/* Left: Cart Items */}
                <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.id} className="cart-item-card">
                        <div className="cart-img-box">
                        <img 
                            src={item.product.image_url} 
                            alt={item.product.name} 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                        />
                        </div>
                        <div className="cart-item-info">
                        <div className="cart-item-header">
                            <h3>{item.product.name}</h3>
                            <button className="btn-delete" onClick={() => remove(item.id)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                        
                        <p className="cart-variant">Size: Medium <br/> Color: Red</p>
                        
                        <div className="cart-item-bottom">
                            <span className="cart-price">₹{Number(item.product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            
                            <div className="qty-stepper">
                                <button onClick={() => changeQty(item.id, item.quantity - 1)}>–</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => changeQty(item.id, item.quantity + 1)}>+</button>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
                </div>

                {/* Right: Summary */}
                <div className="cart-summary">
                <h3>Price Details</h3>
                <div className="summary-row"><span>Subtotal</span><span className="summary-val">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>

                <div className="summary-row"><span>Delivery Fee</span><span className="summary-val">₹{deliveryFee}</span></div>
                <div className="summary-divider"></div>
                <div className="summary-row total"><span>Total</span><span>₹{Math.max(0, total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <button className="btn-checkout" onClick={handleCheckout} style={{marginTop:20}}>
                    {localStorage.getItem('token') ? "Go to Checkout" : "Login to Checkout"} &rarr;
                </button>
                </div>
            </div>
          </>
      )}

      {/* WISHLIST SECTION (Bottom) */}
      {wishlistItems.length > 0 && (
          <div className="cart-wishlist-section" style={{marginTop: 40}}>
              <h3>Saved for Later ({wishlistItems.length})</h3>
              <div className="cart-wishlist-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:20, marginTop:16}}>
                  {wishlistItems.map(p => (
                      <div key={p.id} className="cart-wishlist-card" style={{border:'1px solid #eee', padding:16, borderRadius:8, background:'white'}}>
                          <Link to={`/products/${p.id}`} style={{textDecoration:'none', color:'inherit', display:'block', marginBottom:10}}>
                             <div style={{height:150, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10}}>
                                 <img src={p.image_url} alt={p.name} style={{maxHeight:'100%', maxWidth:'100%'}} 
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                 />
                             </div>
                             <div style={{fontWeight:600, fontSize:14, marginBottom:4, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis'}}>{p.name}</div>
                             <div style={{fontWeight:700}}>₹{Number(p.price).toLocaleString()}</div>
                          </Link>
                          <button 
                            style={{width:'100%', padding:'8px 0', border:'1px solid #e0e0e0', background:'white', borderRadius:4, fontWeight:600, cursor:'pointer', color:'#2874f0'}}
                            onClick={() => moveFromWishlist(p)}
                          >
                              Move to Cart
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Address Selection Modal */}
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
