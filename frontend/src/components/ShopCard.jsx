import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addToCart, addToWishlist } from "../api/api";
import "../styles/ProductCard.css";

export default function ShopCard({ p, onAdded, initialInWishlist = false }) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);

  useEffect(() => {
    setInWishlist(initialInWishlist);
  }, [initialInWishlist]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login to use wishlist");

    try {
        if (inWishlist) {
            // Treat as "Already added" or allow remove if we had the ID.
            // For now, consistent with ProductCard: 
            alert("Go to your wishlist to remove items.");
        } else {
            await addToWishlist(p.id);
            setInWishlist(true);
            alert("Added to wishlist!");
        }
    } catch (err) {
        console.error(err);
        // If error is 422 (already exists), we should just set it to true
        if(err.response && err.response.status === 422) {
             setInWishlist(true);
             alert("Item is already in your wishlist!");
        }
    }
  };

  return (
    <div className="shopcart-card">
      {/* Image Area (Gray BG) */}
      <div className="card-img-box">
         <Link to={`/products/${p.id}`} style={{display:'block', width:'100%', height:'100%'}}>
           <img 
             src={p.image_url} 
             alt={p.name} 
             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
           />
         </Link>
         {/* Wishlist Icon */}
         <button className="wishlist-btn" onClick={toggleWishlist} style={{color: inWishlist ? '#ef4444' : 'inherit'}}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
         </button>
      </div>

      {/* Content */}
      <div className="card-content">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px'}}>
          <Link to={`/products/${p.id}`} style={{textDecoration:'none', color:'inherit', flex:1, minWidth:0}}>
            <h3 className="card-title" style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.name}</h3>
          </Link>
          <div style={{flexShrink:0}}>
             <span className="card-price" style={{display:'block'}}>₹{Math.floor(p.price).toLocaleString()}</span>
          </div>
        </div>
        
        <p className="card-desc">{p.description ? p.description.slice(0, 30) + '...' : 'Premium audio quality'}</p>

        {/* Rating */}
        <div className="card-rating">
          {[1,2,3,4,5].map(i => (
            <svg key={i} width="14" height="14" fill="#059669" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ))}
          <span style={{color:'#6b7280', fontSize:12, marginLeft:4}}>(121)</span>
        </div>

        {/* Add Button (Outline) */}
        <button
          className="btn-outline-dark"
          onClick={async () => {
             await addToCart(p.id, 1);
             if (onAdded) onAdded();
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
