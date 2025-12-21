import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProduct, addToCart } from "../api/api";
import "../styles/ProductDetails.css"; // We will likely deprecate this in favor of index.css global styles, but keeping for now.

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("red");
  
  // Mock images for gallery (since backend only provides one)
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetchProduct(id).then((data) => {
      setProduct(data);
      setMainImage(data?.image_url);
      setLoading(false);
    });
  }, [id]);

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    navigate("/cart");
  };

  if (loading || !product) {
    return <div className="p-details-loading">Loading...</div>;
  }

  // Mock colors
  const colors = [
    { id: "red", hex: "#ecaea9" },
    { id: "black", hex: "#1f2937" },
    { id: "green", hex: "#d1fae5" },
    { id: "silver", hex: "#f3f4f6" },
    { id: "blue", hex: "#e0f2fe" },
  ];

  return (
    <div className="container product-details-page">
      {/* Breadcrumbs */}
      <div className="p-breadcrumbs">
        <Link to="/">Electronics</Link> / <Link to="/">Audio</Link> / <Link to="/">Headphones</Link> / <span>{product.name}</span>
      </div>

      <div className="p-details-grid">
        {/* LEFT: GALLERY */}
        <div className="p-gallery">
          <div className="p-main-image-box">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="p-main-img" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600?text=No+Image'; }}
              />
          </div>
          <div className="p-thumbnails">
             {/* Simulating multiple images by repeating the main one */}
             {[1,2,3,4].map((_, idx) => (
                <div 
                  key={idx} 
                  className={`p-thumb-box ${mainImage === product.image_url ? 'active' : ''}`}
                  onClick={() => setMainImage(product.image_url)}
                >
                   <img 
                     src={product.image_url} 
                     alt="thumb" 
                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                   />
                </div>
             ))}
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div className="p-info">
          <h1 className="p-title">{product.name}</h1>
          <p className="p-subtitle">
            A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods.
          </p>

          <div className="p-rating">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="16" height="16" fill="#059669" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
            <span>(121)</span>
          </div>

          <div className="p-price-box">
            <span className="p-price">₹{Math.floor(product.price).toLocaleString()}</span>
            <span className="p-installment"> or 99.99/month</span>
          </div>
          <p className="p-financing">Suggested payments with 6 months special financing</p>

          {/* Color Selector */}
          <div className="p-selector">
            <h4>Choose a Color</h4>
            <div className="p-colors">
              {colors.map((c) => (
                <div
                  key={c.id}
                  className={`p-color-swatch ${selectedColor === c.id ? "selected" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.id)}
                />
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="p-actions-row">
            {/* Quantity */}
            <div className="p-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <div className="p-stock-info">
               Only <span style={{color:'#d97706', fontWeight:'bold'}}>12 Items</span> Left!<br/>
               Don't miss it
            </div>
          </div>

          <div className="p-buttons">
            <button className="btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
            <button 
              className="btn-add-cart"
              onClick={() => addToCart(product.id, quantity)}
            >
              Add to Cart
            </button>
          </div>

          {/* Info Cards */}
          <div className="p-info-cards">
            <div className="p-info-card">
               <div className="p-icon-box">📦</div>
               <div>
                 <h5>Free Delivery</h5>
                 <a href="#">Enter your Postal code for Delivery Availability</a>
               </div>
            </div>
            <div className="p-info-card">
               <div className="p-icon-box">📅</div>
               <div>
                 <h5>Return Delivery</h5>
                 <p>Free 30days Delivery Returns. <a href="#">Details</a></p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

