// Storage API wrapper using localStorage
export const storage = {
  async get(key: string): Promise<{ value: string } | null> {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  }
};

// Declare the storage on window for TypeScript
declare global {
  interface Window {
    storage: typeof storage;
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  window.storage = storage;
}
