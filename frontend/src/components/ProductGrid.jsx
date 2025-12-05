import React from 'react';
import ProductCard from './ProductCard';
import LoadingSkeleton from './LoadingSkeleton';

export default function ProductGrid({ products, loading, onAdded }) {
  if (loading) return <LoadingSkeleton rows={8} />;

  if (!products || products.length === 0) {
    return <div className="container"><h2>No products found</h2></div>;
  }

  return (
    <div className="container">
      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAdded={onAdded} />
        ))}
      </div>
    </div>
  );
}
