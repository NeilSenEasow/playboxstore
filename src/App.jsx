import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import RentDetails from './components/RentDetails/RentDetails';
import Payment from './components/Payment/Payment';
import Admin from './components/Admin/Admin';
import './App.css';

function App() {
  // Initialize state from localStorage or default values
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [searchResults, setSearchResults] = useState([]);
  const [userPreferences, setUserPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      recentSearches: [],
      viewedItems: [],
      lastVisit: new Date().toISOString()
    };
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save user preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const allProducts = [
    ...products,
    ...games,
    ...Object.values(buyItems).flat(),
    ...rentItems,
    ...sellItems
  ];

  const updateCartCount = (item) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems, item];
      return newItems;
    });
    
    // Update viewed items in user preferences
    setUserPreferences(prev => ({
      ...prev,
      viewedItems: [...new Set([...prev.viewedItems, item.id])].slice(-10) // Keep last 10 items
    }));
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

    // Save recent searches
    setUserPreferences(prev => ({
      ...prev,
      recentSearches: [...new Set([query, ...prev.recentSearches])].slice(0, 5) // Keep last 5 searches
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearUserData = () => {
    localStorage.clear();
    setCartItems([]);
    setUserPreferences({
      recentSearches: [],
      viewedItems: [],
      lastVisit: new Date().toISOString()
    });
  };

  // Update last visit timestamp
  useEffect(() => {
    setUserPreferences(prev => ({
      ...prev,
      lastVisit: new Date().toISOString()
    }));
  }, []);

  return (
    <Router>
      <div>
        <Navbar 
          cartCount={cartItems.length} 
          onSearch={handleSearch}
          recentSearches={userPreferences.recentSearches}
        />
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
          <Route path="/rent/:id" element={<RentDetails updateCartCount={updateCartCount} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} clearCart={clearCart} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} userPreferences={userPreferences} />} />
          <Route path="/payment" element={<Payment cartItems={cartItems} clearCart={clearCart} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
