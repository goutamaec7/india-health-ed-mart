/**
 * Client-side rate limiting and account lockout
 * Note: For production, this should be implemented server-side
 */

interface LoginAttempt {
  timestamp: number;
  email: string;
}

interface AccountLockout {
  email: string;
  lockedUntil: number;
  attempts: number;
}

const STORAGE_KEY = 'login_attempts';
const LOCKOUT_KEY = 'account_lockouts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 60 * 1000; // 1 minute

/**
 * Get login attempts from storage
 */
const getAttempts = (): LoginAttempt[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save login attempts to storage
 */
const saveAttempts = (attempts: LoginAttempt[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch (error) {
    console.error('Failed to save login attempts:', error);
  }
};

/**
 * Get account lockouts from storage
 */
const getLockouts = (): AccountLockout[] => {
  try {
    const stored = localStorage.getItem(LOCKOUT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save account lockouts to storage
 */
const saveLockouts = (lockouts: AccountLockout[]) => {
  try {
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(lockouts));
  } catch (error) {
    console.error('Failed to save lockouts:', error);
  }
};

/**
 * Clean up old attempts and lockouts
 */
const cleanup = () => {
  const now = Date.now();
  
  // Clean old attempts
  const attempts = getAttempts().filter(
    attempt => now - attempt.timestamp < ATTEMPT_WINDOW
  );
  saveAttempts(attempts);
  
  // Clean expired lockouts
  const lockouts = getLockouts().filter(
    lockout => now < lockout.lockedUntil
  );
  saveLockouts(lockouts);
};

/**
 * Check if account is locked
 */
export const isAccountLocked = (email: string): { locked: boolean; remainingTime?: number } => {
  cleanup();
  
  const lockouts = getLockouts();
  const lockout = lockouts.find(l => l.email.toLowerCase() === email.toLowerCase());
  
  if (lockout && Date.now() < lockout.lockedUntil) {
    return {
      locked: true,
      remainingTime: Math.ceil((lockout.lockedUntil - Date.now()) / 1000),
    };
  }
  
  return { locked: false };
};

/**
 * Record a failed login attempt
 */
export const recordFailedAttempt = (email: string): { shouldLock: boolean; attemptsLeft: number } => {
  cleanup();
  
  const now = Date.now();
  const attempts = getAttempts();
  
  // Add new attempt
  attempts.push({ email: email.toLowerCase(), timestamp: now });
  saveAttempts(attempts);
  
  // Count recent attempts for this email
  const recentAttempts = attempts.filter(
    attempt => 
      attempt.email.toLowerCase() === email.toLowerCase() &&
      now - attempt.timestamp < ATTEMPT_WINDOW
  );
  
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - recentAttempts.length);
  
  // Check if should lock
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const lockouts = getLockouts();
    const existingLockout = lockouts.find(l => l.email.toLowerCase() === email.toLowerCase());
    
    if (existingLockout) {
      existingLockout.lockedUntil = now + LOCKOUT_DURATION;
      existingLockout.attempts = recentAttempts.length;
    } else {
      lockouts.push({
        email: email.toLowerCase(),
        lockedUntil: now + LOCKOUT_DURATION,
        attempts: recentAttempts.length,
      });
    }
    
    saveLockouts(lockouts);
    
    console.warn(`🔒 Account locked: ${email} (${recentAttempts.length} failed attempts)`);
    
    return { shouldLock: true, attemptsLeft: 0 };
  }
  
  return { shouldLock: false, attemptsLeft };
};

/**
 * Clear login attempts for an email (after successful login)
 */
export const clearAttempts = (email: string) => {
  const attempts = getAttempts().filter(
    attempt => attempt.email.toLowerCase() !== email.toLowerCase()
  );
  saveAttempts(attempts);
  
  const lockouts = getLockouts().filter(
    lockout => lockout.email.toLowerCase() !== email.toLowerCase()
  );
  saveLockouts(lockouts);
};

/**
 * Format remaining time for display
 */
export const formatRemainingTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
  }
  
  return `${secs} second${secs !== 1 ? 's' : ''}`;
};
