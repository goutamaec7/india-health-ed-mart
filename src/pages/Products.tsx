import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";

export interface Product {
  id: string;
  product_name: string;
  category: 'healthcare' | 'educational';
  subcategory: string;
  price: number;
  stock: number;
  image_url: string | null;
  description: string | null;
  certifications: any;
  gst_rate: number;
  manufacturer: string | null;
  sku: string;
}

export interface Filters {
  categories: string[];
  subcategories: string[];
  priceRange: [number, number];
  certifications: string[];
  stockStatus: string[];
  search: string;
  sortBy: string;
}

const ITEMS_PER_PAGE = 20;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sort') || 'relevance',
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setProducts(data || []);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and update URL
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

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p =>
        p.product_name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products are already sorted by created_at desc from DB
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);

    // Update URL with filters
    const params = new URLSearchParams();
    filters.categories.forEach(c => params.append('category', c));
    filters.subcategories.forEach(s => params.append('subcategory', s));
    if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 100000) params.set('maxPrice', filters.priceRange[1].toString());
    filters.certifications.forEach(c => params.append('cert', c));
    filters.stockStatus.forEach(s => params.append('stock', s));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    
    setSearchParams(params, { replace: true });
  }, [filters, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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
    filters.stockStatus.length > 0 ||
    filters.search !== '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our comprehensive range of healthcare and educational products
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products by name, SKU, or description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Filter Toggle */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
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
          </div>
        </div>

        {/* Main Content */}
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

            {/* Product Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of{' '}
                    {filteredProducts.length} products
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
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Product Grid */}
              <ProductGrid products={currentProducts} loading={loading} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
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

export default Products;
