import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, ChevronLeft } from "lucide-react";
import { searchProducts, logSearch } from "@/lib/search";
import { useAuth } from "@/contexts/AuthContext";
import type { Product, Filters } from "@/pages/Products";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    categories: searchParams.getAll('category') || [],
    subcategories: searchParams.getAll('subcategory') || [],
    priceRange: [
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 100000
    ],
    certifications: searchParams.getAll('cert') || [],
    stockStatus: searchParams.getAll('stock') || [],
    search: '',
    sortBy: searchParams.get('sort') || 'relevance',
  });

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        navigate('/products');
        return;
      }

      setLoading(true);
      const results = await searchProducts(query);
      setProducts(results);
      setFilteredProducts(results);
      setLoading(false);

      // Log search
      logSearch(query, user?.id);
    };

    fetchResults();
  }, [query, user?.id, navigate]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Subcategory filter
    if (filters.subcategories.length > 0) {
      result = result.filter(p => filters.subcategories.includes(p.subcategory));
    }

    // Price range filter
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Stock status filter
    if (filters.stockStatus.length > 0) {
      result = result.filter(p => {
        if (filters.stockStatus.includes('in-stock') && p.stock > 10) return true;
        if (filters.stockStatus.includes('low-stock') && p.stock > 0 && p.stock <= 10) return true;
        if (filters.stockStatus.includes('out-of-stock') && p.stock === 0) return true;
        return false;
      });
    }

    // Certifications filter
    if (filters.certifications.length > 0 && !filters.certifications.includes('none')) {
      result = result.filter(p => {
        const certs = Array.isArray(p.certifications) ? p.certifications : [];
        return filters.certifications.some(cert => 
          certs.some((c: any) => c.name === cert)
        );
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep relevance order from search
        break;
    }

    setFilteredProducts(result);

    // Update URL with filters
    const params = new URLSearchParams();
    params.set('q', query);
    filters.categories.forEach(c => params.append('category', c));
    filters.subcategories.forEach(s => params.append('subcategory', s));
    if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 100000) params.set('maxPrice', filters.priceRange[1].toString());
    filters.certifications.forEach(c => params.append('cert', c));
    filters.stockStatus.forEach(s => params.append('stock', s));
    if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    
    setSearchParams(params, { replace: true });
  }, [filters, products]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      subcategories: [],
      priceRange: [0, 100000],
      certifications: [],
      stockStatus: [],
      search: '',
      sortBy: 'relevance',
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100000 ||
    filters.certifications.length > 0 ||
    filters.stockStatus.length > 0;

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Search Bar Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/products')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Search Results
            </h1>
            
            <div className="max-w-2xl">
              <SearchBar onSearch={handleNewSearch} variant="page" />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  products={products}
                />
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">
                    Results for "{query}"
                  </h2>
                  
                  {/* Mobile Filter Toggle */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="md:hidden ml-auto">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <div className="py-4">
                        <FilterSidebar
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          products={products}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <p className="text-muted-foreground">
                      Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-primary"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="px-4 py-2 border rounded-md bg-background"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid products={filteredProducts} loading={loading} />

              {/* No Results Message */}
              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    )}
                    <Button onClick={() => navigate('/products')}>
                      Browse All Products
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
