// Khanak Academy - Local storage (IndexedDB with localStorage fallback)
const Storage = (function() {
    const DB_NAME = 'khanak_db';
    const DB_VER = 1;
    const LS_KEY = 'khanak_data_v1';
    let db = null;

    function openDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) return resolve(null);
            const req = indexedDB.open(DB_NAME, DB_VER);
            req.onupgradeneeded = (e) => {
                const d = e.target.result;
                if (!d.objectStoreNames.contains('records')) {
                    d.createObjectStore('records', { keyPath: 'id' });
                }
            };
            req.onsuccess = (e) => { db = e.target.result; resolve(db); };
            req.onerror = () => resolve(null);
        });
    }

    // Fallback: single JSON blob in localStorage
    function readLS() {
        try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
        catch (e) { return {}; }
    }
    function writeLS(obj) {
        try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch (e) {}
    }

    function dbPut(id, data) {
        return new Promise((resolve) => {
            if (!db) return resolve(false);
            try {
                const tx = db.transaction('records', 'readwrite');
                tx.objectStore('records').put({ id, data, updated: Date.now() });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            } catch (e) { resolve(false); }
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
            } catch (e) { resolve(null); }
        });
    }

    async function init() {
        await openDB();
    }

    async function save(key, data) {
        const ok = await dbPut(key, data);
        if (!ok) {
            const all = readLS();
            all[key] = data;
            writeLS(all);
        }
    }

    async function load(key) {
        const v = await dbGet(key);
        if (v !== null && v !== undefined) return v;
        const all = readLS();
        return all[key] || null;
    }

    async function loadAll(prefix) {
        const out = {};
        if (db) {
            try {
                const tx = db.transaction('records', 'readonly');
                const req = tx.objectStore('records').getAll();
                req.onsuccess = () => {
                    (req.result || []).forEach(r => {
                        if (!prefix || r.id.startsWith(prefix)) out[r.id] = r.data;
                    });
                };
            } catch (e) {}
        }
        const all = readLS();
        Object.keys(all).forEach(k => {
            if (!prefix || k.startsWith(prefix)) out[k] = all[k];
        });
        return out;
    }

    return { init, save, load, loadAll };
})();
