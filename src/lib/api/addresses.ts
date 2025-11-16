import { supabase } from "@/integrations/supabase/client";

/**
 * Address API functions
 * Handles user delivery addresses
 */

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default_shipping: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's addresses
 */
export const getUserAddresses = async () => {
  try {
    console.log('📍 Fetching user addresses');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default_shipping', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Fetch addresses error:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} addresses`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch addresses:', error);
    throw error;
  }
};

/**
 * Create a new address
 */
export const createAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('📍 Creating address');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // If this is set as default, unset all other defaults first
    if (address.is_default_shipping) {
      await supabase
        .from('addresses')
        .update({ is_default_shipping: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        ...address,
        user_id: user.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Create address error:', error);
      throw error;
    }

    console.log('✅ Address created successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to create address:', error);
    throw error;
  }
};

/**
 * Update an address
 */
export const updateAddress = async (id: string, updates: Partial<Address>) => {
  try {
    console.log('📍 Updating address:', id);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // If setting as default, unset all other defaults first
    if (updates.is_default_shipping) {
      await supabase
        .from('addresses')
        .update({ is_default_shipping: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update address error:', error);
      throw error;
    }

    console.log('✅ Address updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to update address:', error);
    throw error;
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (id: string) => {
  try {
    console.log('📍 Deleting address:', id);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Delete address error:', error);
      throw error;
    }

    console.log('✅ Address deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete address:', error);
    throw error;
  }
};

/**
 * Get default shipping address
 */
export const getDefaultAddress = async () => {
  try {
    console.log('📍 Fetching default address');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default_shipping', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Fetch default address error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch default address:', error);
    throw error;
  }
};
