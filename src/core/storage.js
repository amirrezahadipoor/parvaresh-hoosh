// Offline-first persistence with IndexedDB and a LocalStorage fallback.
window.Storage = (function() {
    const DB_NAME = 'parvaresh_hoosh_db_v2';
    const DB_VER = 1;
    const STORE_NAME = 'records';
    const LS_KEY = 'parvaresh_hoosh_data_v2';
    let db = null;
    let openPromise = null;

    function openDB() {
        if (openPromise) return openPromise;
        if (!window.indexedDB) return Promise.resolve(null);

        openPromise = new Promise(resolve => {
            try {
                const req = window.indexedDB.open(DB_NAME, DB_VER);
                req.onupgradeneeded = event => {
                    const database = event.target.result;
                    if (!database.objectStoreNames.contains(STORE_NAME)) {
                        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                };
                req.onsuccess = event => {
                    db = event.target.result;
                    db.onversionchange = () => db.close();
                    resolve(db);
                };
                req.onerror = () => {
                    db = null;
                    resolve(null);
                };
                req.onblocked = () => resolve(null);
            } catch (e) {
                db = null;
                resolve(null);
            }
        });
        return openPromise;
    }

    function readLS() {
        try {
            const raw = window.localStorage.getItem(LS_KEY);
            const value = raw ? JSON.parse(raw) : {};
            return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        } catch (e) {
            return {};
        }
    }

    function writeLS(value) {
        try {
            window.localStorage.setItem(LS_KEY, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    function dbPut(id, data) {
        return new Promise(resolve => {
            if (!db) return resolve(false);
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({ id, data, updated: Date.now() });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
                tx.onabort = () => resolve(false);
            } catch (e) {
                resolve(false);
            }
        });
    }

    function dbGet(id) {
        return new Promise(resolve => {
            if (!db) return resolve(null);
            try {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const req = tx.objectStore(STORE_NAME).get(id);
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
        const dbSaved = await dbPut(key, data);
        const all = readLS();
        all[key] = data;
        const localSaved = writeLS(all);
        return dbSaved || localSaved;
    }

    async function load(key) {
        const value = await dbGet(key);
        if (value !== null && value !== undefined) return value;
        const all = readLS();
        return Object.prototype.hasOwnProperty.call(all, key) ? all[key] : null;
    }

    async function clearAll() {
        try { window.localStorage.removeItem(LS_KEY); } catch (e) {}
        if (!db) return;
        await new Promise(resolve => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).clear();
                tx.oncomplete = resolve;
                tx.onerror = resolve;
                tx.onabort = resolve;
            } catch (e) {
                resolve();
            }
        });
    }

    async function exportAll() {
        const all = readLS();
        if (!db) return all;
        await new Promise(resolve => {
            try {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const req = tx.objectStore(STORE_NAME).getAll();
                req.onsuccess = () => {
                    (req.result || []).forEach(record => {
                        if (record && record.id) all[record.id] = record.data;
                    });
                    resolve();
                };
                req.onerror = resolve;
            } catch (e) {
                resolve();
            }
        });
        return all;
    }

    async function importAll(records) {
        if (!records || typeof records !== 'object' || Array.isArray(records)) {
            throw new Error('invalid storage records');
        }
        await clearAll();
        for (const [key, value] of Object.entries(records)) await save(key, value);
    }

    return { init, save, load, clearAll, exportAll, importAll };
})();
