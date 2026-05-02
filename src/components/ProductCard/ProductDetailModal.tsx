import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Car } from '../../data/products';
import './ProductDetailModal.css';

interface ProductDetailModalProps {
    isOpen: boolean;
    product: Car;
    onClose: () => void;
    onBook: () => void;
    isBooked: boolean;
}

function ProductDetailModal({ 
    isOpen, 
    product, 
    onClose, 
    onBook, 
    isBooked 
}: ProductDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen) return null;

    const images = product.images || [];
    const currentImage = images.length > 0 ? images[currentImageIndex] : null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!currentImage) {
        return null;
    }

    return createPortal(
        <div className="product-detail-modal-backdrop" onClick={handleBackdropClick}>
            <div className="product-detail-modal">
                <button className="product-detail-modal__close" onClick={onClose}>✕</button>

                {/* Left Side - Image Gallery */}
                <div className="product-detail-modal__gallery">
                    <div className="gallery__main-image">
                        <img src={currentImage.url} alt={product.name} />
                    </div>

                    {/* Image Navigation */}
                    {images.length > 1 && (
                        <>
                            <button 
                                className="gallery__nav-btn gallery__nav-btn--prev" 
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                ❮
                            </button>
                            <button 
                                className="gallery__nav-btn gallery__nav-btn--next" 
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                ❯
                            </button>

                            {/* Thumbnail Strip */}
                            <div className="gallery__thumbnails">
                                {images.map((img, index) => (
                                    <button
                                        key={img.id}
                                        className={`gallery__thumbnail ${index === currentImageIndex ? 'gallery__thumbnail--active' : ''}`}
                                        onClick={() => goToImage(index)}
                                    >
                                        <img src={img.url} alt={`View ${index + 1}`} />
                                    </button>
                                ))}
                            </div>

                            {/* Image Counter */}
                            <div className="gallery__counter">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Side - Product Information */}
                <div className="product-detail-modal__info">
                    {/* Title */}
                    <div className="info__header">
                        <h2 className="info__title">{product.name}</h2>
                        <span className="info__category">{product.category}</span>
                    </div>

                    {/* Price */}
                    <div className="info__price">
                        ${product.price.toLocaleString('en-US')}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="info__description">
                            <p>{product.description.description}</p>
                        </div>
                    )}

                    {/* Specifications */}
                    <div className="info__specs">
                        <h3 className="specs__title">Performance Specs</h3>
                        <div className="specs__grid">
                            {product.description?.descriptionAdvanced && (
                                <>
                                    <div className="spec-item">
                                        <span className="spec-item__label">🏎️ Horsepower</span>
                                        <span className="spec-item__value">{product.description.descriptionAdvanced.h} л.с.</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-item__label">⚖️ Weight</span>
                                        <span className="spec-item__value">{product.description.descriptionAdvanced.w} kg</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-item__label">⚡ 0-100 km/h</span>
                                        <span className="spec-item__value">{(product.description.descriptionAdvanced.l / 10).toFixed(1)}s</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="info__actions">
                        <button 
                            className={`btn btn--book ${isBooked ? 'btn--booked' : ''}`}
                            onClick={onBook}
                        >
                            {isBooked ? '✓ Already Booked' : 'Book Now'}
                        </button>
                        <button 
                            className="btn btn--close"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ProductDetailModal;
