// CSRF token header name
const CSRF_HEADER = 'X-CSRF-Token';

// Get CSRF token from cookie
export const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrf_token='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Add CSRF token to fetch options
export const addCsrfToken = (options: RequestInit = {}): RequestInit => {
  const token = getCsrfToken();
  if (!token) {
    throw new Error('CSRF token not found');
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      [CSRF_HEADER]: token,
    },
  };
};

// Create a fetch wrapper that automatically adds CSRF token
export const csrfFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const csrfOptions = addCsrfToken(options);
  return fetch(url, csrfOptions);
}; 