import { supabase } from "@/integrations/supabase/client";

/**
 * Saved Items (Wishlist) API functions
 */

export interface SavedItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

/**
 * Get user's saved items with product details
 */
export const getSavedItems = async () => {
  try {
    console.log('📋 Fetching saved items');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Fetch saved items error:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} saved items`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch saved items:', error);
    throw error;
  }
};

/**
 * Add item to saved items
 */
export const addToSavedItems = async (productId: string) => {
  try {
    console.log('💾 Adding item to saved items:', productId);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_items')
      .insert([{
        user_id: user.id,
        product_id: productId,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Add to saved items error:', error);
      throw error;
    }

    console.log('✅ Item added to saved items');
    return data;
  } catch (error) {
    console.error('❌ Failed to add to saved items:', error);
    throw error;
  }
};

/**
 * Remove item from saved items
 */
export const removeFromSavedItems = async (productId: string) => {
  try {
    console.log('🗑️ Removing item from saved items:', productId);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('❌ Remove from saved items error:', error);
      throw error;
    }

    console.log('✅ Item removed from saved items');
  } catch (error) {
    console.error('❌ Failed to remove from saved items:', error);
    throw error;
  }
};

/**
 * Check if item is saved
 */
export const isItemSaved = async (productId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Check saved item error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('❌ Failed to check saved item:', error);
    return false;
  }
};
