import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/api";
import ProductGrid from "../components/ProductGrid";
import Hero from "../components/Hero";
import SortBar from "../components/SortBar";
import FilterBar from "../components/FilterBar";
import "../styles/HomeMobile.css";
import { ServiceStrip, DealsGrid } from "../components/HomeBanners";

export default function HomePage() {
  const [products, setProducts] = useState([]);
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search
    if(searchQuery) {
        const lower = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(lower) || 
            (p.description && p.description.toLowerCase().includes(lower))
        );
    }

    // 2. Category (URL or Interactive Filter)
    const activeCat = activeFilters.category || categoryParam;
    if(activeCat && activeCat !== 'All') {
        result = result.filter(p => p.category === activeCat);
    }

    // 3. Deals (Mock)
    if(filterParam === 'deals') {
        result = result.filter(p => p.price < 5000); 
    }

    // 4. Interactive Filters TopBar (Price, Color, Offer)
    if (activeFilters.price.min > 0 || activeFilters.price.max < 50000) {
      result = result.filter(p => p.price >= activeFilters.price.min && p.price <= activeFilters.price.max);
    }
    
    if (activeFilters.colors.length > 0) {
      result = result.filter(p => {
        const text = (p.description || '') + ' ' + (p.name || '');
        return activeFilters.colors.some(c => text.toLowerCase().includes(c.toLowerCase()));
      });
    }

    if (activeFilters.offer) {
       result = result.filter(p => p.price < 10000); 
    }

    // 5. Sort
    if(sortParam === 'newest') {
        result.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [products, searchQuery, categoryParam, filterParam, sortParam, activeFilters]);

  // Reset visible count when filters change
  useEffect(() => {
      setVisibleCount(12);
  }, [filteredProducts]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  return (
    <div className="home-page">
      <Hero />

      <div className="container" style={{ marginTop: 24, padding: '0 20px 40px' }}>
            
        {/* Native Service Strip */}
        <ServiceStrip />
      
        {/* Section Title */}
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20, color: '#111827', textAlign: 'center', letterSpacing: '-0.5px' }}>
           <span style={{borderBottom: '4px solid #fcd34d', paddingBottom: 4}}>Super Dhamaka Deal</span>
        </h2>

        {/* Native Deals Grid */}
        <DealsGrid />

        {/* Filter & Sort Bar (Restored Horizontal Layout) */}
        <div className="filter-sort-container" style={{display:'flex', gap:10, marginBottom:8, alignItems:'center', flexWrap:'wrap'}}>
          <FilterBar onFilterChange={handleFilterChange} products={products} />
          
          <div style={{marginLeft:'auto', flexShrink:0}}>
             <SortBar products={filteredProducts} setProducts={() => {}} />
          </div>
        </div>

        {/* Grid */}
        <ProductGrid products={filteredProducts.slice(0, visibleCount)} loading={loading} />

        {/* Load More */}
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
                Show Next Products ({filteredProducts.length - visibleCount} more)
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
