// src/components/ProductGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../api/api";

export default function ProductGrid({ products, loading, onAdded }) {
  if (loading) {
    return (
      <div style={{padding:'20px 0'}}>Loading...</div>
    );
  }

  if (!products || products.length === 0) {
    return <div style={{padding:'20px 0'}}>No products found.</div>;
  }

  return (
    <div className="container">
      <div className="shopcart-grid">
        {products.map((p) => (
          <div key={p.id} className="shopcart-card">
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
               <button className="wishlist-btn">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
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
        ))}
      </div>
    </div>
  );
}

