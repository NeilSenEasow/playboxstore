import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import GameCarousel from './components/Carousel/Carousel'
import ProductSection from './components/ProductSection/ProductSection'

function App() {

  return (
    <Router>
      <div>
        <Navbar />
        <Hero />
        <GameCarousel />
        <ProductSection />
        <Routes>
          <Route path="/" element={<div>Home Component</div>} />
          <Route path="/sell" element={<div>Sell Component</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
