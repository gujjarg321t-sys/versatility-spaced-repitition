// IndexedDB Storage Helper to handle unlimited storage capacity (solving localStorage 5MB QuotaExceededError)

const DB_NAME = 'VersatilityVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_data';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Save value to IndexedDB asynchronously
 */
export async function setIndexedDBItem<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn(`IndexedDB save failed for ${key}`, e);
    return false;
  }
}

/**
 * Load value from IndexedDB asynchronously
 */
export async function getIndexedDBItem<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn(`IndexedDB load failed for ${key}`, e);
    return null;
  }
}

/**
 * Safe LocalStorage setter that never throws QuotaExceededError
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    // Catch QuotaExceededError silently without breaking the application stack
    console.warn(`[SafeStorage] LocalStorage quota exceeded for key: ${key}. Using IndexedDB storage instead.`);
    return false;
  }
}
