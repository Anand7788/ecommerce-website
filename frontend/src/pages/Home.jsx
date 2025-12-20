import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/api";
import ProductGrid from "../components/ProductGrid";
import Hero from "../components/Hero";
import SortBar from "../components/SortBar";
import FilterBar from "../components/FilterBar";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");
  const sortParam = searchParams.get("sort");

  // New Filter State
  const [activeFilters, setActiveFilters] = useState({
    price: { min: 0, max: 50000 },
    colors: [],
    offer: false
  });

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
        result = result.filter(p => p.price < 5000); 
    }

    // 4. Interactive Filters (Price, Color, Offer)
    if (activeFilters.price.min > 0 || activeFilters.price.max < 50000) {
      result = result.filter(p => p.price >= activeFilters.price.min && p.price <= activeFilters.price.max);
    }
    
    // Note: Assuming 'color' or 'description' contains color info for now as we don't have a dedicated color column yet.
    // Using description search as a proxy for color if not present.
    if (activeFilters.colors.length > 0) {
      result = result.filter(p => {
        const text = (p.description || '') + ' ' + (p.name || '');
        return activeFilters.colors.some(c => text.toLowerCase().includes(c.toLowerCase()));
      });
    }

    if (activeFilters.offer) {
       // Mock offer logic: assuming items under certain price or specific keywords are "on offer"
       result = result.filter(p => p.price < 10000); // Example threshold
    }

    // 5. Sort
    if(sortParam === 'newest') {
        result.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredProducts(result);
  }, [products, searchQuery, categoryParam, filterParam, sortParam, activeFilters]);

  // Handler for filter changes from FilterBar
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Filter Pills Bar */}
      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:32, alignItems:'center'}}>
        <FilterBar onFilterChange={handleFilterChange} />
        
        <div style={{marginLeft:'auto'}}>
           <SortBar products={filteredProducts} setProducts={setFilteredProducts} />
        </div>
      </div>

      {/* 3. Section Title */}
      <h2 style={{fontSize:24, fontWeight:800, marginBottom:24, color:'#111827'}}>Products For You!</h2>

      {/* 4. Grid */}
      {/* 4. Grid */}
      <ProductGrid products={filteredProducts.slice(0, visibleCount)} loading={loading} />

      {/* 5. Load More */}
      {visibleCount < filteredProducts.length && (
         <div style={{textAlign:'center', margin:'40px 0'}}>
            <button 
              onClick={() => setVisibleCount(prev => prev + 12)}
              style={{
                padding:'12px 32px', 
                background:'white', 
                border:'2px solid #e5e7eb', 
                borderRadius:99, 
                fontSize:14, 
                fontWeight:600,
                cursor:'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.target.style.borderColor = '#000'}
              onMouseOut={e => e.target.style.borderColor = '#e5e7eb'}
            >
              Show Next Products (`{filteredProducts.length - visibleCount}` more)
            </button>
         </div>
      )}
    </div>
  );
}
