import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchOrder } from '../api/api';
import '../styles/OrderDetails.css';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch(err => {
          console.error(err);
          alert("Failed to load order");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if(loading) return <div className="container" style={{padding:40}}>Loading Order...</div>;
  if(!order) return <div className="container" style={{padding:40}}>Order not found.</div>;

  // Assuming order.address is "Name, Address, ..." or just string.
  // We'll try to display it as best as possible.
  
  const deliveryFee = 0; // or from order if stored
  const subtotal = order.total_price; // Backend currently stores total directly
  
  return (
    <div className="order-details-container">
        <div className="breadcrumb">
           <Link to="/">Home</Link> &gt; <Link to="/me">My Account</Link> &gt; <Link to="/orders">My Orders</Link> &gt; <span>{"Order ID: #"+ order.id}</span>
        </div>

        <div className="order-grid">
            {/* LEFT COLUMN: Items & Status */}
            <div>
                 <div className="od-card no-padding">
                    {order.order_items && order.order_items.map(item => (
                        <div key={item.id} className="od-product-row">
                            {/* Left Side: Info + Status */}
                            <div className="od-main-content">
                                <div className="od-product-info">
                                    <h3 className="od-title">{item.product?.name}</h3>
                                    <p className="od-subtitle">Seller: ShopNow</p>
                                    <div className="od-price">
                                        ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })} 
                                        <span className="od-discount-badge">⚡ 25</span>
                                    </div>
                                </div>

                                <div className="od-status-col">
                                    <div className="status-step completed">
                                        <div className="status-dot"></div>
                                        <div className="status-label">Order Confirmed</div>
                                        <div className="status-date">{new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                                    </div>
                                    <div className={`status-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                                        <div className="status-dot"></div>
                                        <div className="status-label">{order.status === 'delivered' ? 'Delivered' : 'Expected Delivery'}</div>
                                        <div className="status-date">{order.status === 'delivered' ? 'Today' : 'in 3 days'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side: Image */}
                            <div className="od-img-box">
                                <img src={item.product?.image_url || 'https://via.placeholder.com/80'} alt="" />
                            </div>
                        </div>
                    ))}
                 </div>
                 
                 <div className="od-card">
                     <div className="help-links">
                         <span style={{fontSize:18}}>💬</span> Chat with us
                     </div>
                 </div>
                 
                 <div className="od-card">
                     <h3 className="od-section-title">Rate your experience</h3>
                     <div style={{color:'#26a541', fontWeight:600, marginTop:10}}>
                         Product ratings: ★ ★ ★ ★ ★
                     </div>
                 </div>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div>
               <div className="od-card">
                   <h3 className="od-section-title">Delivery details</h3>
                   <div className="od-address-box">
                       <div className="od-addr-name">Shipping Address</div>
                       <div className="od-addr-text">
                           {order.shipping_address ? (
                               // If we stored structured, great. If not, raw string.
                               order.shipping_address.street || order.address
                           ) : order.address}
                       </div>
                       {/* If we had phone separately: */}
                       {/* <div className="od-addr-phone">9999999999</div> */}
                   </div>
               </div>

               <div className="od-card">
                   <h3 className="od-section-title">Price details</h3>
                   <div className="price-row">
                       <span>Listing Price</span>
                       <span>₹{parseFloat(order.total_price).toFixed(2)}</span>
                   </div>
                   <div className="price-row">
                       <span>Total Fees</span>
                       <span>₹0</span>
                   </div>
                   <div className="price-row">
                       <span>Delivery Fee</span>
                       <span className="free-text">FREE</span>
                   </div>
                   <div className="price-row total">
                       <span>Total Amount</span>
                       <span>₹{parseFloat(order.total_price).toFixed(2)}</span>
                   </div>
                   
                   <div style={{marginTop:24, paddingTop:16, borderTop:'1px solid #f0f0f0'}}>
                       <div style={{fontSize:13, fontWeight:600, color:'#212121', marginBottom:4}}>Payment Method</div>
                       <div style={{fontSize:13, color:'#878787'}}>Online Payment (Razorpay)</div>
                   </div>
               </div>
               
               <div className="od-action-btn">
                   <span>📄</span> Download Invoice
               </div>
            </div>
        </div>
    </div>
  );
}
