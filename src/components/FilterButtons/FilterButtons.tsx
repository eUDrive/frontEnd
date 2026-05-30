import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api/index';
import type { Category } from '../../api/index';
import './FilterButtons.css';

interface FilterButtonsProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

function FilterButtons({ selectedCategory, setSelectedCategory }: FilterButtonsProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoriesAPI.getAll();
                setCategories(data);
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadCategories();
    }, []);

    const categoryOptions = [
        { id: 0, name: 'Все' },
        ...categories
    ];

    return (
        <div className="filter-buttons">
            {loading ? (
                <p>Загрузка категорий...</p>
            ) : (
                categoryOptions.map((category) => (
                    <button
                        key={category.id}
                        className={`filter-btn ${
                            selectedCategory === 'Все' && category.id === 0 
                                ? 'active' 
                                : selectedCategory === category.id.toString() 
                                ? 'active' 
                                : ''
                        }`}
                        onClick={() => {
                            if (category.id === 0) {
                                setSelectedCategory('Все');
                            } else {
                                setSelectedCategory(category.id.toString());
                            }
                        }}
                    >
                        {category.name}
                    </button>
                ))
            )}
        </div>
    );
}

export default FilterButtons;
