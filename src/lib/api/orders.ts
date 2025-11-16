import { supabase } from "@/integrations/supabase/client";

/**
 * Order API functions
 * Handles order creation, tracking, and management
 */

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address: any;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_snapshot: any;
  quantity: number;
  unit_price: number;
  gst_rate: number;
  line_total: number;
  created_at: string;
}

export interface CreateOrderData {
  cartItems: any[];
  deliveryAddressId: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

/**
 * Create a new order from cart items
 */
export const createOrder = async (orderData: CreateOrderData) => {
  try {
    console.log('📝 Creating order');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get delivery address
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', orderData.deliveryAddressId)
      .single();

    if (addressError) {
      console.error('❌ Address fetch error:', addressError);
      throw addressError;
    }

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.error('❌ Order number generation error:', orderNumberError);
      throw orderNumberError;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumberData,
        user_id: user.id,
        subtotal: orderData.subtotal,
        tax_amount: orderData.taxAmount,
        total_amount: orderData.totalAmount,
        status: 'pending',
        delivery_address: address,
      }])
      .select()
      .single();

    if (orderError) {
      console.error('❌ Create order error:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_snapshot: item.products,
      quantity: item.quantity,
      unit_price: item.products.price,
      gst_rate: item.products.gst_rate,
      line_total: item.products.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('❌ Create order items error:', itemsError);
      throw itemsError;
    }

    console.log('✅ Order created successfully:', order.order_number);
    return order;
  } catch (error) {
    console.error('❌ Failed to create order:', error);
    throw error;
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async () => {
  try {
    console.log('📋 Fetching user orders');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Fetch orders error:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} orders`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error);
    throw error;
  }
};

/**
 * Get order details with items
 */
export const getOrderById = async (orderId: string) => {
  try {
    console.log('📋 Fetching order:', orderId);
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('❌ Fetch order error:', orderError);
      throw orderError;
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('❌ Fetch order items error:', itemsError);
      throw itemsError;
    }

    console.log('✅ Order fetched successfully');
    return { ...order, items: items || [] };
  } catch (error) {
    console.error('❌ Failed to fetch order:', error);
    throw error;
  }
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    console.log('📋 Updating order status:', { orderId, status });
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update order status error:', error);
      throw error;
    }

    console.log('✅ Order status updated');
    return data;
  } catch (error) {
    console.error('❌ Failed to update order status:', error);
    throw error;
  }
};

/**
 * Subscribe to order status updates (Real-time)
 */
export const subscribeToOrderUpdates = (orderId: string, callback: (order: Order) => void) => {
  console.log('🔄 Subscribing to order updates:', orderId);
  
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        console.log('🔄 Order updated:', payload.new);
        callback(payload.new as Order);
      }
    )
    .subscribe();

  return () => {
    console.log('🔄 Unsubscribing from order updates');
    supabase.removeChannel(channel);
  };
};
