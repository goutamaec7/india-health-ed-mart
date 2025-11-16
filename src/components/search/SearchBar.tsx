import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  getAutocompleteSuggestions, 
  saveRecentSearch, 
  getRecentSearches,
  clearRecentSearches,
  popularSearches 
} from "@/lib/search";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/pages/Products";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  variant?: 'header' | 'page';
}

export const SearchBar = ({ onSearch, autoFocus = false, variant = 'header' }: SearchBarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    if (user) {
      const recent = getRecentSearches(user.id);
      setRecentSearches(recent);
    }
  }, [user]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 3) {
        setLoading(true);
        const results = await getAutocompleteSuggestions(debouncedQuery);
        setSuggestions(results);
        setLoading(false);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(query.length > 0 || false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    if (user) {
      saveRecentSearch(searchQuery, user.id);
      setRecentSearches([searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 5));
    }

    setShowDropdown(false);
    setQuery('');
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    if (user) {
      saveRecentSearch(product.product_name, user.id);
    }
    setShowDropdown(false);
    setQuery('');
    navigate(`/products/${product.id}`);
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    handleSearch(recentQuery);
  };

  const handleClearRecent = () => {
    if (user) {
      clearRecentSearches(user.id);
      setRecentSearches([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const showRecentOrPopular = query.length === 0 && (recentSearches.length > 0 || popularSearches.length > 0);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products, SKU, brand..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className={`pl-10 ${query ? 'pr-20' : 'pr-4'} ${variant === 'page' ? 'h-12 text-base' : ''}`}
          autoFocus={autoFocus}
        />
        {query && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleSearch()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {/* Recent Searches */}
          {showRecentOrPopular && recentSearches.length > 0 && (
            <div className="p-2 border-b">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={handleClearRecent}
                >
                  Clear
                </Button>
              </div>
              {recentSearches.map((recent, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                  onClick={() => handleRecentSearchClick(recent)}
                >
                  <Clock className="h-3 w-3 inline mr-2 text-muted-foreground" />
                  {recent}
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {showRecentOrPopular && recentSearches.length === 0 && (
            <div className="p-2 border-b">
              <div className="px-2 py-1 mb-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Popular Searches
                </span>
              </div>
              {popularSearches.map((popular, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                  onClick={() => handleRecentSearchClick(popular)}
                >
                  <TrendingUp className="h-3 w-3 inline mr-2 text-muted-foreground" />
                  {popular}
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((product, idx) => (
                <button
                  key={product.id}
                  className={`w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors ${
                    selectedIndex === idx ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSuggestionClick(product)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} · ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query.length >= 3 && suggestions.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                No products found for "{query}"
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Try different keywords or browse categories
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/products')}
              >
                Browse All Products
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
