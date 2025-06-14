'use client';

// Check if user has given consent for analytics
const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('analytics-consent') === 'true';
};

// Send a custom event to Google Analytics
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag && hasAnalyticsConsent()) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track PDF upload events
export const trackUpload = (fileCount: number) => {
  trackEvent('pdf_upload', { file_count: fileCount });
};

// Track PDF split events
export const trackSplit = (pageCount: number) => {
  trackEvent('pdf_split', { page_count: pageCount });
};

// Track download events
export const trackDownload = () => {
  trackEvent('pdf_download');
};

// Track errors
export const trackError = (errorMessage: string, errorSource: string) => {
  trackEvent('error', {
    error_message: errorMessage,
    error_source: errorSource,
  });
};
