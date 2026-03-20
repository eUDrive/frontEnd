import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const { cartItems } = useCart();

    return (
        <Link to="/cart" className="cart">
            <button className="cart__button" title="Перейти в корзину">
                <span className="cart__icon">🛒</span>
                {cartItems.length > 0 && (
                    <span className="cart__badge">{cartItems.length}</span>
                )}
            </button>
        </Link>
    );
}

export default Cart;
