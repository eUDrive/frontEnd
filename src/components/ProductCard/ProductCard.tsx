import { useState, useEffect } from 'react';
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
    description?: string;
}

function ProductCard({ id, name, image, price, horsepower, year, category, description }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const { addToCart, removeFromCart, isInCart } = useCart();
    const isBooked = isInCart(id);

    // Загрузка лайков из localStorage
    useEffect(() => {
        const savedLikes = localStorage.getItem(`product-likes-${id}`);
        const savedIsLiked = localStorage.getItem(`product-liked-${id}`);
        if (savedLikes) setLikes(parseInt(savedLikes, 10));
        if (savedIsLiked) setIsLiked(JSON.parse(savedIsLiked));
    }, [id]);

    // Сохранение лайков в localStorage
    const handleLike = () => {
        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : likes - 1;
        
        setIsLiked(newIsLiked);
        setLikes(newLikes);
        
        localStorage.setItem(`product-likes-${id}`, String(newLikes));
        localStorage.setItem(`product-liked-${id}`, JSON.stringify(newIsLiked));
    };

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
                description: description || '',
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
                <div className="product-card__header">
                    <h3 className="product-card__name">{name}</h3>
                    <button 
                        className={`product-card__like ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                        title="Нравится"
                    >
                        ❤️
                        {likes > 0 && <span className="like-count">{likes}</span>}
                    </button>
                </div>
                
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
                    <span className="product-card__price">${price.toFixed(2)}</span>
                    <button 
                        className={`product-card__btn ${isBooked ? 'product-card__btn--booked' : ''}`}
                        onClick={handleBooking}
                    >
                        {isBooked ? '✓ В корзине' : 'В корзину'}
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
