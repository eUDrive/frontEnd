import { useState } from 'react';
import ProductList from '../components/ProductList/ProductList';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterButtons from '../components/FilterButtons/FilterButtons';
import { cars } from '../data/products';
import './CatalogPage.css';

function CatalogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');

    // Фильтрация по категории и поиску
    const filteredCars = cars.filter(car => {
        const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            car.model.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Все' || car.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="catalog-page">
            <div className="catalog-header">
                <h1>Каталог гоночных машин</h1>
                <p>Выберите свой идеальный болид для незабываемых гонок на Нюрбургринге</p>
            </div>
            
            <div className="catalog-controls">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <FilterButtons 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory}
                />
            </div>
            
            <ProductList cars={filteredCars} />
        </div>
    );
}

export default CatalogPage;
