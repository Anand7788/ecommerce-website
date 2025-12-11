// src/components/ProductGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../api/api";

export default function ProductGrid({ products, loading, onAdded }) {
  if (loading) {
    return (
      <div className="container">
        <div className="product-grid-modern">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="product-card-modern skeleton-card">
              <div className="product-image-box skeleton-block" />
              <div className="skeleton-line skeleton-line-lg" />
              <div className="skeleton-line skeleton-line-sm" />
              <div className="skeleton-line skeleton-line-sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container">
        <p style={{ color: "#6b7280" }}>No products found.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-grid-modern">
        {products.map((p) => (
          <div key={p.id} className="product-card-modern">
            {/* Image */}
            <div className="product-image-box">
              <img src={p.image_url} alt={p.name} />
              {/* Fake discount tag just for UI feel */}
              <span className="discount-badge">Best Seller</span>
            </div>

            {/* Content */}
            <h3 className="product-title">{p.name}</h3>
            <p className="product-desc">
              {p.description ? `${p.description.slice(0, 50)}...` : "Popular product"}
            </p>

            {/* Price */}
            <div className="price-row">
              <span className="price">₹{p.price}</span>
              {/* Optional fake MRP for look */}
              {/* <span className="mrp">₹{(p.price * 1.3).toFixed(0)}</span> */}
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button
                className="btn-primary"
                onClick={async () => {
                  await addToCart(p.id, 1);
                  if (onAdded) onAdded();
                }}
              >
                Add to Cart
              </button>
              <Link to={`/products/${p.id}`} className="btn-outline">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
