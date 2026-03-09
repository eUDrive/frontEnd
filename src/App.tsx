import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app">
          <Header />
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/certificates" element={<div className="page-placeholder">Страница "Сертификаты" в разработке</div>} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
