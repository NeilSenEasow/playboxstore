import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackImage = 'https://placehold.co/300x200/1a1a1a/ff4747?text=Gaming';

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="product-card-main">
      <div className="image-container">
        {isLoading && <div className="loading-spinner"></div>}
        <img 
          src={imageError ? fallbackImage : product.image} 
          alt={product.name} 
          className={`product-image ${isLoading ? 'loading' : ''}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
      <h3 className="product-name">
        {product.name.split(' ')[0]} 
        <span className="highlight">
          {product.name.split(' ').slice(1).join(' ')}
        </span>
      </h3>
      <p className="product-price">
        <span className="highlight">
          ₹{product.price.toLocaleString()}
          {product.rentPrice && '/day'}
        </span>
      </p>
      {product.condition && (
        <p className="product-condition">
          Condition: <span className="highlight">{product.condition}</span>
        </p>
      )}
      <div className="product-buttons">
        <button 
          className="btn-primary"
          onClick={() => onAddToCart({ ...product, id: product._id })}
        >
          Add To Cart
        </button>
        {/* <button className="btn-secondary">
          View More
        </button> */}
      </div>
    </div>
  );
};

export default ProductCard; 