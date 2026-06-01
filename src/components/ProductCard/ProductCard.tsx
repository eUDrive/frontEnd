import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ProductDetailModal from './ProductDetailModal';
import type { Product } from '../../api/index';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart, removeFromCart, isInCart } = useCart();
    const isBooked = isInCart(product.id);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const handleBooking = () => {
        if (isBooked) {
            removeFromCart(product.id);
        } else {
            addToCart(product);
        }
    };

    const mainImageUrl = product.image
    || product.images?.[0]?.url
    || '/images/placeholder.png';

    return (
        <div className="product-card" data-status={product.status}>
            <div className="product-card__image" onClick={openModal}>
               <img
                    src={mainImageUrl}
                    alt={product.name}
                    style={{ cursor: 'pointer' }}
                />
               {product.status === 2 && (
                    <div className="product-card__sold-overlay">
                        <span className="product-card__sold-badge">ПРОДАН</span>
                    </div>
                )}
            </div>
            
            <div className="product-card__content">
                <h3 className="product-card__name">{product.name}</h3>
                
                <div className="product-card__specs">
                    <div className="spec">
                        <span className="spec__label">📦 Stock</span>
                        <span className="spec__value">{product.stock || 0} units</span>
                    </div>
                    <div className="spec">
                        <span className="spec__label">🏁 Category</span>
                        <span className="spec__value">Category {product.categoryId}</span>
                    </div>
                    <div className="spec">
                        <span className="spec__label">📸 Photos</span>
                        <span className="spec__value">{product.images?.length || 0}</span>
                    </div>
                </div>
                
                <div className="product-card__footer">
                    <span className="product-card__price">${product.price.toLocaleString('en-US')}</span>
                    <button 
                        className={`product-card__btn ${isBooked ? 'product-card__btn--booked' : ''}`}
                        onClick={handleBooking}
                    >
                        {isBooked ? '✓ Booked' : 'Book'}
                    </button>
                </div>
            </div>

            {/* Enhanced Product Detail Modal */}
            <ProductDetailModal
                isOpen={isModalOpen}
                product={product}
                onClose={closeModal}
                onBook={handleBooking}
                isBooked={isBooked}
            />
        </div>
    );
}

export default ProductCard;
