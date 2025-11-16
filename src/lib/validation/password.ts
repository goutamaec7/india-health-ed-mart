/**
 * Password validation utilities
 */

export interface PasswordStrength {
  score: number; // 0-4
  label: 'weak' | 'medium' | 'strong' | 'very strong';
  color: string;
  feedback: string[];
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/**
 * Check password requirements
 */
export const checkPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

/**
 * Calculate password strength
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = checkPasswordRequirements(password);
  const feedback: string[] = [];
  
  // Count met requirements
  let score = 0;
  
  if (requirements.minLength) score++;
  else feedback.push('At least 8 characters');
  
  if (requirements.hasUppercase) score++;
  else feedback.push('At least one uppercase letter');
  
  if (requirements.hasLowercase) score++;
  else feedback.push('At least one lowercase letter');
  
  if (requirements.hasNumber) score++;
  else feedback.push('At least one number');
  
  if (requirements.hasSpecialChar) score++;
  else feedback.push('At least one special character');
  
  // Determine label and color
  let label: PasswordStrength['label'];
  let color: string;
  
  if (score <= 2) {
    label = 'weak';
    color = 'hsl(0 72% 51%)'; // destructive
  } else if (score === 3) {
    label = 'medium';
    color = 'hsl(25 95% 55%)'; // secondary
  } else if (score === 4) {
    label = 'strong';
    color = 'hsl(200 95% 35%)'; // primary
  } else {
    label = 'very strong';
    color = 'hsl(142 76% 36%)'; // success green
  }
  
  return { score, label, color, feedback };
};

/**
 * Validate password meets minimum requirements
 */
export const isPasswordValid = (password: string): boolean => {
  const requirements = checkPasswordRequirements(password);
  return (
    requirements.minLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumber
  );
};
