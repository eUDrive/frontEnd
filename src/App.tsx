import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";
import { AuthPage } from "./pages/AuthPage";
import { PersonalCabinetPage } from "./pages/PersonalCabinetPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import CertificatePage from "./pages/CertificatePage";
import PrivacyTermsPage from "./pages/PrivacyTermsPage";
import ContactPage from "./pages/ContactPage";
import ErrorPage from "./pages/ErrorPage";
import AdminPage from "./pages/AdminPage";

function AppContent() {
  const location = useLocation();
  
  // Check if current route is error page (wildcard route)
  const validRoutes = ['/', '/auth', '/cabinet', '/catalog', '/cart', '/certificates', '/about', '/contact', '/privacy-terms'];
  const isErrorPage = !validRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!isErrorPage && <Header />}
      
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cabinet" element={<PersonalCabinetPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/certificates" element={<CertificatePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<ErrorPage />} />
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
