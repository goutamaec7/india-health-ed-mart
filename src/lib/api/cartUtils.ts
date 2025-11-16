import type { CartItem } from "./cart";
import type { Product } from "@/pages/Products";

/**
 * Transform cart items from API to include product data
 */
export interface CartItemWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export const transformCartItems = (items: CartItem[]): CartItemWithProduct[] => {
  return items
    .filter(item => item.products) // Only include items with valid products
    .map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.products!.id,
        sku: item.products!.sku,
        product_name: item.products!.product_name,
        price: item.products!.price,
        gst_rate: item.products!.gst_rate,
        stock: item.products!.stock,
        image_url: item.products!.image_url,
        category: item.products!.category as 'healthcare' | 'educational',
        // Add other required Product fields with defaults
        subcategory: '',
        certifications: null,
        description: null,
        manufacturer: null,
        is_active: true,
        created_at: '',
        updated_at: '',
      } as Product,
    }));
};
