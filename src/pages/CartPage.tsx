import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import type { CartItem } from '../context/CartContext';
import './CartPage.css';

interface PaymentFormData {
    email: string;
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

function isCertificate(item: CartItem): boolean {
    return 'duration' in item && 'includes' in item;
}

function getItemPrice(item: CartItem): number {
    if (isCertificate(item)) {
        const cert = item as any;
        return cert.price;
    }
    const car = item as any;
    return car.pricePerPackage;
}

function getItemName(item: CartItem): string {
    if (isCertificate(item)) {
        const cert = item as any;
        return cert.title;
    }
    const car = item as any;
    return `${car.brand} ${car.model}`;
}

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [paymentData, setPaymentData] = useState<PaymentFormData>({
        email: '',
        cardholderName: isAuthenticated ? user?.name || '' : '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const totalPrice = cartItems.reduce((sum, cartItem) => sum + (getItemPrice(cartItem.item) * cartItem.quantity), 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!isAuthenticated && !paymentData.email.trim()) {
            errors.email = 'Пожалуйста, введите электронную почту';
        }
        if (!paymentData.cardholderName.trim()) {
            errors.cardholderName = 'Пожалуйста, введите имя держателя карты';
        }
        if (!paymentData.cardNumber.replace(/\s/g, '').match(/^\d{13,19}$/)) {
            errors.cardNumber = 'Пожалуйста, введите корректный номер карты';
        }
        if (!paymentData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
            errors.expiryDate = 'Пожалуйста, введите дату в формате MM/YY';
        }
        if (!paymentData.cvv.match(/^\d{3,4}$/)) {
            errors.cvv = 'Пожалуйста, введите корректный CVV';
        }
        if (cartItems.length === 0) {
            errors.cart = 'Корзина пуста. Добавьте товары перед оформлением';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // TODO: Send payment to backend
            console.log('Payment processed:', {
                user: isAuthenticated ? user : { email: paymentData.email },
                items: cartItems,
                total: totalPrice,
                payment: paymentData,
            });

            setOrderPlaced(true);
            
            // Show success message for 3 seconds then redirect
            setTimeout(() => {
                setOrderPlaced(false);
                setPaymentData({
                    email: '',
                    cardholderName: isAuthenticated ? user?.name || '' : '',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                });
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setValidationErrors({ payment: 'Ошибка при обработке платежа. Пожалуйста, попробуйте снова.' });
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="cart-page">
                <div className="order-success-overlay">
                    <div className="order-success">
                        <div className="success-icon">✓</div>
                        <h2>Заказ успешно размещен!</h2>
                        <p>Спасибо за вашу покупку. Мы вскоре свяжемся с вами.</p>
                        <Link to="/catalog" className="success-button">
                            Вернуться в каталог
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {cartItems.length === 0 ? (
                // Empty Cart State - Full Page View
                <div className="empty-cart-container">
                    <div className="empty-cart-content">
                        <div className="empty-cart-animation">
                            <div className="cart-icon">🛒</div>
                            <div className="floating-items">
                                <div className="floating-item item-1">📦</div>
                                <div className="floating-item item-2">💳</div>
                                <div className="floating-item item-3">🚗</div>
                            </div>
                        </div>
                        <h1 className="empty-title">Ваша корзина пуста</h1>
                        <p className="empty-subtitle">Пока вы ничего не добавили в заказ</p>
                        <p className="empty-description">Откройте каталог и выберите товары, которые вас интересуют. Мы уверены, что вы найдете что-то прекрасное!</p>
                        <Link to="/catalog" className="btn btn-primary btn-large">
                            🏪 Перейти в каталог
                        </Link>
                    </div>
                </div>
            ) : (
                // Cart with Items
                <div className="cart-wrapper">
                    {/* Header */}
                    <div className="cart-header">
                        <h1>Оформление заказа</h1>
                        <div className="progress-indicator">
                            <div className={`progress-step ${cartItems.length > 0 ? 'active' : ''}`}>
                                <span className="step-number">1</span>
                                <span className="step-label">Товары</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${cartItems.length > 0 ? 'active' : ''}`}>
                                <span className="step-number">2</span>
                                <span className="step-label">Оплата</span>
                            </div>
                        </div>
                    </div>

                    <div className="cart-content">
                        {/* Main Content */}
                        <div className="cart-main">
                            {/* Order Items Section */}
                            <div className="cart-section items-section">
                                <div className="section-header">
                                    <h2>📦 Товары в заказе</h2>
                                    <span className="items-count">{cartItems.length} {cartItems.length === 1 ? 'товар' : 'товаров'}</span>
                                </div>
                                
                                <div className="items-list">
                                    {cartItems.map((cartItem) => (
                                        <div key={cartItem.item.id} className="cart-item-card">
                                            <div className="item-image-wrapper">
                                                {!isCertificate(cartItem.item) && (
                                                    <img 
                                                        src={(cartItem.item as any).imageUrl}
                                                        alt={getItemName(cartItem.item)}
                                                        className="item-image"
                                                    />
                                                )}
                                                {isCertificate(cartItem.item) && (
                                                    <div className="certificate-placeholder">
                                                        <span>📜</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="item-body">
                                                <div className="item-header">
                                                    <div className="item-info">
                                                        <h4 className="item-name">{getItemName(cartItem.item)}</h4>
                                                        {!isCertificate(cartItem.item) && (
                                                            <p className="item-specs">{(cartItem.item as any).year} • {(cartItem.item as any).horsePower} л.с.</p>
                                                        )}
                                                        {isCertificate(cartItem.item) && (
                                                            <p className="item-specs">{(cartItem.item as any).duration}</p>
                                                        )}
                                                    </div>
                                                    <button 
                                                        className="btn-remove"
                                                        onClick={() => removeFromCart(cartItem.item.id)}
                                                        title="Удалить из заказа"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="item-footer">
                                                    <div className="quantity-control">
                                                        <button 
                                                            className="qty-btn"
                                                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                                            disabled={cartItem.quantity <= 1}
                                                            title="Уменьшить количество"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-value">{cartItem.quantity}</span>
                                                        <button 
                                                            className="qty-btn"
                                                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                                            title="Увеличить количество"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="item-price-wrapper">
                                                        <span className="price-label">Цена:</span>
                                                        <span className="item-total-price">
                                                            {(getItemPrice(cartItem.item) * cartItem.quantity).toLocaleString('ru-RU')} $
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="promo-section">
                                    <input 
                                        type="text" 
                                        placeholder="Промокод (необязательно)"
                                        className="promo-input"
                                        disabled
                                    />
                                    <button className="btn btn-secondary" disabled>
                                        Применить
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="cart-sidebar">
                            {/* Order Summary */}
                            <div className="cart-section summary-section">
                                <h3>Итого</h3>
                                <div className="summary-rows">
                                    <div className="summary-row">
                                        <span>Сумма товаров:</span>
                                        <span>{totalPrice.toLocaleString('ru-RU')} $</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Доставка:</span>
                                        <span className="shipping-free">Бесплатно</span>
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="summary-row total">
                                        <span>Итого к оплате:</span>
                                        <span className="total-price">{totalPrice.toLocaleString('ru-RU')} $</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Section */}
                            <div className="cart-section checkout-section">
                                {/* User Information */}
                                <div className="checkout-block">
                                    <h4>👤 Контактные данные</h4>
                                    {isAuthenticated ? (
                                        <div className="user-info">
                                            <div className="user-item">
                                                <span className="user-label">Имя:</span>
                                                <span className="user-value">{user?.name}</span>
                                            </div>
                                            <div className="user-item">
                                                <span className="user-label">Email:</span>
                                                <span className="user-value">{user?.email}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Электронная почта *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="your@email.com"
                                                value={paymentData.email}
                                                onChange={handleInputChange}
                                                className={validationErrors.email ? 'error' : ''}
                                                required
                                            />
                                            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Payment Information */}
                                <form onSubmit={handlePayment} className="payment-form">
                                    <div className="checkout-block">
                                        <h4>💳 Способ оплаты</h4>
                                        
                                        <div className="form-group">
                                            <label htmlFor="cardholderName">
                                                Имя держателя карты *
                                            </label>
                                            <input
                                                type="text"
                                                id="cardholderName"
                                                name="cardholderName"
                                                placeholder="Ivan Ivanov"
                                                value={paymentData.cardholderName}
                                                onChange={handleInputChange}
                                                className={validationErrors.cardholderName ? 'error' : ''}
                                                required
                                            />
                                            {validationErrors.cardholderName && <span className="error-text">{validationErrors.cardholderName}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="cardNumber">
                                                Номер карты *
                                            </label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={paymentData.cardNumber}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\s/g, '');
                                                    if (!/^\d*$/.test(value)) return;
                                                    value = value.replace(/(\d{4})/g, '$1 ').trim();
                                                    setPaymentData((prev) => ({
                                                        ...prev,
                                                        cardNumber: value,
                                                    }));
                                                    if (validationErrors.cardNumber) {
                                                        setValidationErrors((prev) => ({
                                                            ...prev,
                                                            cardNumber: '',
                                                        }));
                                                    }
                                                }}
                                                className={validationErrors.cardNumber ? 'error' : ''}
                                                required
                                                maxLength={19}
                                            />
                                            {validationErrors.cardNumber && <span className="error-text">{validationErrors.cardNumber}</span>}
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="expiryDate">
                                                    Срок действия *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={paymentData.expiryDate}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '');
                                                        if (value.length >= 2) {
                                                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                        }
                                                        setPaymentData((prev) => ({
                                                            ...prev,
                                                            expiryDate: value,
                                                        }));
                                                        if (validationErrors.expiryDate) {
                                                            setValidationErrors((prev) => ({
                                                                ...prev,
                                                                expiryDate: '',
                                                            }));
                                                        }
                                                    }}
                                                    className={validationErrors.expiryDate ? 'error' : ''}
                                                    required
                                                    maxLength={5}
                                                />
                                                {validationErrors.expiryDate && <span className="error-text">{validationErrors.expiryDate}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="cvv">
                                                    CVV *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    name="cvv"
                                                    placeholder="123"
                                                    value={paymentData.cvv}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 4) {
                                                            setPaymentData((prev) => ({
                                                                ...prev,
                                                                cvv: value,
                                                            }));
                                                            if (validationErrors.cvv) {
                                                                setValidationErrors((prev) => ({
                                                                    ...prev,
                                                                    cvv: '',
                                                                }));
                                                            }
                                                        }
                                                    }}
                                                    className={validationErrors.cvv ? 'error' : ''}
                                                    required
                                                    maxLength={4}
                                                />
                                                {validationErrors.cvv && <span className="error-text">{validationErrors.cvv}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {validationErrors.payment && (
                                        <div className="error-alert">
                                            ⚠️ {validationErrors.payment}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-block btn-large"
                                        disabled={isProcessing || cartItems.length === 0}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner"></span>
                                                Обработка платежа...
                                            </>
                                        ) : (
                                            `Оплатить ${totalPrice.toLocaleString('ru-RU')} $`
                                        )}
                                    </button>

                                    <Link to="/catalog" className="btn btn-outline btn-block">
                                        ← Продолжить покупки
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
