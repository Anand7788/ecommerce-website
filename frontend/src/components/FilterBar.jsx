import React, { useState, useRef, useEffect } from 'react';

export default function FilterBar({ onFilterChange, products = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'price', 'color', 'offer', 'all', 'category'
  const dropdownRef = useRef(null);

  // Local state needs to include category if we want to manage it here, but simplest is to fire onFilterChange directly for category.
  // Ideally, FilterBar should receive `activeFilters` as prop to show checked state, but refactoring that is larger.
  // I will assume `products` is passed.
  // I will add a local `selectedCategory` state or just use `onFilterChange` arguments if I can access current filters.
  // Issue: `onFilterChange` in Home.jsx sets `activeFilters`. FilterBar current implementation keeps its OWN local state `priceRange`, `selectedColors`, etc. and sends them up.
  // I need to add `selectedCategory` to FilterBar's local state to persist it.
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [offerOnly, setOfferOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Add this

  const colors = ["Black", "White", "Blue", "Red", "Green", "Silver", "Gold"];

  // Close dropdown when clicking outside
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
      category: selectedCategory
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

  // Styles
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
    top: '120%',
    left: 0,
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: 16,
    zIndex: 100,
    minWidth: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', width: '100%' }} ref={dropdownRef}>
      


      {/* CATEGORY FILTER */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => toggleDropdown('category')} style={btnStyle(activeDropdown === 'category')}>
          Category {activeDropdown === 'category' ? '▲' : '▼'}
        </button>
        {activeDropdown === 'category' && (
           <div style={dropdownStyle}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Select Category</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="cat_filter"
                      checked={!selectedCategory} 
                      onChange={() => {
                          setSelectedCategory("");
                          onFilterChange({
                              price: priceRange,
                              colors: selectedColors,
                              offer: offerOnly,
                              category: ""
                          });
                          setActiveDropdown(null);
                      }}
                    />
                    All
                 </label>
                 {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="cat_filter"
                        checked={selectedCategory === cat}
                        onChange={() => {
                            setSelectedCategory(cat);
                            onFilterChange({
                                price: priceRange,
                                colors: selectedColors,
                                offer: offerOnly,
                                category: cat
                            });
                            setActiveDropdown(null);
                        }}
                      />
                      {cat}
                    </label>
                 ))}
              </div>
           </div>
        )}
      </div>



      {/* OFFER FILTER */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => toggleDropdown('offer')} style={btnStyle(activeDropdown === 'offer')}>
          Offer {offerOnly ? '•' : ''} <span style={{ fontSize: 10 }}>▼</span>
        </button>
        {activeDropdown === 'offer' && (
          <div style={dropdownStyle}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={offerOnly}
                onChange={(e) => setOfferOnly(e.target.checked)}
              />
              Show only items on offer
            </label>
            <button 
              onClick={applyFilters}
              style={{ padding: '8px', background: '#000', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 8 }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* ALL FILTERS */}
      <div style={{ position: 'relative' }}>
       <button onClick={() => toggleDropdown('all')} style={{...btnStyle(activeDropdown === 'all'), background: '#e5e7eb'}}>
         All Filters ⚙️
       </button>
       {activeDropdown === 'all' && (
          <div style={{...dropdownStyle, width: '90vw', maxWidth: 320, right: 0, left: 'auto'}}>
            <div style={{ fontWeight: 600, fontSize: 16, borderBottom:'1px solid #eee', paddingBottom:8 }}>All Filters</div>
            
            {/* Price Section */}
            <div style={{marginBottom:8}}>
                <div style={{fontWeight:600, fontSize:14, marginBottom:4}}>Price Range</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input 
                    type="number" 
                    value={priceRange.min} 
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    style={{ width: '100%', padding: 6, border: '1px solid #ccc', borderRadius: 4 }}
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={priceRange.max} 
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    style={{ width: '100%', padding: 6, border: '1px solid #ccc', borderRadius: 4 }}
                    placeholder="Max"
                  />
                </div>
            </div>

            {/* Colors Section */}
            <div style={{marginBottom:8}}>
                <div style={{fontWeight:600, fontSize:14, marginBottom:4}}>Colors</div>
                <div style={{ display: 'flex', flexWrap:'wrap', gap: 6 }}>
                  {colors.map(c => (
                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer', background: selectedColors.includes(c) ? '#f3f4f6' : 'transparent', padding:'2px 6px', borderRadius:4, border: '1px solid #eee' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedColors.includes(c)}
                        onChange={() => handleColorToggle(c)}
                        style={{display:'none'}}
                      />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.toLowerCase(), border: '1px solid #ddd' }}></div>
                      <span style={{fontWeight: selectedColors.includes(c) ? 600 : 400}}>{c}</span>
                    </label>
                  ))}
                </div>
            </div>

            {/* Offer Section */}
            <div style={{marginBottom:8}}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={offerOnly}
                    onChange={(e) => setOfferOnly(e.target.checked)}
                  />
                  Show only items on offer
                </label>
            </div>

            {/* Actions */}
            <div style={{display:'flex', gap:8, marginTop:8, paddingTop:8, borderTop:'1px solid #eee'}}>
                <button 
                  onClick={() => {
                      setPriceRange({ min: 0, max: 50000 });
                      setSelectedColors([]);
                      setOfferOnly(false);
                      // Optionally auto-apply or let user click apply
                  }}
                  style={{ flex:1, padding: '8px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}
                >
                  Clear
                </button>
                <button 
                  onClick={applyFilters}
                  style={{ flex:1, padding: '8px', background: '#000', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  Apply Filters
                </button>
            </div>
          </div>
       )}
      </div>

    </div>
  );
}
