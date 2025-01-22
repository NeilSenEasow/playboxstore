import React, { useEffect, useRef, useState } from 'react';
import './GameSection.css';
import Game1 from '../../assets/games/Game1.png';
import Game2 from '../../assets/games/Game2.png';
import Game3 from '../../assets/games/Game3.png';
import Game4 from '../../assets/games/Game4.png';

export const games = [
  {
    id: 1,
    name: 'GOD OF WAR - PS4',
    price: '₹2,349.00',
    image: Game1,
  },
  {
    id: 2,
    name: 'GTA 5 PS5',
    price: '₹1,990.00',
    image: Game2,
  },
  {
    id: 3,
    name: 'GOD OF WAR - PS4',
    price: '₹2,349.00',
    image: Game3,
  },
  {
    id: 4,
    name: 'GTA 5 PS5',
    price: '₹1,990.00',
    image: Game4,
  },
];

const GamesSection = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

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
        Featured <span className="highlight">Games</span>
      </h2>
      <div className="games-grid">
        {games.map((game, index) => (
          <div 
            key={game.id}
            className="product-card"
            style={{ 
              animationDelay: `${index * 0.2}s`
            }}
          >
            <img 
              src={game.image} 
              alt={game.name} 
              className="product-image"
            />
            <h3 className="product-name">
              {game.name}
            </h3>
            <p className="product-price">
              <span className="highlight">{game.price}</span>
            </p>
            <div className="product-buttons">
              <button className="btn-secondary">
                View More
              </button>
              <button 
                className="btn-primary"
                onClick={() => updateCartCount(game)}
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesSection;
