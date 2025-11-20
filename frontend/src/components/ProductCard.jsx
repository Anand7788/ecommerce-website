import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({product, onAdd}){
  return (
    <div className="card">
      <img src={product.image_url} alt={product.name} style={{width:'100%', height:160, objectFit:'cover', borderRadius:6}} />
      <h3>{product.name}</h3>
      <p className="small">{product.description}</p>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
        <div>₹{product.price}</div>
        <div>
          <Link to={`/products/${product.id}`} className="button" style={{marginRight:8}}>View</Link>
          <button className="button" onClick={() => onAdd(product.id)}>Add</button>
        </div>
      </div>
    </div>
  );
}
