import React, { useEffect, useState } from 'react';
import { fetchProducts, addToCart } from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Products(){
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  async function handleAdd(id){
    await addToCart(id, 1);
    alert("Added to cart");
  }

  return (
    <div className="container">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}
