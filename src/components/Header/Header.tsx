import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import { useAuth } from "../../context/AuthContext";
import './Header.css';

function Header() {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="header">
            <Link to="/" className="logo-link">
                <img src="../../../public/assets/logo.png" alt="Company Logo" className="logo" />
            </Link>
            <nav>
                <Link to="/catalog">Каталог</Link>
                <Link to="/certificates">Сертификаты</Link>
                <Link to="/contact">Контакты</Link>
                <Link to="/about">О нас</Link>
            </nav>
            <Cart />
            <Link to="/auth" className="auth-icon-link" title={isAuthenticated ? `Logged in as ${user?.name}` : "Sign in"}>
                <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </Link>
        </header>
    )
}

export default Header;
