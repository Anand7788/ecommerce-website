import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/api";
import ProductGrid from "../components/ProductGrid";
import Hero from "../components/Hero"; // Import Hero
import SortBar from "../components/SortBar";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");
  const sortParam = searchParams.get("sort");

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      const list = Array.isArray(data) ? data : data.products || [];
      setProducts(list);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Filter & Sort products
  useEffect(() => {
    let result = [...products];

    // 1. Search
    if(searchQuery) {
        const lower = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(lower) || 
            (p.description && p.description.toLowerCase().includes(lower))
        );
    }

    // 2. Category
    if(categoryParam && categoryParam !== 'All') {
        result = result.filter(p => p.category === categoryParam);
    }

    // 3. Deals (Mock: price < 5000 or specific flag if available)
    if(filterParam === 'deals') {
        // As a simple heuristic for "Deals", we can show items under a certain price
        // or if you have a discount field. For now, showing affordable items.
        result = result.filter(p => p.price < 5000); 
    }

    // 4. Sort
    if(sortParam === 'newest') {
        result.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredProducts(result);
  }, [products, searchQuery, categoryParam, filterParam, sortParam]);

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
