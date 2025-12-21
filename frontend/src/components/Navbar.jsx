// src/components/Navbar.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, fetchProducts } from "../api/api";
import Logo from "./Logo";
import "../styles/Navbar.css";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  


  // fetch cart count
  const loadCart = useCallback(async () => {
    try {
      const cart = await getCart();
      const count =
        cart && cart.items
          ? cart.items.reduce((s, i) => s + (i.quantity || 0), 0)
          : 0;
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // sync token when localStorage changes (other tabs)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "token") setToken(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // refresh token on mount (in case login happened)
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // listen for custom authChange event dispatched after login/logout
  useEffect(() => {
    function handleAuthChange() {
      const t = localStorage.getItem("token");
      setToken(t);
      // reload cart for guest/user change
      loadCart();
    }
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [loadCart]);

  // logout handler
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_name");
    window.dispatchEvent(new Event("authChange"));
    setToken(null);
    setTimeout(() => {
      navigate("/");
      loadCart();
    }, 50);
  }

  // mobile toggle
  function toggleMobile() {
    setMobileOpen((v) => !v);
  }



  // close mobile menu on navigation (helper)
  function closeMobile() {
    setMobileOpen(false);
  }

  // whenever theme changes, apply class to <body> and save to localStorage
// Ensure any stale dark-theme class is removed
  useEffect(() => {
    document.body.classList.remove('dark-theme');
    localStorage.removeItem('theme');
  }, []);

const [searchQuery, setSearchQuery] = useState("");
const [allProducts, setAllProducts] = useState([]);
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

// Load all products for autocomplete
useEffect(() => {
  fetchProducts().then(data => {
      const list = Array.isArray(data) ? data : data.products || [];
      setAllProducts(list);
  }).catch(console.error);
}, []);

const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  if(query.trim().length > 0) {
      const lower = query.toLowerCase();
      const filtered = allProducts.filter(p => p.name.toLowerCase().includes(lower)).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
  } else {
      setShowSuggestions(false);
  }
};

const handleSearchSubmit = () => {
  setShowSuggestions(false);
  if (searchQuery.trim()) {
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  } else {
    navigate('/');
  }
};

const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
    navigate(`/?search=${encodeURIComponent(productName)}`);
};


  return (
    <header className="navbar-shopcart">
      <div className="nav-inner">
        {/* LEFT: Logo */}
        <div className="nav-left">
          <Link to="/" className="brand">
             {/* Animated Logo */}
             <div style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
                <Logo width={40} height={40} />
             </div>
             <span className="brand-text brand-gradient">Shopperspoint</span>
          </Link>
        </div>

        {/* CENTER LEFT: Nav Links */}
        <nav className="nav-links desktop-only">
          <div className="nav-item dropdown-container">
             <Link to="/" style={{color:'inherit', textDecoration:'none'}}>Categories <span style={{fontSize:10}}>▼</span></Link>
             <div className="dropdown-menu">
                <Link to="/" className="dropdown-item">All</Link>
                {/* Dynamically distinct categories */}
                {[...new Set(allProducts.map(p => p.category).filter(Boolean))].map(cat => (
                   <Link key={cat} to={`/?category=${encodeURIComponent(cat)}`} className="dropdown-item">{cat}</Link>
                ))}
             </div>
          </div>
          <Link to="/?filter=deals" className="nav-item">Deals</Link>
          <Link to="/?sort=newest" className="nav-item">What's New</Link>
          <Link to="/orders" className="nav-item">Delivery</Link>
        </nav>

        {/* CENTER RIGHT: Search Bar */}
        <div className="nav-search" style={{position:'relative'}}>
          <input 
            type="text" 
            placeholder="Search Product" 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
          />
          <svg 
            className="search-icon" 
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            onClick={handleSearchSubmit}
            style={{cursor:'pointer'}}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  marginTop: 4,
                  zIndex: 1000,
                  overflow: 'hidden'
              }}>
                  {suggestions.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => handleSuggestionClick(p.name)}
                        style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontSize: 14,
                            color: '#333',
                            borderBottom: '1px solid #f9f9f9'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                          {p.name}
                      </div>
                  ))}
              </div>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="nav-actions">
           {/* Account Dropdown */}
           <div className="action-item dropdown-container">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             <span>Account</span>
             
             {/* Dropdown Menu */}
             <div className="dropdown-menu">
               {token ? (
                  <>
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    <Link to="/orders" className="dropdown-item">My Orders</Link>
                    <button onClick={logout} className="dropdown-item logout-btn">Logout</button>
                  </>
               ) : (
                 <>
                   <Link to="/login?mode=login" className="dropdown-item">Login</Link>
                   <Link to="/login?mode=signup" className="dropdown-item">Sign Up</Link>
                 </>
               )}
             </div>
           </div>

           {/* Cart */}
           <Link to="/cart" className="action-item">
             <div style={{position:'relative'}}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               {cartCount > 0 && (
                 <span style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#ff6f00',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 'bold',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                 }}>
                   {cartCount}
                 </span>
               )}
             </div>
             <span>Cart</span>
           </Link>
        </div>
      </div>
    </header>
  );
}
