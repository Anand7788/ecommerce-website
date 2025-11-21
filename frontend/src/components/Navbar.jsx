import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../api/api";
import { FiShoppingCart, FiBox, FiLogOut, FiLogIn } from "react-icons/fi";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  async function loadCart() {
    try {
      const cart = await getCart();
      setCartCount(cart.items?.length || 0);
    } catch {}
  }

  useEffect(() => {
    if (token) loadCart();
  }, [token]);

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  const logoUrl = "/logo.png";


  return (
    <nav className="navbar-modern">
      <div className="nav-inner">
        <div className="brand" onClick={() => navigate("/")}>
          ShoppersPoint
        </div>

        <div className="nav-right">

          <Link to="/cart" className="nav-item">
            <FiShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>

          <Link to="/orders" className="nav-item">
            <FiBox size={18} />
            <span>Orders</span>
          </Link>

          {/* Login / Logout */}
          {token ? (
            <button className="nav-btn logout" onClick={logout}>
              <FiLogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              className="nav-btn login"
              onClick={() => navigate("/login")}
            >
              <FiLogIn size={18} />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
