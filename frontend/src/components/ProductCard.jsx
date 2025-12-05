import React from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../api/api';

export default function ProductCard({ product, onAdded }) {
  const image = product.image_url || '/mnt/data/Screenshot 2025-11-21 112804.png';

  async function handleAdd() {
    try {
      await addToCart(product.id, 1);
      onAdded && onAdded();
    } catch (err) {
      console.error('Add to cart failed', err);
      alert('Failed to add to cart');
    }
  }

  const badge = product.stock === 0 ? 'Sold out' : product.stock < 5 ? 'Low stock' : (product.is_new ? 'New' : null);

  return (
    <div className="card">
      <Link to={`/products/${product.id}`} style={{textDecoration:'none', color:'inherit'}}>
        <img src={image} alt={product.name || product.title || 'Product'} loading="lazy" />
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
