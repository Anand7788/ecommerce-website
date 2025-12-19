import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct, addToCart } from "../api/api";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  if (!product) {
    return <div className="container">Loading product...</div>;
  }

  function checkDelivery() {
    if (pincode.length === 6) {
      setDeliveryMsg("✅ Delivery available in 2–4 days");
    } else {
      setDeliveryMsg("❌ Enter a valid 6-digit pincode");
    }
  }

  return (
    <div className="container product-details-page">
      {/* TOP SECTION */}
      <div className="product-details-top">
        {/* IMAGE */}
        <div className="product-image-box">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-main-image"
          />
        </div>

        {/* INFO */}
        <div className="product-info-box">
          <h1>{product.name}</h1>
          <p className="product-desc">{product.description}</p>

          <div className="price-row">
            <span className="price">₹{product.price}</span>
            <span className="rating">⭐ 4.3</span>
          </div>

          <button
            className="add-cart-btn"
            onClick={() => addToCart(product.id, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* DELIVERY CHECK */}
      <div className="delivery-box">
        <h3>Check Delivery</h3>
        <div className="delivery-input">
          <input
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button onClick={checkDelivery}>Check</button>
        </div>
        {deliveryMsg && <p className="delivery-msg">{deliveryMsg}</p>}
      </div>

      {/* SPECIFICATIONS */}
      <div className="product-section">
        <h2>Specifications</h2>
        <ul className="spec-list">
          <li><strong>Category:</strong> Accessories</li>
          <li><strong>Warranty:</strong> 1 Year</li>
          <li><strong>Delivery:</strong> Free Delivery</li>
        </ul>
      </div>

      {/* WARRANTY & POLICY */}
      <div className="product-section">
        <h2>Warranty & Policy</h2>
        <p>✔ 7-day replacement policy</p>
        <p>✔ 1 year manufacturer warranty</p>
        <p>✔ Secure packaging</p>
      </div>

      {/* FAQ */}
      <div className="product-section">
        <h2>FAQs</h2>

        <details>
          <summary>Is this product returnable?</summary>
          <p>Yes, within 7 days of delivery.</p>
        </details>

        <details>
          <summary>Is warranty included?</summary>
          <p>Yes, 1 year manufacturer warranty.</p>
        </details>
      </div>
    </div>
  );
}

