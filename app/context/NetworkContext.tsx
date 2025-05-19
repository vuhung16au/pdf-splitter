"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our context
interface PendingOperation {
  type: string;
  data: unknown;
  timestamp: Date;
}

interface NetworkContextType {
  isOnline: boolean;
  lastOnlineStatus: boolean;
  offlineAt: Date | null;
  onlineAt: Date | null;
  pendingOperations: PendingOperation[];
  addPendingOperation: (operation: Omit<PendingOperation, 'timestamp'>) => void;
  clearPendingOperations: () => void;
}

// Create the context with default values
const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  lastOnlineStatus: true,
  offlineAt: null,
  onlineAt: null,
  pendingOperations: [],
  addPendingOperation: () => {},
  clearPendingOperations: () => {},
});

// Custom hook for using the network context
export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  // Track current online status
  const [isOnline, setIsOnline] = useState<boolean>(true);
  // Track the previous online status for transition effects
  const [lastOnlineStatus, setLastOnlineStatus] = useState<boolean>(true);
  // Track when online/offline events occurred
  const [offlineAt, setOfflineAt] = useState<Date | null>(null);
  const [onlineAt, setOnlineAt] = useState<Date | null>(null);
  // Store operations attempted while offline
  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);

  // Function to add pending operations that were attempted while offline
  const addPendingOperation = (operation: Omit<PendingOperation, 'timestamp'>) => {
    setPendingOperations((prev) => [...prev, { ...operation, timestamp: new Date() }]);
  };

  // Function to clear pending operations once they're processed
  const clearPendingOperations = () => {
    setPendingOperations([]);
  };

  useEffect(() => {
    // Initialize the online status
    setIsOnline(navigator.onLine);
    setLastOnlineStatus(navigator.onLine);
    
    // Handler for when the browser goes online
    const handleOnline = () => {
      setLastOnlineStatus(isOnline);
      setIsOnline(true);
      setOnlineAt(new Date());
      // Could trigger syncing of offline operations here
    };
    
    // Handler for when the browser goes offline
    const handleOffline = () => {
      setLastOnlineStatus(isOnline);
      setIsOnline(false);
      setOfflineAt(new Date());
    };

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  const value = {
    isOnline,
    lastOnlineStatus,
    offlineAt,
    onlineAt,
    pendingOperations,
    addPendingOperation,
    clearPendingOperations,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};
