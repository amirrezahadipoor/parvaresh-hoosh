// 100% Offline Local Storage for "پرورش هوش کودک" (IndexedDB + LocalStorage fallback)
const Storage = (function() {
    const DB_NAME = 'parvaresh_hoosh_db_v2';
    const DB_VER = 1;
    const LS_KEY = 'parvaresh_hoosh_data_v2';
    let db = null;

    function openDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) return resolve(null);
            try {
                const req = indexedDB.open(DB_NAME, DB_VER);
                req.onupgradeneeded = (e) => {
                    const d = e.target.result;
                    if (!d.objectStoreNames.contains('records')) {
                        d.createObjectStore('records', { keyPath: 'id' });
                    }
                };
                req.onsuccess = (e) => {
                    db = e.target.result;
                    resolve(db);
                };
                req.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    }

    function readLS() {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function writeLS(obj) {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(obj));
        } catch (e) {}
    }

    function dbPut(id, data) {
        return new Promise((resolve) => {
            if (!db) return resolve(false);
            try {
                const tx = db.transaction('records', 'readwrite');
                tx.objectStore('records').put({ id, data, updated: Date.now() });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            } catch (e) {
                resolve(false);
            }
        });
    }

    function dbGet(id) {
        return new Promise((resolve) => {
            if (!db) return resolve(null);
            try {
                const tx = db.transaction('records', 'readonly');
                const req = tx.objectStore('records').get(id);
                req.onsuccess = () => resolve(req.result ? req.result.data : null);
                req.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    }

    async function init() {
        await openDB();
    }

    async function save(key, data) {
        const ok = await dbPut(key, data);
        const all = readLS();
        all[key] = data;
        writeLS(all);
    }

    async function load(key) {
        const v = await dbGet(key);
        if (v !== null && v !== undefined) return v;
        const all = readLS();
        return all[key] !== undefined ? all[key] : null;
    }

    async function clearAll() {
        try {
            localStorage.removeItem(LS_KEY);
            if (db) {
                const tx = db.transaction('records', 'readwrite');
                tx.objectStore('records').clear();
            }
        } catch (e) {}
    }

    return { init, save, load, clearAll };
})();
