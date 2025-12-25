import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProduct, addToCart, fetchAddresses, fetchReviews, createReview, addToWishlist } from "../api/api";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("red");
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState("specs"); // specs, reviews
  const [showAllDetails, setShowAllDetails] = useState(false);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Mock images for gallery (since backend only provides one)
  const [mainImage, setMainImage] = useState("");

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct(id).then((data) => {
      setProduct(data);
      setMainImage(data?.image_url);
      setLoading(false);
    });

    if (token) {
        // Auto-fetch default pincode if logged in
        fetchAddresses().then(addresses => {
            if (addresses && addresses.length > 0) {
                const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
                if (defaultAddr?.zip) {
                    setPincode(defaultAddr.zip);
                }
            }
        }).catch(err => console.error(err));
    }
  }, [id]);

  // Fetch reviews when tab changes to reviews
  useEffect(() => {
    if (activeTab === 'reviews') {
        setReviewsLoading(true);
        fetchReviews(id).then(data => {
            setReviews(data);
            setReviewsLoading(false);
        }).catch(err => {
            console.error("Failed to fetch reviews", err);
            setReviewsLoading(false);
        });
    }
  }, [id, activeTab]);

  const handleBuyNow = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    await addToCart(product.id, quantity);
    navigate("/cart");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    
    setSubmittingReview(true);
    try {
        const created = await createReview(id, newReview);
        setReviews([created, ...reviews]);
        setNewReview({ rating: 5, comment: "" });
    } catch (err) {
        alert("Failed to submit review. You might have already reviewed this product.");
    } finally {
        setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return <div className="p-details-loading">Loading...</div>;
  }

  // Mock colors
  const colors = [
    { id: "red", hex: "#ecaea9" },
    { id: "black", hex: "#1f2937" },
    { id: "green", hex: "#d1fae5" },
    { id: "silver", hex: "#f3f4f6" },
    { id: "blue", hex: "#e0f2fe" },
  ];

  return (
    <div className="container product-details-page">
      {/* Breadcrumbs */}
      <div className="p-breadcrumbs">
        <Link to="/">Home</Link> / <span>{product.category || "General"}</span> / <span>{product.name}</span>
      </div>

      <div className="p-details-grid">
        {/* LEFT: GALLERY & ACTIONS (Sticky) */}
        <div className="p-left-column">
             <div className="p-gallery-container">
                 <div className="p-thumbnails">
                    {[1,2,3,4].map((_, idx) => (
                        <div 
                        key={idx} 
                        className={`p-thumb-box ${mainImage === product.image_url ? 'active' : ''}`}
                        onClick={() => setMainImage(product.image_url)}
                        >
                           <img 
                             src={product.image_url} 
                             alt="thumb" 
                             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                           />
                        </div>
                    ))}
                 </div>
                 
                 <div className="p-main-image-box">
                    <img 
                        src={mainImage} 
                        alt={product.name} 
                        className="p-main-img" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600?text=No+Image'; }}
                    />
                    <button 
                        className="p-wishlist-fab"
                        onClick={() => {
                             const token = localStorage.getItem('token');
                             if (!token) return alert("Please login");
                             addToWishlist(product.id).then(() => alert("Added to Wishlist!")).catch(e => console.error(e));
                        }}
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                 </div>
             </div>

             <div className="p-buttons">
                <button 
                  className="btn-add-cart"
                  onClick={() => addToCart(product.id, quantity)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="white" style={{marginRight:6}}><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 7h8.22l1.25-7H3.14zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                  Add to Cart
                </button>
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="white" style={{marginRight:6}}><path d="M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z"/></svg>
                  Buy Now
                </button>
             </div>
        </div>

        {/* RIGHT: INFO & DETAILS (Scrollable) */}
        <div className="p-info">
          <h1 className="p-title">{product.name}</h1>

          <div className="p-rating">
            <div className="p-rating-badge">
              4.3 <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <span className="p-rating-text">121 Ratings & {reviews.length > 0 ? reviews.length : 15} Reviews</span>
            <span style={{color: '#16a34a', fontWeight:'600', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px'}}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> 
              Verified
            </span>
          </div>

          <div className="p-price-box">
             <span className="p-price">₹{Math.floor(product.price).toLocaleString()}</span>
             <span className="p-old-price">₹{Math.floor(product.price * 1.4).toLocaleString()}</span>
             <span className="p-discount">28% off</span>
          </div>
          <span className="p-installment">EMI starts at ₹99/month. <a href="#" style={{color:'var(--primary)', fontWeight:'600'}}>View Plans</a></span>

          {/* AVAILABLE OFFERS (Unwrapped) */}
          <div className="p-offers-container">
             <h4>
               <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V9h-2.82v9.09h2.82zM12 5.5c.83 0 1.5.67 1.5 1.5S12.83 8.5 12 8.5 10.5 7.83 10.5 7 11.17 5.5 12 5.5z"/></svg>
               Available Offers
             </h4>
             <ul className="p-offers-list">
                <li>
                   <span className="p-offer-tag">BANK OFFER</span>
                   <span>5% Unlimited Cashback on <b>ShopNow Axis Bank Credit Card</b> <a href="#">T&C</a></span>
                </li>
                <li>
                   <span className="p-offer-tag">PARTNER OFFER</span>
                   <span>Sign up for ShopNow Pay Later and get ShopNow Gift Card worth ₹100* <a href="#">Know More</a></span>
                </li>
             </ul>
          </div>

          {/* DELIVERY (Kept same) */}
          <div className="p-delivery-section">
             <div className="p-delivery-header">
                <span className="p-d-label">Delivery</span>
                <div className="p-pincode-box">
                   <div className="p-pincode-input-wrapper">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="p-pin-icon"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                      <input 
                        type="text" 
                        placeholder="Enter Pincode" 
                        className="p-pincode-input"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                   </div>
                   <button className="p-check-btn">Check</button>
                </div>
             </div>
             <div className="p-expected-delivery">
                Delivery by <b>{new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}</b> <span className="p-free-text">| Free ₹40</span>
             </div>
          </div>

          {/* Color Selector */}
          <div className="p-selector">
            <h4>Color</h4>
            <div className="p-colors">
              {colors.map((c) => (
                <div
                  key={c.id}
                  className={`p-color-swatch ${selectedColor === c.id ? "selected" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.id)}
                />
              ))}
            </div>
          </div>
          
          {/* PRODUCT DETAILS & REVIEWS CARD */}
          <div className="p-details-bottom-card">
            <div className="p-tabs">
                 <button 
                    className={`p-tab ${activeTab === 'specs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specs')}
                 >
                    Product Specification
                 </button>
                 <button 
                    className={`p-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                 >
                    Reviews ({reviews.length})
                 </button>
            </div>
            
            <div className="p-tab-content">
                 {activeTab === 'specs' && (
                     <div className="p-specs-container">
                         {/* 1. Product Highlights */}
                         <h4 className="p-section-title">Product Highlights</h4>
                         <div className="p-highlights-grid">
                            <div className="p-highlight-item">
                                <span className="ph-label">Occasion</span>
                                <span className="ph-value">Casual</span>
                            </div>
                            <div className="p-highlight-item">
                                <span className="ph-label">Color</span>
                                <span className="ph-value">{selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</span>
                            </div>
                            <div className="p-highlight-item">
                                <span className="ph-label">Generic Name</span>
                                <span className="ph-value">T-Shirts</span>
                            </div>
                            <div className="p-highlight-item">
                                <span className="ph-label">Fit/Shape</span>
                                <span className="ph-value">Regular</span>
                            </div>
                         </div>

                         {/* 2. Additional Details (Expandable) */}
                         {showAllDetails && (
                           <>
                             <h4 className="p-section-title" style={{marginTop: 32}}>Additional Details</h4>
                             <div className="p-details-list">
                                <div className="p-detail-row">
                                    <span className="pd-label">Pattern</span>
                                    <span className="pd-value">Solid</span>
                                </div>
                                <div className="p-detail-row">
                                    <span className="pd-label">Sleeve Styling</span>
                                    <span className="pd-value">Regular</span>
                                </div>
                                <div className="p-detail-row">
                                    <span className="pd-label">Fabric</span>
                                    <span className="pd-value">Cotton Blend</span>
                                </div>
                                <div className="p-detail-row">
                                    <span className="pd-label">Country of Origin</span>
                                    <span className="pd-value">India</span>
                                </div>
                             </div>
                           </>
                         )}
                         
                         <button className="p-show-more-btn" onClick={() => setShowAllDetails(!showAllDetails)}>
                            {showAllDetails ? 'View Less' : 'View More'}
                         </button>
                     </div>
                 )}

                 {activeTab === 'reviews' && (
                     <div className="p-reviews-container">
                        {/* Reviews List */}
                        <div className="p-reviews-list">
                            {reviewsLoading ? (
                                <div>Loading reviews...</div>
                            ) : reviews.length === 0 ? (
                                <div className="p-no-reviews">No reviews yet.</div>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="p-review-item">
                                        <div className="p-review-header">
                                            <div className={`p-review-rating ${review.rating >= 4 ? 'good' : review.rating >= 3 ? 'avg' : 'bad'}`}>
                                                {review.rating} ★
                                            </div>
                                            <span className="p-review-user">{review.user?.name || "User"}</span>
                                        </div>
                                        <p className="p-review-comment">{review.comment}</p>
                                        <span className="p-review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                     </div>
                 )}
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
}

