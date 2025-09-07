import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to a readable format
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Check if a date is in the past
 */
export function isPast(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return isValid(date) && date < new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is in the future
 */
export function isFuture(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return isValid(date) && date > new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Get time remaining until a date
 */
export function getTimeRemaining(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid date';
    }

    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff <= 0) {
      return 'Time has passed';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Extract meeting number from Zoom URL
 */
export function extractZoomMeetingNumber(zoomUrl: string): string {
  const patterns = [
    /\/j\/(\d+)/, // Standard Zoom URL format
    /meeting\/(\d+)/, // Alternative format
    /(\d{9,})/, // Just the meeting number
  ];

  for (const pattern of patterns) {
    const match = zoomUrl.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return '';
}

/**
 * Validate EverWebinar URL
 */
export function isValidEverWebinarUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('everwebinar.com') || 
           urlObj.hostname.includes('webinarjam.com');
  } catch (error) {
    return false;
  }
}

/**
 * Validate Zoom URL
 */
export function isValidZoomUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('zoom.us');
  } catch (error) {
    return false;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}