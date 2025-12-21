import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import "../styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand + description */}
        <div className="footer-column">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Logo Icon Removed */}
            <span className="footer-brand-text brand-gradient">ShopNow</span>
          </div>
          <p className="footer-text">
            Simple, modern ecommerce demo built with React & Ruby on Rails –
            browse products, manage your cart, and place orders end-to-end.
          </p>
        </div>

        {/* Quick links */}
        <div className="footer-column">
          <h4 className="footer-title">Quick links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home / Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/login">Login / Signup</Link></li>
          </ul>
        </div>

        {/* Tech / project info */}
        <div className="footer-column">
          <h4 className="footer-title">Tech stack</h4>
          <ul className="footer-tags">
            <li>React</li>
            <li>Vite</li>
            <li>Ruby on Rails API</li>
            <li>PostgreSQL</li>
            <li>Netlify & Render</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} ShopNow. All rights reserved.</span>
        <span className="footer-bottom-right">
          Built as a portfolio project. <span className="footer-note">Not a real e-commerce site.</span>
        </span>
      </div>
    </footer>
  );
}
