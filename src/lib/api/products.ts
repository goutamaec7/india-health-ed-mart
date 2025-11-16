import { supabase } from "@/integrations/supabase/client";

/**
 * Product API functions
 * Handles all product-related database operations
 */

export interface Product {
  id: string;
  sku: string;
  product_name: string;
  category: 'healthcare' | 'educational';
  subcategory: string;
  price: number;
  gst_rate: number;
  stock: number;
  image_url?: string;
  description?: string;
  manufacturer?: string;
  certifications?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: 'healthcare' | 'educational';
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}

/**
 * Get all active products with optional filters
 */
export const getProducts = async (filters?: ProductFilters, page = 1, limit = 20) => {
  try {
    console.log('📦 Fetching products with filters:', filters);
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.search) {
      query = query.or(`product_name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,manufacturer.ilike.%${filters.search}%`);
    }

    if (filters?.inStock) {
      query = query.gt('stock', 0);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by created date (newest first)
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Fetch products error:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} products`);
    return { products: data || [], count: count || 0, page, limit };
  } catch (error) {
    console.error('❌ Failed to fetch products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string) => {
  try {
    console.log('📦 Fetching product:', id);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Fetch product error:', error);
      throw error;
    }

    console.log('✅ Product fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch product:', error);
    throw error;
  }
};

/**
 * Create a new product (Admin only)
 */
export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('📦 Creating product:', product.product_name);
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('❌ Create product error:', error);
      throw error;
    }

    console.log('✅ Product created successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to create product:', error);
    throw error;
  }
};

/**
 * Update a product (Admin only)
 */
export const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    console.log('📦 Updating product:', id);
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update product error:', error);
      throw error;
    }

    console.log('✅ Product updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to update product:', error);
    throw error;
  }
};

/**
 * Delete a product (Admin only - soft delete by setting is_active to false)
 */
export const deleteProduct = async (id: string) => {
  try {
    console.log('📦 Deleting product:', id);
    
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('❌ Delete product error:', error);
      throw error;
    }

    console.log('✅ Product deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete product:', error);
    throw error;
  }
};

/**
 * Search products by name or SKU
 */
export const searchProducts = async (searchTerm: string, limit = 10) => {
  try {
    console.log('🔍 Searching products:', searchTerm);
    
    const { data, error } = await supabase
      .from('products')
      .select('id, sku, product_name, category, price, image_url')
      .eq('is_active', true)
      .or(`product_name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
      .limit(limit);

    if (error) {
      console.error('❌ Search products error:', error);
      throw error;
    }

    console.log(`✅ Found ${data?.length || 0} products`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to search products:', error);
    throw error;
  }
};
