# Offline Functionality Testing

## Overview
This document outlines the approach for testing the offline capabilities of the PDF Splitter application. These tests verify that the application functions correctly when users experience network interruptions or work entirely offline.

## Why Test Offline Functionality?

1. **User Experience**: Many users work in environments with unreliable internet connections.
2. **Data Security**: Preventing data loss when internet connectivity is interrupted during file processing.
3. **Progressive Web App (PWA) Support**: Essential for PWA functionality and offline-first approach.
4. **Mobile Optimization**: Critical for mobile users who often experience connectivity fluctuations.

## Test Coverage

### 1. Network Status Detection

- Tests that the application detects when the browser goes offline/online
- Verifies that the application remains functional when offline
- Checks that network state changes don't crash the application

### 2. Offline File Uploads

- Confirms users can still select and upload PDF files when offline
- Validates that the UI properly handles these uploads without errors
- Ensures PDF previews work with locally cached files

### 3. Operation Handling When Offline

- Tests that operations attempted while offline don't crash the application
- Verifies that the UI remains responsive during network changes
- Confirms appropriate feedback is provided to users about offline status

### 4. Offline Access to Cached Content

- Confirms previously uploaded PDFs remain visible when offline
- Tests that basic application functionality remains available offline
- Verifies that cached files can be manipulated offline

### 5. Recovery From Network Interruptions

- Verifies the application can recover gracefully when network disconnection occurs during processing
- Tests that the application remains stable throughout connectivity changes
- Ensures operations can resume when connectivity is restored

## Running the Tests

```bash
# Run only the offline functionality tests
./run-offline-tests.sh

# Run with a specific browser
./run-offline-tests.sh firefox

# Run as part of the complete test suite
./run-tests.sh all

# Run specifically offline tests
./run-tests.sh offline
```

## Implementation Details

These tests use two complementary approaches to simulate network status changes:

### 1. Event Dispatching

```typescript
// Simulate going offline
cy.window().then((win) => {
  win.dispatchEvent(new Event('offline'));
});

// Simulate coming back online
cy.window().then((win) => {
  win.dispatchEvent(new Event('online'));
});
```

### 2. Navigator.onLine Property Override

```typescript
// Override window.navigator.onLine to return false
cy.window().then(win => {
  Object.defineProperty(win.navigator, 'onLine', {
    configurable: true,
    get: () => false
  });
});

// Restore online status
cy.window().then(win => {
  Object.defineProperty(win.navigator, 'onLine', {
    configurable: true,
    get: () => true
  });
});
```

## Current Implementation Status

The application now includes:

1. **Network Status Detection**
   - NetworkContext provider to track online/offline status
   - Events listeners for 'offline' and 'online' browser events
   - Visual indicator when offline

2. **Offline Storage**
   - IndexedDB storage for uploaded PDF files
   - Storage of pending operations to resume when online
   - Persistence of user data between sessions

3. **Progressive Web App Support**
   - Service Worker for offline asset caching
   - Manifest file for installable experience
   - Offline-first architecture

4. **Offline UI Features**
   - Offline mode indicators in the interface
   - Modified button text when offline ("Save for Later" vs "Split PDFs")
   - Status notifications for offline/online transitions

5. **Graceful Recovery**
   - Automatic processing of queued operations when returning online
   - Display of files stored while offline
   - Persistence of application state through network changes

The tests currently verify that:

1. The application doesn't crash when network status changes
2. File uploads work offline (before server communication)
3. UI remains responsive during connectivity changes

## Application Enhancement Roadmap

To fully implement offline functionality, the application should add:

1. Network status detection using `window.addEventListener('offline', handler)`
2. Offline notifications with a prominent status indicator
3. Operation queueing for actions initiated while offline
4. Cache management using IndexedDB or Cache API
5. Service Worker implementation for offline resource access
6. Synchronization mechanism for operations performed offline

## Implementation Recommendations

### Network Status Detection

```javascript
// Add this to a global component, like layout.js
useEffect(() => {
  const handleOffline = () => {
    setIsOffline(true);
    showNotification('You are currently offline. Some features may be limited.');
  };
  
  const handleOnline = () => {
    setIsOffline(false);
    showNotification('You are back online!');
    processQueuedOperations();
  };
  
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
}, []);
```

### Service Worker Registration

```javascript
// In your _app.js or equivalent
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('ServiceWorker registration successful');
      },
      error => {
        console.log('ServiceWorker registration failed: ', error);
      }
    );
  });
}
```
