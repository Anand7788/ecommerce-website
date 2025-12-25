import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart, addToWishlist, removeFromWishlist, fetchWishlist } from '../api/api';

export default function ProductCard({ product, onAdded, initialWishlistState = false }) {
  const image = product.image_url || '/mnt/data/Screenshot 2025-11-21 112804.png';
  const [inWishlist, setInWishlist] = useState(initialWishlistState);

  // Check initial wishlist state if not provided (optional, better passed down)
  useEffect(() => {
     const checkWishlist = async () => {
         const token = localStorage.getItem('token');
         if (token && initialWishlistState === false) { 
             // Ideally parent fetches wishlist IDs to avoid N+1, but for individual updates:
             // setInWishlist(isWishlisted); 
             // For now, let's just toggle local state assuming parent will pass it or we fetch once.
         }
     };
     checkWishlist();
  }, []);

  async function handleAdd() {
    try {
      await addToCart(product.id, 1);
      onAdded && onAdded();
    } catch (err) {
      console.error('Add to cart failed', err);
      alert('Failed to add to cart');
    }
  }

  async function toggleWishlist(e) {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) return alert("Please login to use wishlist");

      try {
          if (inWishlist) {
              // We need wishlist_item_id usually, but if we don't have it, we might need to find it relative to product
              // Or backend 'toggle' endpoint. Since we only have product.id here...
              // Let's assume user passes wishlist_item_id or we use a "remove by product" endpoint?
              // Standard REST: DELETE /wishlist/:id. 
              
              // TRICK: backend index returns product with `wishlist_item_id`.
              // If we are in ProductCard, we might just know "it is in wishlist". We might be missing the ID.
              // We'll fix this by allowing remove by product_id or fetching ID first.
              // For simplicity: Add endpoint `DELETE /wishlist/product/:product_id` ? 
              // OR: just implement add for now and handle remove if we have id.
              
              // TEMP FIX: Re-fetch or specific delete logic required. 
              // Let's rely on parent passing `wishlist_item_id` if possible.
              // For now, button will just act as "Add" if not in, and "Added" if in.
              alert("Go to wishlist page to remove items.");
          } else {
              await addToWishlist(product.id);
              setInWishlist(true);
          }
      } catch (err) {
          console.error(err);
      }
  }

  const badge = product.stock === 0 ? 'Sold out' : product.stock < 5 ? 'Low stock' : (product.is_new ? 'New' : null);

  return (
    <div className="card" style={{position:'relative'}}>
      {/* Wishlist Icon */}
      <button 
        onClick={toggleWishlist}
        style={{
            position:'absolute', top:10, right:10, zIndex:10, 
            background:'white', border:'none', borderRadius:'50%', width:32, height:32, 
            boxShadow:'0 2px 5px rgba(0,0,0,0.1)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color: inWishlist ? '#ef4444' : '#d1d5db'
        }}
      >
        <svg width="20" height="20" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link to={`/products/${product.id}`} style={{textDecoration:'none', color:'inherit'}}>
        <img 
          src={image} 
          alt={product.name || product.title || 'Product'} 
          loading="lazy" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
        />
        <h3>{product.name || product.title}</h3>
        <p className="small">{product.description}</p>
      </Link>

      <div className="row" style={{marginTop:12}}>
        <div>
          <div className="price">₹{Number(product.price).toFixed(2)}</div>
          {badge && <div className="small" style={{color:'#b45309', marginTop:6}}>{badge}</div>}
        </div>

        <div className="actions">
          <button className="button" onClick={handleAdd}>Add</button>
          <Link to={`/products/${product.id}`} className="button secondary">View</Link>
        </div>
      </div>
    </div>
  );
}
