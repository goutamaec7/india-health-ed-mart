import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductTabs } from "@/components/products/ProductTabs";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/pages/Products";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    // Now handled in ProductInfo component
  };

  const handleSaveForLater = () => {
    // TODO: Implement save for later functionality
    toast.success('Saved to your list');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading product...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button & Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/products')}
              className="mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Button>
            <div className="text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/products')}>
                Products
              </span>
              {' > '}
              <span className="hover:text-foreground cursor-pointer capitalize">
                {product.category}
              </span>
              {' > '}
              <span className="hover:text-foreground cursor-pointer">
                {product.subcategory}
              </span>
              {' > '}
              <span className="text-foreground">{product.product_name}</span>
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid lg:grid-cols-[60%_40%] gap-8 mb-12">
            {/* Left: Images */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ImageGallery product={product} />
            </div>

            {/* Right: Product Info */}
            <div>
              <ProductInfo
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onSaveForLater={handleSaveForLater}
              />
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-12">
            <ProductTabs product={product} />
          </div>

          {/* Related Products */}
          <RelatedProducts 
            currentProductId={product.id}
            category={product.category}
            subcategory={product.subcategory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
