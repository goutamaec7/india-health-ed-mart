import { supabase } from "@/integrations/supabase/client";

/**
 * Shopping Cart API functions
 * Handles cart operations for authenticated users
 */

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    sku: string;
    product_name: string;
    price: number;
    gst_rate: number;
    stock: number;
    image_url?: string;
    category: string;
  };
}

/**
 * Get current user's cart items
 */
export const getCartItems = async () => {
  try {
    console.log('🛒 Fetching cart items');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          sku,
          product_name,
          price,
          gst_rate,
          stock,
          image_url,
          category
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Fetch cart error:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} cart items`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch cart items:', error);
    throw error;
  }
};

/**
 * Add item to cart or update quantity if exists
 */
export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    console.log('🛒 Adding to cart:', { productId, quantity });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Update cart error:', error);
        throw error;
      }

      console.log('✅ Cart item quantity updated');
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          product_id: productId,
          quantity,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Add to cart error:', error);
        throw error;
      }

      console.log('✅ Item added to cart');
      return data;
    }
  } catch (error) {
    console.error('❌ Failed to add to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  try {
    console.log('🛒 Updating cart item:', { cartItemId, quantity });
    
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update cart item error:', error);
      throw error;
    }

    console.log('✅ Cart item updated');
    return data;
  } catch (error) {
    console.error('❌ Failed to update cart item:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId: string) => {
  try {
    console.log('🛒 Removing from cart:', cartItemId);
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('❌ Remove from cart error:', error);
      throw error;
    }

    console.log('✅ Item removed from cart');
  } catch (error) {
    console.error('❌ Failed to remove from cart:', error);
    throw error;
  }
};

/**
 * Clear all items from cart
 */
export const clearCart = async () => {
  try {
    console.log('🛒 Clearing cart');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Clear cart error:', error);
      throw error;
    }

    console.log('✅ Cart cleared');
  } catch (error) {
    console.error('❌ Failed to clear cart:', error);
    throw error;
  }
};

/**
 * Calculate cart totals including GST
 */
export const calculateCartTotals = (cartItems: CartItem[]) => {
  let subtotal = 0;
  let totalTax = 0;

  cartItems.forEach(item => {
    if (item.products) {
      const itemTotal = item.products.price * item.quantity;
      const itemTax = (itemTotal * item.products.gst_rate) / 100;
      
      subtotal += itemTotal;
      totalTax += itemTax;
    }
  });

  const total = subtotal + totalTax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(totalTax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};
