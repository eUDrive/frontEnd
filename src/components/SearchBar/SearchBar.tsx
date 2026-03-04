import './SearchBar.css';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="🔍 Поиск по бренду или модели..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar__input"
            />
        </div>
    );
}

export default SearchBar;
