import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/api";
import ProductGrid from "../components/ProductGrid";
import Hero from "../components/Hero"; // Import Hero
import SortBar from "../components/SortBar";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      const list = Array.isArray(data) ? data : data.products || [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Filter Pills Bar (Visual Only for now) */}
      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:32, alignItems:'center'}}>
        {["Headphone Type", "Price", "Review", "Color", "Material", "Offer"].map(f => (
           <button key={f} style={{
             padding: '8px 16px',
             background: '#f3f4f6',
             border: 'none',
             borderRadius: 99,
             fontSize: 13,
             fontWeight: 500,
             display: 'flex',
             alignItems: 'center',
             gap: 4,
             cursor: 'pointer'
           }}>
             {f} <span style={{fontSize:10}}>▼</span>
           </button>
        ))}
        <button style={{padding:'8px 16px', background:'#e5e7eb', border:'none', borderRadius:99, fontSize:13, fontWeight:600}}>All Filters ⚙️</button>
        
        <div style={{marginLeft:'auto'}}>
           <SortBar products={filteredProducts} setProducts={setFilteredProducts} />
        </div>
      </div>

      {/* 3. Section Title */}
      <h2 style={{fontSize:24, fontWeight:800, marginBottom:24, color:'#111827'}}>Products For You!</h2>

      {/* 4. Grid */}
      <ProductGrid products={filteredProducts} loading={loading} />
    </div>
  );
}
