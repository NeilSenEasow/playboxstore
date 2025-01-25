import React from "react";
import "./SearchResults.css"

import './SearchResults.css';

const SearchResults = ({ results, updateCartCount }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      <div className="results-grid">
        {results.map((item) => (
          <div key={item.id} className="result-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            <button 
              onClick={() => updateCartCount(item)}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
