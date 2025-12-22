
import React from 'react';

export default function Hero() {
  return (
    <div className="hero-section" style={{
      background: '#fbf0e4', // Beige background
      borderRadius: 12,
      padding: '40px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 300,
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 40
    }}>
      {/* Text Content */}
      <div style={{ zIndex: 10, maxWidth: 500 }}>
        <h1 className="hero-title" style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#003d29',
          lineHeight: 1.1,
          marginBottom: 24
        }}>
          Grab Upto 50 to 80 % Off On Selected Products
        </h1>
        <button style={{
          background: '#003d29',
          color: 'white',
          border: 'none',
          padding: '12px 32px',
          borderRadius: 99,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Buy Now
        </button>
      </div>

      {/* Image (Model) */}
      <div className="hero-image" style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: '110%', 
        width: '50%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}>
        {/* Placeholder for the model image from reference */}
        <img 
          src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=1000&auto=format&fit=crop" 
          alt="Headphones Model"
          style={{
            height: '100%',
            objectFit: 'contain',
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' // Soft bottom fade
          }}
        />
      </div>
    </div>
  );
}
