import './FilterButtons.css';

interface FilterButtonsProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

function FilterButtons({ selectedCategory, setSelectedCategory }: FilterButtonsProps) {
    const categories = ['Все', 'Sport', 'GT', 'Touring'];

    return (
        <div className="filter-buttons">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default FilterButtons;
