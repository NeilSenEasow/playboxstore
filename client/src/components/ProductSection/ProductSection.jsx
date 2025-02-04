import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSection.css';

const ProductSection = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products/category/Consoles`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasAnimated) {
            setHasAnimated(true);
          }
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div 
      className={`product-section ${isVisible ? 'animate-section' : ''}`} 
      ref={sectionRef}
    >
      <h2 className="section-title">
        Explore Our <span className="highlight">Consoles</span>
      </h2>
      <div className={`products-grid ${isLoading ? 'loading' : ''}`}>
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          Array.isArray(products) && products.map((product, index) => (
            <ProductCard 
              key={product.id || index}
              product={product}
              onAddToCart={updateCartCount}
              style={{ 
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductSection;