"use client";

import React, { useState, useEffect } from 'react';
import { useNetwork } from '../context/NetworkContext';

interface OfflineNotificationProps {
  className?: string;
}

export default function OfflineNotification({ className = '' }: OfflineNotificationProps) {
  const { isOnline, lastOnlineStatus } = useNetwork();
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle visibility animation states
  useEffect(() => {
    // When the network status changes...
    if (isOnline !== lastOnlineStatus) {
      setIsTransitioning(true);
      setIsVisible(true);
      
      // Hide notification after a delay if we're back online
      if (isOnline) {
        const timer = setTimeout(() => {
          setIsTransitioning(false);
          // Second timer to completely hide after fade-out animation
          const hideTimer = setTimeout(() => {
            setIsVisible(false);
          }, 300); // Match with CSS transition duration
          return () => clearTimeout(hideTimer);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, lastOnlineStatus]);

  // Don't render anything if no status change and currently online
  if (!isVisible && isOnline) {
    return null;
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransitioning 
          ? isOnline 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-100 translate-y-0'
          : isOnline 
            ? 'opacity-0 -translate-y-full' 
            : 'opacity-100 translate-y-0'
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`py-2 px-4 text-center text-sm font-medium
        ${isOnline
          ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
          : 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-200'
        }`}>
        <div className="flex items-center justify-center gap-2">
          <div className={`h-2 w-2 rounded-full ${
            isOnline ? 'bg-green-500 animate-pulse' : 'bg-orange-500'
          }`}></div>
          <p>
            {isOnline 
              ? 'You are back online. Any saved operations will continue to process.'
              : 'You are currently offline. Some features may be limited.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
