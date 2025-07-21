import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  PARTICIPANTS: 'pizza_participants',
  SETTINGS: 'pizza_settings',
  APP_VERSION: 'pizza_app_version'
};

const APP_VERSION = '1.0.0';

// Safe JSON parsing with error handling
const safeParse = (item, fallback = null) => {
  try {
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn('Failed to parse localStorage item:', error);
    return fallback;
  }
};

// Safe JSON stringifying with error handling
const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('Failed to stringify localStorage value:', error);
    return null;
  }
};

// Check if localStorage is available (some browsers disable it)
const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export default function useLocalStorage(key, defaultValue) {
  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, using memory storage');
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return safeParse(item, defaultValue);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);

      // Save to localStorage if available
      if (isLocalStorageAvailable()) {
        const stringValue = safeStringify(valueToStore);
        if (stringValue !== null) {
          localStorage.setItem(key, stringValue);
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Specialized hook for participants data with migration support
export function useParticipantsStorage() {
  const [participants, setParticipants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, [
    { id: 1, name: 'João', count: 0, leftPieces: false },
    { id: 2, name: 'Maria', count: 0, leftPieces: false }
  ]);

  // Auto-save version info for future migrations
  const [appVersion, setAppVersion] = useLocalStorage(STORAGE_KEYS.APP_VERSION, APP_VERSION);
  
  useEffect(() => {
    if (appVersion !== APP_VERSION) {
      console.log(`App updated from ${appVersion} to ${APP_VERSION}`);
      setAppVersion(APP_VERSION);
      // Future: Add data migration logic here if needed
    }
  }, [appVersion, setAppVersion]);

  return [participants, setParticipants];
}

// Specialized hook for app settings
export function useSettingsStorage() {
  const defaultSettings = {
    maxSlices: 100,
    enableHapticFeedback: true,
    enableSoundEffects: false,
    competitionName: 'Competição de Pizza',
    darkMode: false
  };

  return useLocalStorage(STORAGE_KEYS.SETTINGS, defaultSettings);
}

// Utility functions for manual storage operations
export const StorageUtils = {
  // Clear all app data
  clearAll: () => {
    if (!isLocalStorageAvailable()) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Export all data as JSON
  exportData: () => {
    if (!isLocalStorageAvailable()) return null;

    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      if (item) {
        data[name] = safeParse(item);
      }
    });
    
    return {
      ...data,
      exportDate: new Date().toISOString(),
      appVersion: APP_VERSION
    };
  },

  // Import data from JSON (with validation)
  importData: (data) => {
    if (!isLocalStorageAvailable() || !data) return false;

    try {
      // Validate required structure
      if (data.PARTICIPANTS && Array.isArray(data.PARTICIPANTS)) {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, safeStringify(data.PARTICIPANTS));
      }
      
      if (data.SETTINGS && typeof data.SETTINGS === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, safeStringify(data.SETTINGS));
      }
      
      return true;
    } catch (error) {
      console.warn('Failed to import data:', error);
      return false;
    }
  },

  // Get storage usage info
  getStorageInfo: () => {
    if (!isLocalStorageAvailable()) return { available: false };

    let totalSize = 0;
    const items = {};
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      if (item) {
        const size = new Blob([item]).size;
        items[name] = { size, data: safeParse(item) };
        totalSize += size;
      }
    });

    return {
      available: true,
      totalSize,
      items,
      quota: navigator.storage?.estimate ? 'Available via Storage API' : 'Unknown'
    };
  }
};