import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchOrder, createReview } from '../api/api';
import '../styles/OrderDetails.css';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch(err => {
          console.error(err);
          alert("Failed to load order");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const openReviewModal = (item) => {
      setSelectedItem(item);
      setNewReview({ rating: 5, comment: "" }); // Reset form
      setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
      setReviewModalOpen(false);
      setSelectedItem(null);
  };

  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      if (!selectedItem) return;

      setSubmittingReview(true);
      try {
          await createReview(selectedItem.product.id, newReview);
          alert("Review submitted successfully!");
          closeReviewModal();
          // Optionally, verify we can refetch or just assume it's done. 
          // We can't update order object to show 'Reviewed' unless backend supports it.
      } catch (err) {
          console.error(err);
          alert("Failed to submit review. You might have already reviewed this product.");
      } finally {
          setSubmittingReview(false);
      }
  };

  if(loading) return <div className="container" style={{padding:40}}>Loading Order...</div>;
  if(!order) return <div className="container" style={{padding:40}}>Order not found.</div>;

  // Assuming order.address is "Name, Address, ..." or just string.
  
  const deliveryFee = 0; 
  const subtotal = order.total_price; 
  
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
                                    {/* TRACKING TIMELINE */}
                                    {(() => {
                                        const STEPS = [
                                            { key: 'pending', label: 'Order Placed' },
                                            { key: 'processing', label: 'Processing' },
                                            { key: 'shipped', label: 'Shipped' },
                                            { key: 'out_for_delivery', label: 'Out for Delivery' },
                                            { key: 'delivered', label: 'Delivered' }
                                        ];

                                        // Helper to find log date
                                        const getStepDate = (stepKey) => {
                                            if (!order.order_status_logs) return null;
                                            const log = order.order_status_logs.find(l => l.status === stepKey);
                                            return log ? new Date(log.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : null;
                                        };

                                        // Determine active index
                                        const currentStatusIndex = STEPS.findIndex(s => s.key === order.status);
                                        const isCancelled = order.status === 'cancelled';
                                        const isReturned = order.status === 'returned';

                                        if (isCancelled) {
                                             return (
                                                <div className="status-step completed" style={{borderLeftColor:'#ef4444'}}>
                                                    <div className="status-dot" style={{background:'#ef4444'}}></div>
                                                    <div className="status-label" style={{color:'#ef4444'}}>Order Cancelled</div>
                                                    <div className="status-date">{new Date(order.updated_at).toLocaleDateString()}</div>
                                                </div>
                                             );
                                        }

                                        return STEPS.map((step, index) => {
                                            // A step is completed if its index <= currentStatusIndex
                                            // BUT we only show date if we have a log, OR if it's the current step (using updated_at)
                                            // To be precise: strict logs are better.
                                            
                                            const isCompleted = index <= currentStatusIndex;
                                            const date = getStepDate(step.key) || (step.key === 'pending' ? new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : null);

                                            return (
                                                <div key={step.key} className={`status-step ${isCompleted ? 'completed' : ''}`}>
                                                    <div className="status-dot"></div>
                                                    <div className="status-label">{step.label}</div>
                                                    {date && <div className="status-date">{date}</div>}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                                
                                {order.status === 'delivered' && (
                                    <div style={{marginTop: 16, paddingLeft: 20}}>
                                        <button 
                                            className="od-rate-btn"
                                            onClick={() => openReviewModal(item)}
                                        >
                                            ★ Rate & Review Product
                                        </button>
                                    </div>
                                )}
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
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div>
               <div className="od-card">
                   <h3 className="od-section-title">Delivery details</h3>
                   <div className="od-address-box">
                       <div className="od-addr-name">Shipping Address</div>
                       <div className="od-addr-text">
                           {order.shipping_address ? (
                               order.shipping_address.street || order.address
                           ) : order.address}
                       </div>
                   </div>
               </div>

                <div className="od-card">
                   <h3 className="od-section-title">Price details</h3>
                   <div className="price-row">
                       <span>Listing Price</span>
                       <span>₹{(Number(order.total_price) + Number(order.discount_amount || 0)).toFixed(2)}</span>
                   </div>
                   {Number(order.discount_amount) > 0 && (
                       <div className="price-row" style={{color:'#ef4444'}}>
                           <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                           <span>-₹{Number(order.discount_amount).toFixed(2)}</span>
                       </div>
                   )}
                   <div className="price-row">
                       <span>Delivery Fee</span>
                       <span className="free-text">FREE</span>
                   </div>
                   <div className="price-row total">
                       <span>Total Amount</span>
                       <span>₹{Number(order.total_price).toFixed(2)}</span>
                   </div>
                   
                   <div style={{marginTop:24, paddingTop:16, borderTop:'1px solid #f0f0f0'}}>
                       <div style={{fontSize:13, fontWeight:600, color:'#212121', marginBottom:4}}>Payment Method</div>
                       <div style={{fontSize:13, color:'#878787'}}>{order.payment_method || 'Online Payment (Razorpay)'}</div>
                   </div>
               </div>
               
               <div className="od-action-btn">
                   <span>📄</span> Download Invoice
               </div>
            </div>
        </div>

        {/* REVIEW MODAL */}
        {reviewModalOpen && (
            <div className="p-review-modal-overlay">
                <div className="p-review-modal">
                    <button className="p-modal-close" onClick={closeReviewModal}>&times;</button>
                    <h3>Rate {selectedItem?.product?.name}</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="p-rating-input" style={{justifyContent:'center', margin: '24px 0'}}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                    key={star} 
                                    type="button" 
                                    className={`p-star-btn ${star <= newReview.rating ? 'filled' : ''}`}
                                    onClick={() => setNewReview({...newReview, rating: star})}
                                    style={{fontSize: 32}}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea 
                            className="p-modal-textarea"
                            placeholder="Share your experience..." 
                            value={newReview.comment}
                            onChange={e => setNewReview({...newReview, comment: e.target.value})}
                            required
                            rows="4"
                        />
                        <button type="submit" disabled={submittingReview} className="p-modal-submit-btn">
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
