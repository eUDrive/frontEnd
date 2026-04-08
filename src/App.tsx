import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";
import { AuthPage } from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import CertificatePage from "./pages/CertificatePage";
import PrivacyTermsPage from "./pages/PrivacyTermsPage";

function AppContent() {
  const location = useLocation();
  
  // Check if current route is error page (wildcard route)
  const validRoutes = ['/', '/auth', '/catalog', '/cart', '/certificates', '/about', '/privacy-terms'];
  const isErrorPage = !validRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!isErrorPage && <Header />}
      
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/certificates" element={<CertificatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
        </Routes>
      </main>
      
      {!isErrorPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
