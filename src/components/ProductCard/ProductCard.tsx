import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    price: number;
    horsepower: number;
    year: number;
    category: string;
}

function ProductCard({ id, name, image, price, horsepower, year, category }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart, removeFromCart, isInCart } = useCart();
    const isBooked = isInCart(id);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const handleBooking = () => {
        if (isBooked) {
            removeFromCart(id);
        } else {
            addToCart({
                id,
                brand: name.split(' ')[0],
                model: name.split(' ').slice(1).join(' '),
                year,
                horsePower: horsepower,
                category: category as "GT" | "Touring" | "Sport",
                imageUrl: image,
                pricePerPackage: price,
                description: '',
            });
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div className="product-card">
            <div className="product-card__image" onClick={openModal}>
                <img src={image} alt={name} style={{ cursor: 'pointer' }} />
            </div>
            
            <div className="product-card__content">
                <h3 className="product-card__name">{name}</h3>
                
                <div className="product-card__specs">
                    <div className="spec">
                        <span className="spec__label">🏎️ Мощность</span>
                        <span className="spec__value">{horsepower} л.с.</span>
                    </div>
                    <div className="spec">
                        <span className="spec__label">📅 Год</span>
                        <span className="spec__value">{year}</span>
                    </div>
                    <div className="spec">
                        <span className="spec__label">🏁 Категория</span>
                        <span className="spec__value">{category}</span>
                    </div>
                </div>
                
                <div className="product-card__footer">
                    <span className="product-card__price">{price.toLocaleString('ru-RU')} $</span>
                    <button 
                        className={`product-card__btn ${isBooked ? 'product-card__btn--booked' : ''}`}
                        onClick={handleBooking}
                    >
                        {isBooked ? '✓ Забронировано' : 'Забронировать'}
                    </button>
                </div>
            </div>

            {/* Image Modal Pop-up - Rendered at body level */}
            {isModalOpen && createPortal(
                <div className="image-modal-backdrop" onClick={handleBackdropClick}>
                    <div className="image-modal">
                        <button className="image-modal__close" onClick={closeModal}>✕</button>
                        <img src={image} alt={name} className="image-modal__img" />
                        <p className="image-modal__title">{name}</p>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default ProductCard;
