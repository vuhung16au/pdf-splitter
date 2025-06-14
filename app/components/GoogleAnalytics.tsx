'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check for consent when component mounts and whenever localStorage might change
    const checkConsent = () => {
      if (typeof window !== 'undefined') {
        const consentValue = localStorage.getItem('analytics-consent');
        setHasConsent(consentValue === 'true');
      }
    };
    
    checkConsent();
    
    // Listen for changes to localStorage
    window.addEventListener('storage', checkConsent);
    return () => window.removeEventListener('storage', checkConsent);
  }, []);
  
  useEffect(() => {
    if (pathname && window.gtag && hasConsent === true) {
      // Send page view with path only if consent is given
      window.gtag('event', 'page_view', {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams, hasConsent]);

  // Check if GA_MEASUREMENT_ID is available
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;
  
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              // Require consent before sending analytics
              'analytics_storage': 'denied'
            });
            
            // Check initial consent
            const hasAnalyticsConsent = localStorage.getItem('analytics-consent') === 'true';
            if (hasAnalyticsConsent) {
              gtag('consent', 'update', {
                'analytics_storage': 'granted'
              });
            }
          `,
        }}
      />
    </>
  );
}

// TypeScript definitions are now in app/types/google-analytics.d.ts
