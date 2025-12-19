import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/api";
import ProductGrid from "../components/ProductGrid";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import "../styles/home-filters.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      const list = Array.isArray(data) ? data : data.products || [];
      setProducts(list);
      setFilteredProducts(list); // ✅ IMPORTANT
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <h2>Products For You</h2>

        <SortBar
          products={filteredProducts}
          setProducts={setFilteredProducts}
        />
      </div>

      {/* Content */}
      <div className="home-content">
        <Filters products={products} setFiltered={setFilteredProducts} />
          
        <div className="product-grid-wrapper">
        <ProductGrid
            products={filteredProducts}
            loading={loading}
          />
        </div>  
      </div>
    </div>
  );
}
