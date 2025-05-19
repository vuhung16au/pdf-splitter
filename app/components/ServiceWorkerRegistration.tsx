"use client";

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [status, setStatus] = useState<'pending' | 'registered' | 'failed'>('pending');

  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          setStatus('registered');
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
          setStatus('failed');
        });
    } else {
      console.log('Service Worker not supported or disabled in development');
      // Don't consider this a failure since it's expected in development
      setStatus('registered'); 
    }
  }, []);

  return null; // This component doesn't render anything
}
