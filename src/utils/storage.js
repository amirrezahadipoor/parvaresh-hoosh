// Khanak Academy - Local Storage Manager
// Uses IndexedDB for structured progress data, falls back to localStorage

const StorageManager = {
    dbName: 'KhanakAcademyDB',
    dbVersion: 1,
    db: null,

    async init() {
        try {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Progress store
                if (!db.objectStoreNames.contains('progress')) {
                    const store = db.createObjectStore('progress', { keyPath: 'id' });
                    store.createIndex('domain', 'domain', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
                
                // Rewards store
                if (!db.objectStoreNames.contains('rewards')) {
                    db.createObjectStore('rewards', { keyPath: 'id', autoIncrement: true });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB initialized');
            };
            
            request.onerror = (event) => {
                console.warn('IndexedDB failed, using localStorage fallback');
                this.db = null;
            };
        } catch (e) {
            console.warn('IndexedDB not available, using localStorage');
            this.db = null;
        }
    },

    // Save lesson progress
    async saveProgress(lessonId, data) {
        const record = {
            id: lessonId,
            ...data,
            timestamp: Date.now()
        };
        
        if (this.db) {
            try {
                const tx = this.db.transaction('progress', 'readwrite');
                tx.objectStore('progress').put(record);
                return true;
            } catch (e) {
                console.error('DB save failed', e);
            }
        }
        
        // Fallback to localStorage
        try {
            const allProgress = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.progress) || '{}');
            allProgress[lessonId] = record;
            localStorage.setItem(APP_CONFIG.storageKeys.progress, JSON.stringify(allProgress));
            return true;
        } catch (e) {
            console.error('localStorage save failed', e);
            return false;
        }
    },

    // Get progress for a lesson
    async getProgress(lessonId) {
        if (this.db) {
            try {
                const tx = this.db.transaction('progress', 'readonly');
                const store = tx.objectStore('progress');
                const result = await store.get(lessonId);
                return result;
            } catch (e) {
                // fall through
            }
        }
        
        const allProgress = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.progress) || '{}');
        return allProgress[lessonId] || null;
    },

    // Get all progress for a domain
    async getDomainProgress(domainId) {
        if (this.db) {
            try {
                const tx = this.db.transaction('progress', 'readonly');
                const store = tx.objectStore('progress');
                const index = store.index('domain');
                const results = await index.getAll(domainId);
                return results;
            } catch (e) {
                // fall through
            }
        }
        
        const allProgress = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.progress) || '{}');
        return Object.values(allProgress).filter(p => p.domain === domainId);
    },

    // Get overall stats
    async getStats() {
        const allProgress = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.progress) || '{}');
        const values = Object.values(allProgress);
        return {
            totalCompleted: values.filter(v => v.completed).length,
            totalAttempted: values.length,
            totalStars: values.reduce((sum, v) => sum + (v.stars || 0), 0),
            lastActivity: values.length > 0 ? Math.max(...values.map(v => v.timestamp)) : null
        };
    },

    // Save a setting
    async saveSetting(key, value) {
        if (this.db) {
            try {
                const tx = this.db.transaction('settings', 'readwrite');
                tx.objectStore('settings').put({ key, value });
                return true;
            } catch (e) {}
        }
        localStorage.setItem(APP_CONFIG.storageKeys.settings + '_' + key, JSON.stringify(value));
        return true;
    },

    // Load a setting
    async getSetting(key) {
        if (this.db) {
            try {
                const tx = this.db.transaction('settings', 'readonly');
                const result = await tx.objectStore('settings').get(key);
                if (result) return result.value;
            } catch (e) {}
        }
        const val = localStorage.getItem(APP_CONFIG.storageKeys.settings + '_' + key);
        return val ? JSON.parse(val) : null;
    },

    // Add a reward
    async addReward(type, value) {
        const record = {
            type,
            value,
            earnedAt: Date.now()
        };
        
        if (this.db) {
            try {
                const tx = this.db.transaction('rewards', 'readwrite');
                tx.objectStore('rewards').add(record);
                return true;
            } catch (e) {}
        }
        return false;
    }
};

// Initialize on load
StorageManager.init();
