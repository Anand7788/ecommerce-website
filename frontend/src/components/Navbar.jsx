// src/components/Navbar.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../api/api";
// Logo import removed (using SVG now)

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState(() => {
  // 1) If user chose a theme earlier, use that
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;

  // 2) Otherwise, follow system preference
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  // 3) Fallback
  return 'light';
});

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
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [loadCart]);

  // logout handler
  function logout() {
    localStorage.removeItem("token");
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

  function toggleTheme() {
  setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
}

  // close mobile menu on navigation (helper)
  function closeMobile() {
    setMobileOpen(false);
  }

  // whenever theme changes, apply class to <body> and save to localStorage
useEffect(() => {
  const body = document.body;

  if (theme === 'dark') {
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
  }

  localStorage.setItem('theme', theme);
}, [theme]);


  return (
    <header className="navbar-shopcart">
      <div className="nav-inner">
        {/* LEFT: Logo */}
        <div className="nav-left">
          <Link to="/" className="brand">
             {/* Shopcart Icon (Simple representation) */}
             <div style={{ position:'relative', marginRight:8 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003d29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {/* Orange accent dot/fruit */}
                <div style={{position:'absolute', top:-2, right:-2, width:10, height:10, background:'#ff6f00', borderRadius:'50%'}}></div>
             </div>
             <span className="brand-text" style={{color:'#003d29', fontSize:22, fontWeight:800}}>Shopperspoint</span>
          </Link>
        </div>

        {/* CENTER LEFT: Nav Links */}
        <nav className="nav-links desktop-only">
          <Link to="/" className="nav-item">Categories <span style={{fontSize:10}}>▼</span></Link>
          <Link to="/" className="nav-item">Deals</Link>
          <Link to="/" className="nav-item">What's New</Link>
          <Link to="/orders" className="nav-item">Delivery</Link>
        </nav>

        {/* CENTER RIGHT: Search Bar */}
        <div className="nav-search">
          <input type="text" placeholder="Search Product" />
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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
                   <Link to="/orders" className="dropdown-item">My Orders</Link>
                   <button onClick={logout} className="dropdown-item logout-btn">Logout</button>
                 </>
               ) : (
                 <>
                   <Link to="/login" className="dropdown-item">Login</Link>
                   <Link to="/login" className="dropdown-item">Sign Up</Link>
                 </>
               )}
             </div>
           </div>

           {/* Cart */}
           <Link to="/cart" className="action-item">
             <div style={{position:'relative'}}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               {cartCount > 0 && <span className="cart-badge-dot"></span>}
             </div>
             <span>Cart</span>
           </Link>
        </div>
      </div>
    </header>
  );
}
