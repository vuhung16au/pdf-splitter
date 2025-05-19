"use client";

// Simple wrapper for IndexedDB to store offline operations and files
export default class OfflineStorage {
  private static readonly DB_NAME = 'pdf-splitter-offline-db';
  private static readonly DB_VERSION = 1;
  private static readonly OPERATIONS_STORE = 'pending-operations';
  private static readonly FILES_STORE = 'uploaded-files';
  private static db: IDBDatabase | null = null;

  // Initialize the database
  static async init(): Promise<boolean> {
    if (!('indexedDB' in window)) {
      console.error('IndexedDB is not supported in this browser');
      return false;
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        resolve(false);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('IndexedDB connected successfully');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create operations store - for storing user actions when offline
        if (!db.objectStoreNames.contains(this.OPERATIONS_STORE)) {
          db.createObjectStore(this.OPERATIONS_STORE, { keyPath: 'id', autoIncrement: true });
        }

        // Create files store - for storing uploaded files while offline
        if (!db.objectStoreNames.contains(this.FILES_STORE)) {
          const filesStore = db.createObjectStore(this.FILES_STORE, { keyPath: 'id', autoIncrement: true });
          filesStore.createIndex('name', 'name', { unique: false });
          filesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('IndexedDB setup complete');
      };
    });
  }

  // Store a PDF file for offline reference
  static async storeFile(file: File): Promise<number> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      // Read the file content as ArrayBuffer
      const reader = new FileReader();
      reader.onload = () => {
        const transaction = this.db!.transaction([this.FILES_STORE], 'readwrite');
        const store = transaction.objectStore(this.FILES_STORE);
        
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: reader.result, // ArrayBuffer of the file content
          timestamp: new Date()
        };
        
        const request = store.add(fileData);
        
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(new Error('Failed to store file'));
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Get all stored files
  static async getFiles(): Promise<any[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.FILES_STORE], 'readonly');
      const store = transaction.objectStore(this.FILES_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Failed to get files');
        resolve([]);
      };
    });
  }

  // Add a pending operation
  static async addOperation(operation: any): Promise<number> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.OPERATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(this.OPERATIONS_STORE);
      
      const operationData = {
        ...operation,
        timestamp: new Date()
      };
      
      const request = store.add(operationData);
      
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(new Error('Failed to add operation'));
    });
  }

  // Get all pending operations
  static async getOperations(): Promise<any[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.OPERATIONS_STORE], 'readonly');
      const store = transaction.objectStore(this.OPERATIONS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Failed to get operations');
        resolve([]);
      };
    });
  }

  // Clear a completed operation
  static async clearOperation(id: number): Promise<boolean> {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.OPERATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(this.OPERATIONS_STORE);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  // Clear all operations
  static async clearAllOperations(): Promise<boolean> {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.OPERATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(this.OPERATIONS_STORE);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }
}
