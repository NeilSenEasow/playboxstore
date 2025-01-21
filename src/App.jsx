import React, { useState } from 'react';
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

// Placeholder components for new routes
const Sell = () => <div>Sell Page</div>;
const Buy = () => <div>Buy Page</div>;
const Rent = () => <div>Rent Page</div>;

function App() {
  const [cartItems, setCartItems] = useState([]);

  const updateCartCount = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <Router>
      <div>
        <Navbar cartCount={cartItems.length} />
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
          <Route path="/sell" element={<Sell />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
