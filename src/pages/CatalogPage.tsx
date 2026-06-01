import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList/ProductList';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterButtons from '../components/FilterButtons/FilterButtons';
import { productsAPI } from '../api/index';
import type { Product } from '../api/index';
import './CatalogPage.css';

function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузить товары при монтировании
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await productsAPI.getAll();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки товаров:', err);
                setError('Ошибка при загрузке товаров');
            } finally {
                setLoading(false);
            }
        };
        
        loadProducts();
    }, []);

    // Фильтрация по категории и поиску
    // Показываем только активные (0) и проданные (2) товары
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Все' || product.categoryId.toString() === selectedCategory;
        const matchesStatus = product.status === 0 || product.status === 2; // Only Active or Sold
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="catalog-page">
                <div className="catalog-header">
                    <h1>Каталог автомобилей</h1>
                </div>
                <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка товаров...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalog-page">
                <div className="catalog-header">
                    <h1>Каталог автомобилей</h1>
                </div>
                <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>
            </div>
        );
    }

    return (
        <div className="catalog-page">
            <div className="catalog-header">
                <h1>Каталог автомобилей</h1>
                <p>Выберите свой идеальный болид для незабываемых гонок на Нюрбургринге</p>
            </div>
            
            <div className="catalog-controls">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <FilterButtons 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                />
            </div>
            
            <ProductList cars={filteredProducts} />
        </div>
    );
}

export default CatalogPage;
