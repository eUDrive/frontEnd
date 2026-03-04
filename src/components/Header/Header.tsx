import { Link } from "react-router-dom";
import './Header.css';

function Header() {
    return (
        <header className="header">
            <Link to="/" className="logo-link">
                <img src="../../../public/assets/logo.png" alt="Company Logo" className="logo" />
            </Link>
            <nav>
                <Link to="/catalog">Каталог</Link>
                <Link to="/certificates">Сертификаты</Link>
                <Link to="/about">О нас</Link>
            </nav>
        </header>
    )
}

export default Header;