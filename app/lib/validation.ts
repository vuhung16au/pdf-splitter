// Input validation utilities

// Validate PDF file
export function validatePdfFile(file: File): boolean {
  // Check file type
  if (file.type !== 'application/pdf') {
    return false;
  }

  // Check file size (100MB max)
  const MAX_SIZE = 100 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return false;
  }

  return true;
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  // Remove any path components
  const basename = filename.split(/[\\/]/).pop() || '';
  // Remove any null bytes
  const withoutNull = basename.replace(/\0/g, '');
  // Remove any control characters
  const withoutControl = withoutNull.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  // Remove any special characters
  const sanitized = withoutControl.replace(/[^a-zA-Z0-9.-]/g, '_');
  // Truncate to maximum length
  return sanitized.slice(0, 255);
}

// Validate page range
export function validatePageRange(start: number, end: number, totalPages: number): boolean {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return false;
  }
  if (start < 1 || end > totalPages || start > end) {
    return false;
  }
  return true;
}

// Prevent SQL injection
export function sanitizeSQL(input: string): string {
  // Remove SQL injection patterns
  return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  });
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): boolean {
  // At least 8 characters
  if (password.length < 8) return false;
  
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // At least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // At least one number
  if (!/\d/.test(password)) return false;
  
  // At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  return true;
} 