import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct, addToCart } from '../api/api';

export default function ProductDetails(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  if(!product) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{display:'flex', gap:20}}>
        <img src={product.image_url} alt="" style={{width:320, height:320, objectFit:'cover'}} />
        <div>
          <h1>{product.name}</h1>
          <p className="small">{product.description}</p>
          <h3>₹{product.price}</h3>
          <button className="button" onClick={() => addToCart(product.id, 1)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
