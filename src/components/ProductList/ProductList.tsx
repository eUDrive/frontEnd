import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { Product } from '../../api';
import './ProductList.css';
import { categoriesAPI } from '../../api';

interface ProductListProps {
    cars: Product[];
}

function ProductList({ cars }: ProductListProps) {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await categoriesAPI.getAll();
                setCategories(cats);
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };

        loadCategories();
    }, []);

    const getCategoryName = (categoryId: number): string => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || `Category ${categoryId}`;
    };

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
                    product={car}
                    categoryName={getCategoryName(car.categoryId)}
                />
            ))}
        </div>
    );
}

export default ProductList;