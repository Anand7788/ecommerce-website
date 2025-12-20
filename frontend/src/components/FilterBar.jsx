import React, { useState, useRef, useEffect } from 'react';

export default function FilterBar({ onFilterChange }) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'price', 'color', 'offer', 'all'
  const dropdownRef = useRef(null);

  // Local state for filters
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [offerOnly, setOfferOnly] = useState(false);

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
      offer: offerOnly
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
    gap: 4,
    cursor: 'pointer',
    position: 'relative'
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
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }} ref={dropdownRef}>
      
      {/* PRICE FILTER */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => toggleDropdown('price')} style={btnStyle(activeDropdown === 'price')}>
          Price {priceRange.min > 0 || priceRange.max < 50000 ? '•' : ''} <span style={{ fontSize: 10 }}>▼</span>
        </button>
        {activeDropdown === 'price' && (
          <div style={dropdownStyle}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Price Range</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="number" 
                value={priceRange.min} 
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                style={{ width: 70, padding: 4, border: '1px solid #ccc', borderRadius: 4 }}
                placeholder="Min"
              />
              <span>to</span>
              <input 
                type="number" 
                value={priceRange.max} 
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                style={{ width: 70, padding: 4, border: '1px solid #ccc', borderRadius: 4 }}
                placeholder="Max"
              />
            </div>
            <button 
              onClick={applyFilters}
              style={{ padding: '8px', background: '#000', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 8 }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* COLOR FILTER */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => toggleDropdown('color')} style={btnStyle(activeDropdown === 'color')}>
          Color {selectedColors.length > 0 ? `(${selectedColors.length})` : ''} <span style={{ fontSize: 10 }}>▼</span>
        </button>
        {activeDropdown === 'color' && (
          <div style={dropdownStyle}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Select Color</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
              {colors.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedColors.includes(c)}
                    onChange={() => handleColorToggle(c)}
                  />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.toLowerCase(), border: '1px solid #ddd' }}></div>
                  {c}
                </label>
              ))}
            </div>
            <button 
              onClick={applyFilters}
              style={{ padding: '8px', background: '#000', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 8 }}
            >
              Apply
            </button>
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
          <div style={{...dropdownStyle, width: 300}}>
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
