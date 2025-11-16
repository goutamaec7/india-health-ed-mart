import { supabase } from "@/integrations/supabase/client";

/**
 * Payment API functions
 * Handles Razorpay payment integration
 */

export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  amount: number;
  transaction_id?: string;
  payment_status: 'pending' | 'success' | 'failed' | 'refunded';
  payment_gateway: string;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Create a payment record
 */
export const createPayment = async (orderId: string, amount: number) => {
  try {
    console.log('💳 Creating payment record:', { orderId, amount });
    
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        order_id: orderId,
        payment_method: 'razorpay',
        amount,
        payment_status: 'pending',
        payment_gateway: 'razorpay',
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Create payment error:', error);
      throw error;
    }

    console.log('✅ Payment record created');
    return data;
  } catch (error) {
    console.error('❌ Failed to create payment:', error);
    throw error;
  }
};

/**
 * Update payment status after Razorpay response
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: Payment['payment_status'],
  transactionId?: string,
  gatewayResponse?: any
) => {
  try {
    console.log('💳 Updating payment status:', { paymentId, status });
    
    const { data, error } = await supabase
      .from('payments')
      .update({
        payment_status: status,
        transaction_id: transactionId,
        gateway_response: gatewayResponse,
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update payment error:', error);
      throw error;
    }

    console.log('✅ Payment status updated');
    return data;
  } catch (error) {
    console.error('❌ Failed to update payment:', error);
    throw error;
  }
};

/**
 * Get payment by order ID
 */
export const getPaymentByOrderId = async (orderId: string) => {
  try {
    console.log('💳 Fetching payment for order:', orderId);
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Fetch payment error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch payment:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment signature
 * Note: This should be done on the backend for security
 */
export const verifyPaymentSignature = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  try {
    console.log('💳 Verifying payment signature');
    
    // TODO: Implement backend verification via Edge Function
    // For now, this is a placeholder
    console.warn('⚠️ Payment signature verification should be done on backend');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to verify payment signature:', error);
    throw error;
  }
};
