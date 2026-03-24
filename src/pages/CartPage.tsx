import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import type { CartItem } from '../context/CartContext';
import './CartPage.css';

interface PaymentFormData {
    // User info fields for non-authenticated users
    phoneNumber: string;
    // Payment card fields
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
    const { cartItems, removeFromCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [paymentData, setPaymentData] = useState<PaymentFormData>({
        phoneNumber: '',
        cardholderName: isAuthenticated ? user?.name || '' : '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + getItemPrice(item), 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!isAuthenticated && !paymentData.phoneNumber.trim()) {
            alert('Пожалуйста, введите номер телефона');
            return false;
        }
        if (!paymentData.cardholderName.trim()) {
            alert('Пожалуйста, введите имя держателя карты');
            return false;
        }
        if (!paymentData.cardNumber.replace(/\s/g, '').match(/^\d{13,19}$/)) {
            alert('Пожалуйста, введите корректный номер карты');
            return false;
        }
        if (!paymentData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
            alert('Пожалуйста, введите дату в формате MM/YY');
            return false;
        }
        if (!paymentData.cvv.match(/^\d{3,4}$/)) {
            alert('Пожалуйста, введите корректный CVV');
            return false;
        }
        if (cartItems.length === 0) {
            alert('Корзина пуста. Добавьте автомобили перед оформлением');
            return false;
        }
        return true;
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
                user: isAuthenticated ? user : { phoneNumber: paymentData.phoneNumber },
                items: cartItems,
                total: totalPrice,
                payment: paymentData,
            });

            setOrderPlaced(true);
            
            // Show success message for 3 seconds then redirect
            setTimeout(() => {
                setOrderPlaced(false);
                setPaymentData({
                    phoneNumber: '',
                    cardholderName: isAuthenticated ? user?.name || '' : '',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                });
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            alert('Ошибка при обработке платежа. Пожалуйста, попробуйте снова.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="cart-page">
                <div className="order-success">
                    <div className="success-icon">✓</div>
                    <h2>Заказ успешно размещен!</h2>
                    <p>Спасибо за вашу покупку. Мы вскоре свяжемся с вами.</p>
                    <Link to="/catalog" className="success-button">
                        Вернуться в каталог
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Order Summary Section */}
                <div className="cart-section order-summary">
                    <h2>Ваш заказ</h2>
                    
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            <p>🚗 Ваша корзина пуста</p>
                            <Link to="/catalog" className="continue-shopping-btn">
                                Продолжить покупки
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="order-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="order-item">
                                        {!isCertificate(item) && (
                                            <img 
                                                src={(item as any).imageUrl}
                                                alt={getItemName(item)}
                                                className="order-item-image"
                                            />
                                        )}
                                        <div className="order-item-details">
                                            <h4>{getItemName(item)}</h4>
                                            {!isCertificate(item) && (
                                                <p className="item-specs">{(item as any).year} • {(item as any).horsePower} л.с.</p>
                                            )}
                                            {isCertificate(item) && (
                                                <p className="item-specs">{(item as any).duration}</p>
                                            )}
                                            <p className="item-price">{getItemPrice(item).toLocaleString('ru-RU')} $</p>
                                        </div>
                                        <button 
                                            className="remove-item-btn"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Удалить из заказа"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total-section">
                                <div className="order-total">
                                    <span>Итого к оплате:</span>
                                    <span className="total-amount">{totalPrice.toLocaleString('ru-RU')} $</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User & Payment Section */}
                {cartItems.length > 0 && (
                    <div className="cart-section checkout-section">
                        {/* User Information */}
                        <div className="user-info-section">
                            <h3>
                                {isAuthenticated ? 'Ваша информация' : 'Контактная информация'}
                            </h3>
                            {isAuthenticated ? (
                                <div className="user-info-display">
                                    <div className="user-field">
                                        <label>Имя:</label>
                                        <p>{user?.name}</p>
                                    </div>
                                    <div className="user-field">
                                        <label>Email:</label>
                                        <p>{user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="user-form-fields">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">
                                            Номер телефона *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder="+7 (XXX) XXX-XX-XX"
                                            value={paymentData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Information */}
                        <form onSubmit={handlePayment} className="payment-form">
                            <h3>Способ оплаты</h3>
                            
                            <div className="form-group">
                                <label htmlFor="cardholderName">
                                    Имя держателя карты *
                                </label>
                                <input
                                    type="text"
                                    id="cardholderName"
                                    name="cardholderName"
                                    placeholder="Иван Иванов"
                                    value={paymentData.cardholderName}
                                    onChange={handleInputChange}
                                    required
                                />
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
                                    }}
                                    required
                                    maxLength={19}
                                />
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
                                        }}
                                        required
                                        maxLength={5}
                                    />
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
                                            }
                                        }}
                                        required
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="pay-button"
                                disabled={isProcessing || cartItems.length === 0}
                            >
                                {isProcessing ? 'Обработка...' : `Оплатить ${totalPrice.toLocaleString('ru-RU')} $`}
                            </button>

                            <Link to="/catalog" className="continue-link">
                                Продолжить покупки
                            </Link>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;
