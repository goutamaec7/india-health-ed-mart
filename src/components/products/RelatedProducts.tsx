import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/pages/Products";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedProductsProps {
  currentProductId: string;
  category: 'healthcare' | 'educational';
  subcategory: string;
}

export const RelatedProducts = ({ 
  currentProductId, 
  category, 
  subcategory 
}: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // First try to get products from same subcategory
        let { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('subcategory', subcategory)
          .neq('id', currentProductId)
          .limit(5);

        // If not enough products, get from same category
        if (data && data.length < 4) {
          const { data: categoryData } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('category', category)
            .neq('id', currentProductId)
            .limit(5 - (data?.length || 0));
          
          data = [...(data || []), ...(categoryData || [])];
        }

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, category, subcategory]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
