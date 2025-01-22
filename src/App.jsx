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
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const updateCartCount = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleSearch = (query) => {
    // Implement search logic here
    // For example, filter items from a list of products
    const results = []; // Replace with actual search logic
    // setSearchResults(results);
  };

  return (
    <Router>
      <div>
        <Navbar cartCount={cartItems.length} onSearch={handleSearch} />
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
          <Route path="/cart" element={<Cart cartItems={cartItems} />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
