import { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './Cart.css';

function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartItems, removeFromCart } = useCart();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleCart = () => setIsOpen(!isOpen);

    const handleRemove = (itemId: number) => {
        removeFromCart(itemId);
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.pricePerPackage, 0);

    return (
        <div className="cart" ref={dropdownRef}>
            <button className="cart__button" onClick={toggleCart}>
                <span className="cart__icon">🛒</span>
                {cartItems.length > 0 && (
                    <span className="cart__badge">{cartItems.length}</span>
                )}
            </button>

            {isOpen && (
                <div className="cart__dropdown">
                    <div className="cart__header">
                        <h3>Забронированные автомобили</h3>
                    </div>

                    <div className="cart__content">
                        {cartItems.length === 0 ? (
                            <div className="cart__empty">
                                <p>Корзина пуста</p>
                                <span>🚗</span>
                            </div>
                        ) : (
                            <>
                                <div className="cart__items">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart__item">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={`${item.brand} ${item.model}`} 
                                                className="cart__item-image"
                                            />
                                            <div className="cart__item-info">
                                                <h4>{item.brand} {item.model}</h4>
                                                <p className="cart__item-year">{item.year} • {item.horsePower} л.с.</p>
                                                <p className="cart__item-price">{item.pricePerPackage.toLocaleString('ru-RU')} $</p>
                                            </div>
                                            <button 
                                                className="cart__item-remove"
                                                onClick={() => handleRemove(item.id)}
                                                title="Удалить"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart__footer">
                                    <div className="cart__total">
                                        <span>Итого:</span>
                                        <span className="cart__total-price">{totalPrice.toLocaleString('ru-RU')} $</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
