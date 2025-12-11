import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';
import ProductGrid from '../components/ProductGrid';

export default function HomePage(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);

  async function load(){
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch(err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, [reloadFlag]);

  return (
    <div>
      <div className="container" style={{marginBottom:18}}>
        <h2>Products</h2>
      </div>

      <ProductGrid products={products} loading={loading} onAdded={() => setReloadFlag(f=>f+1)} />
    </div>
  );
}
