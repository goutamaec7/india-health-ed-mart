/**
 * Form validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove spaces, dashes, and country code
  const cleanPhone = phone.replace(/[\s\-+]/g, '');
  
  // Check if it's 10 digits
  if (!/^\d{10}$/.test(cleanPhone)) {
    return false;
  }
  
  // Check if it starts with valid Indian mobile prefix (6-9)
  return /^[6-9]/.test(cleanPhone);
};

/**
 * Validate GST number (Indian format)
 */
export const isValidGSTIN = (gstin: string): boolean => {
  if (!gstin) return true; // Optional field
  
  // GST format: 29ABCDE1234F1Z5 (15 characters)
  const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
  return gstRegex.test(gstin.toUpperCase());
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 5)}-${cleanPhone.slice(5)}`;
  }
  
  return phone;
};

/**
 * Validate full name
 */
export const isValidFullName = (name: string): boolean => {
  // At least 2 characters, only letters and spaces
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};
