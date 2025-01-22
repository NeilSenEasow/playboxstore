import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import GameCarousel from './components/Carousel/Carousel';
import ProductSection from './components/ProductSection/ProductSection';
import GamesSection from './components/GameSection/GameSection';
import Banner from './components/Banner/Banner';
import Highlights from './components/Highlights/Highlights';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import Buy from './components/Buy/Buy';
import Sell from './components/Sell/Sell';
import Rent from './components/Rent/Rent';
import Checkout from './components/Checkout/Checkout';
import SearchResults from './components/SearchResults/SearchResults';
import { products } from './components/ProductSection/ProductSection';
import { games } from './components/GameSection/GameSection';
import { buyItems } from './components/Buy/Buy';
import { rentItems } from './components/Rent/Rent';
import { sellItems } from './components/Sell/Sell';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  // Combine all products from different sections
  const allProducts = [
    ...products,  // from ProductSection
    ...games,     // from GameSection
    ...buyItems,  // from Buy
    ...rentItems, // from Rent
    ...sellItems  // from Sell
  ];

  const updateCartCount = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <Router>
      <div>
        <Navbar cartCount={cartItems.length} onSearch={handleSearch} />
        <SearchResults results={searchResults} updateCartCount={updateCartCount} />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <GameCarousel />
              <ProductSection updateCartCount={updateCartCount} />
              <GamesSection updateCartCount={updateCartCount} />
              <Banner />
              <Highlights />
            </>
          } />
          <Route path="/sell" element={<Sell updateCartCount={updateCartCount} />} />
          <Route path="/buy" element={<Buy updateCartCount={updateCartCount} />} />
          <Route path="/rent" element={<Rent updateCartCount={updateCartCount} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
