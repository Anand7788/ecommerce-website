// src/components/Navbar.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../api/api";
import Logo from "../assets/logo.svg";

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
    <header
      className="navbar-modern"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-inner">
        <div className="nav-left">
          {/* hamburger button on the far left */}
          <button
            className="mobile-toggle"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ marginRight: 12 }}
          >
            <svg
              width="22"
              height="14"
              viewBox="0 0 22 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                y="1"
                width="22"
                height="2"
                rx="1"
                fill="#111827"
                opacity="0.85"
              />
              <rect
                y="6"
                width="22"
                height="2"
                rx="1"
                fill="#111827"
                opacity="0.85"
              />
              <rect
                y="11"
                width="22"
                height="2"
                rx="1"
                fill="#111827"
                opacity="0.85"
              />
            </svg>
          </button>

          {/* gradient logo */}
          <Link
            to="/"
            className="brand"
            onClick={closeMobile}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={Logo}
              alt="ShoppersPoint Logo"
              style={{
                width: 36,
                height: 36,
                marginRight: 10,
                borderRadius: 8,
              }}
            />
            <span className="brand-text">ShoppersPoint</span>
          </Link>
        </div>

        <nav
          className={`nav-right ${mobileOpen ? "open" : ""}`}
          aria-label="Primary"
        >
          {/* Theme toggle */}
          <button
            type="button"
            className="theme-toggle"
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            <span aria-hidden="true" className="theme-toggle-icon">
              {theme === "light" ? "🌙" : "☀️"}
            </span>
            <span className="theme-toggle-label">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>
          {/* Cart */}
          <Link
            to="/cart"
            className="nav-link"
            onClick={closeMobile}
            aria-label="Cart"
          >
            <span className="nav-icon" aria-hidden="true">
              {/* cart SVG */}
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
              </svg>
            </span>
            <span className="nav-label">Cart</span>
            {cartCount > 0 && (
              <span className="nav-badge" aria-live="polite">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="nav-link"
            onClick={closeMobile}
            aria-label="Orders"
          >
            <span className="nav-icon" aria-hidden="true">
              {/* box icon */}
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73L12 3 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 21l8-3.27A2 2 0 0 0 21 16z" />
                <path d="M12 3v9" />
              </svg>
            </span>
            <span className="nav-label">Orders</span>
          </Link>

          {/* Login / Logout */}
          {token ? (
            <button
              className="nav-btn logout"
              onClick={() => {
                logout();
                closeMobile();
              }}
              aria-label="Logout"
            >
              <span className="nav-icon" aria-hidden="true">
                {/* logout icon */}
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </span>
              <span className="nav-label">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="nav-btn login"
              onClick={closeMobile}
              aria-label="Login"
            >
              <span className="nav-icon" aria-hidden="true">
                {/* login icon */}
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17L15 12 10 7" />
                  <path d="M15 12H3" />
                </svg>
              </span>
              <span className="nav-label">Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
