'use client';

import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('analytics-consent');
    if (hasConsent === null) {
      // If no choice is saved, show the banner
      setShowConsent(true);
    } else if (hasConsent === 'true') {
      // If consent was given, initialize GA
      initializeGA();
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('analytics-consent', 'true');
    setShowConsent(false);
    initializeGA();
  };
  
  const declineConsent = () => {
    localStorage.setItem('analytics-consent', 'false');
    setShowConsent(false);
    // Optional: You could add code here to disable GA if it was previously enabled
  };

  const initializeGA = () => {
    // The actual initialization happens in GoogleAnalytics.tsx
    // This just signals that consent is given
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          This website uses cookies to analyze site traffic.
        </div>
        <div className="flex gap-2">
          <button
            onClick={declineConsent}
            className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Decline
          </button>
          <button
            onClick={acceptConsent}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
