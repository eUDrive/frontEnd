import ProductCard from '../ProductCard/ProductCard';
import type { Car } from '../../data/products';
import './ProductList.css';

interface ProductListProps {
    cars: Car[];
}

function ProductList({ cars }: ProductListProps) {
    if (cars.length === 0) {
        return (
            <div className="product-list-empty">
                <h2>🚗 Автомобили не найдены</h2>
                <p>Попробуйте изменить параметры поиска или фильтры</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            {cars.map((car) => (
                <ProductCard
                    key={car.id}
                    id={car.id}
                    name={`${car.brand} ${car.model}`}
                    image={car.imageUrl}
                    price={car.pricePerPackage}
                    horsepower={car.horsePower}
                    year={car.year}
                    category={car.category}
                />
            ))}
        </div>
    );
}

export default ProductList;
