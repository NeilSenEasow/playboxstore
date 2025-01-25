import React, { useState, useEffect, useMemo } from 'react';
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
import RentDetails from './components/RentDetails/RentDetails';
import Payment from './components/Payment/Payment';
import Admin from './components/Admin/Admin';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import './App.css';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [searchResults, setSearchResults] = useState([]);
  const [backendData, setBackendData] = useState(null);
  const [userPreferences, setUserPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      recentSearches: [],
      viewedItems: [],
      lastVisit: new Date().toISOString()
    };
  });

  const [storeData, setStoreData] = useState({
    featured: [],
    products: [],
    games: [],
    rentItems: [],
    sellItems: []
  });

  // Fetch data from backend
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL; // Ensure this is defined
    if (!apiUrl) {
      console.error("REACT_APP_API_URL is not defined");
      return;
    }

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setStoreData(data);
        setBackendData(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save user preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Update allProducts to use backend data
  const allProducts = useMemo(() => {
    const { featured = [], products = [], games = [], rentItems = [], sellItems = [] } = storeData;
    return [...featured, ...products, ...games, ...rentItems, ...sellItems];
  }, [storeData]);

  const updateCartCount = (item) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems, item];
      return newItems;
    });
    
    setUserPreferences(prev => ({
      ...prev,
      viewedItems: [...new Set([...prev.viewedItems, item.id])].slice(-10)
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

    setUserPreferences(prev => ({
      ...prev,
      recentSearches: [...new Set([query, ...prev.recentSearches])].slice(0, 5)
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleSignIn = (token) => {
    localStorage.setItem('token', token);
    // Optionally, you can redirect the user or update the state
  };

  return (
    <ErrorBoundary>
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
                <GameCarousel items={storeData.featured} />
                <ProductSection 
                  products={storeData.products} 
                  updateCartCount={updateCartCount} 
                />
                <GamesSection 
                  games={storeData.games} 
                  updateCartCount={updateCartCount} 
                />
                <Banner />
                <Highlights />
              </>
            } />
            <Route 
              path="/sell" 
              element={
                <Sell 
                  items={storeData.sellItems} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route 
              path="/buy" 
              element={
                <Buy 
                  items={storeData.products} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route 
              path="/rent" 
              element={
                <Rent 
                  items={storeData.rentItems} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route path="/rent/:id" element={<RentDetails updateCartCount={updateCartCount} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} clearCart={clearCart} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} userPreferences={userPreferences} />} />
            <Route path="/payment" element={<Payment cartItems={cartItems} clearCart={clearCart} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
