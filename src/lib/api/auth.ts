import { supabase } from "@/integrations/supabase/client";

/**
 * Authentication API functions
 * Handles user signup, login, logout, and session management
 */

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  userType: 'individual' | 'institution';
  organizationName?: string;
  organizationType?: 'hospital' | 'clinic' | 'diagnostic_center' | 'school' | 'college' | 'university' | 'research_institute';
  gstin?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Sign up a new user with profile information
 */
export const signUp = async (data: SignupData) => {
  try {
    console.log('🔐 Signing up user:', data.email);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: data.fullName,
          user_type: data.userType,
        }
      }
    });

    if (authError) {
      console.error('❌ Signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from signup');
    }

    // Update profile with additional information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        phone: data.phone,
        organization_name: data.organizationName,
        organization_type: data.organizationType,
        gstin: data.gstin,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('❌ Profile update error:', profileError);
      throw profileError;
    }

    console.log('✅ User signed up successfully');
    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error('❌ Signup failed:', error);
    throw error;
  }
};

/**
 * Log in an existing user
 */
export const login = async ({ email, password }: LoginData) => {
  try {
    console.log('🔐 Logging in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login error:', error);
      throw error;
    }

    console.log('✅ User logged in successfully');
    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = async () => {
  try {
    console.log('🔐 Logging out user');
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }

    console.log('✅ User logged out successfully');
  } catch (error) {
    console.error('❌ Logout failed:', error);
    throw error;
  }
};

/**
 * Get the current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Get session error:', error);
      throw error;
    }

    return session;
  } catch (error) {
    console.error('❌ Failed to get session:', error);
    throw error;
  }
};

/**
 * Get the current user profile
 */
export const getCurrentProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to get profile:', error);
    throw error;
  }
};

/**
 * Check if user has admin role
 */
export const checkAdminRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Check admin role error:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('❌ Failed to check admin role:', error);
    return false;
  }
};
