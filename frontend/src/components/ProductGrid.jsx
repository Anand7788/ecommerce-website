import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../api/api";
import "../styles/ProductCard.css";
import ShopCard from "./ShopCard";

export default function ProductGrid({ products, loading, onAdded, wishlistIds = [] }) {
  if (loading) {
    return (
      <div style={{padding:'20px 0'}}>Loading...</div>
    );
  }

  if (!products || products.length === 0) {
    return <div style={{padding:'20px 0'}}>No products found.</div>;
  }

  return (
    <div className="shopcart-grid">
      {products.map((p) => (
        <ShopCard 
            key={p.id} 
            p={p} 
            onAdded={onAdded} 
            initialInWishlist={wishlistIds.includes(p.id)}
        />
      ))}
    </div>
  );
}

