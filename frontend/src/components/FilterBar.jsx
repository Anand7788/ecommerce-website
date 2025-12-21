import React, { useState, useRef, useEffect } from 'react';

export default function FilterBar({ onFilterChange, products = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'all'
  const dropdownRef = useRef(null);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [offerOnly, setOfferOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // New States for Discount and Availability
  const [minDiscount, setMinDiscount] = useState(0); // 0, 10, 20, 30...
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);

  const colors = ["Black", "White", "Blue", "Red", "Green", "Silver", "Gold"];
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const discounts = [10, 20, 30, 40, 50];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const applyFilters = () => {
    onFilterChange({
      price: priceRange,
      colors: selectedColors,
      offer: offerOnly,
      category: selectedCategory === "All" ? "" : selectedCategory,
      discount: minDiscount,
      availability: excludeOutOfStock
    });
    setActiveDropdown(null);
  };
  
  const handleClear = () => {
      setPriceRange({ min: 0, max: 50000 });
      setSelectedColors([]);
      setOfferOnly(false);
      setSelectedCategory("");
      setMinDiscount(0);
      setExcludeOutOfStock(false);
      
      // Auto apply clear
      onFilterChange({
          price: { min: 0, max: 50000 },
          colors: [],
          offer: false,
          category: "",
          discount: 0,
          availability: false
      });
      setActiveDropdown(null);
  };

  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const btnStyle = (isActive) => ({
    padding: '8px 16px',
    background: isActive ? '#e5e7eb' : '#f3f4f6',
    border: isActive ? '1px solid #000' : '1px solid transparent',
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap',
    flexShrink: 0
  });

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    marginTop: 8,
    left: 0,
    marginLeft: 4, // Added margin from left
    background: 'white',
    // ...
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
    padding: 20,
    zIndex: 1000,
    width: 'min(320px, 92vw)',
    maxHeight: '70vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  };
  
  const sectionTitleStyle = {
      fontWeight: 700, 
      fontSize: 14, 
      marginBottom: 8,
      color: '#111827'
  };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', position: 'relative' }} ref={dropdownRef}>
      
      {/* ALL FILTERS BUTTON */}
       <button onClick={() => toggleDropdown('all')} style={{...btnStyle(activeDropdown === 'all'), background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
         <span style={{fontSize:16}}>🛠️</span> All Filters
       </button>

       {activeDropdown === 'all' && (
          <div style={dropdownStyle}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eee', paddingBottom:12 }}>
                <span style={{ fontWeight: 800, fontSize: 18 }}>Filter Products</span>
                <button onClick={() => setActiveDropdown(null)} style={{background:'none', border:'none', fontSize:20, cursor:'pointer'}}>×</button>
            </div>
            
            {/* CATEGORIES */}
            <div>
               <div style={sectionTitleStyle}>Category</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categories.map(cat => (
                     <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', padding:'4px 10px', background: selectedCategory === cat ? '#eff6ff' : '#f9fafb', border: selectedCategory === cat ? '1px solid #bfdbfe' : '1px solid #eee', borderRadius: 99 }}>
                       <input 
                         type="radio" 
                         name="all_filter_cat"
                         checked={selectedCategory === cat || (cat === 'All' && !selectedCategory)}
                         onChange={() => setSelectedCategory(cat === 'All' ? "" : cat)}
                         style={{display:'none'}}
                       />
                       <span style={{color: selectedCategory === cat ? '#1d4ed8' : '#374151', fontWeight: selectedCategory === cat ? 600 : 400}}>{cat}</span>
                     </label>
                  ))}
               </div>
            </div>

            {/* PRICE RANGE */}
            <div>
                <div style={sectionTitleStyle}>Price Range</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input 
                    type="number" 
                    value={priceRange.min} 
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={priceRange.max} 
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    placeholder="Max"
                  />
                </div>
            </div>

            {/* DISCOUNT */}
            <div>
                <div style={sectionTitleStyle}>Discount</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {discounts.map(d => (
                     <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="discount_radio"
                          checked={minDiscount === d}
                          onChange={() => setMinDiscount(d)}
                          style={{accentColor: '#111827'}}
                        />
                        {d}% or more
                     </label>
                  ))}
                   <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="discount_radio"
                          checked={minDiscount === 0}
                          onChange={() => setMinDiscount(0)}
                          style={{accentColor: '#111827'}}
                        />
                        Any
                     </label>
                </div>
            </div>

            {/* AVAILABILITY */}
            <div>
               <div style={sectionTitleStyle}>Availability</div>
               <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={excludeOutOfStock}
                    onChange={(e) => setExcludeOutOfStock(e.target.checked)}
                    style={{width:16, height:16, accentColor:'black'}}
                  />
                  Exclude Out of Stock
               </label>
            </div>

            {/* OFFER */}
            <div>
                <div style={sectionTitleStyle}>Offers</div>
                 <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={offerOnly}
                    onChange={(e) => setOfferOnly(e.target.checked)}
                    style={{width:16, height:16, accentColor:'black'}}
                  />
                  Show Special Offers Only
                </label>
            </div>

            {/* COLORS */}
            <div>
                <div style={sectionTitleStyle}>Colors</div>
                <div style={{ display: 'flex', flexWrap:'wrap', gap: 8 }}>
                  {colors.map(c => (
                    <div 
                       key={c} 
                       onClick={() => handleColorToggle(c)}
                       style={{ 
                         width: 24, 
                         height: 24, 
                         borderRadius: '50%', 
                         background: c.toLowerCase(), 
                         border: selectedColors.includes(c) ? '2px solid #000' : '1px solid #e5e7eb',
                         boxShadow: selectedColors.includes(c) ? '0 0 0 2px white inset' : 'none',
                         cursor: 'pointer'
                       }}
                       title={c}
                     />
                  ))}
                </div>
            </div>

            {/* ACTIONS */}
            <div style={{display:'flex', gap:12, marginTop:12, paddingTop:16, borderTop:'1px solid #eee'}}>
                <button 
                  onClick={handleClear}
                  style={{ flex:1, padding: '10px', background: 'white', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, fontWeight:600, cursor: 'pointer' }}
                >
                  Clear All
                </button>
                <button 
                  onClick={applyFilters}
                  style={{ flex:1, padding: '10px', background: '#111827', color: 'white', border: 'none', borderRadius: 8, fontWeight:600, cursor: 'pointer' }}
                >
                  Apply Filters
                </button>
            </div>
          </div>
       )}
    </div>
  );
}
