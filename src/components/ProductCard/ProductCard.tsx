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

function ProductCard({ name, image, price, horsepower, year, category }: ProductCardProps) {
    return (
        <div className="product-card">
            <div className="product-card__image">
                <img src={image} alt={name} />
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
                    <button className="product-card__btn">Забронировать</button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;