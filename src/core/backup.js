// Versioned, offline-only backup and restore for parent-controlled data.
window.BackupRestore = (function() {
    const FORMAT = 'parvaresh-hoosh-backup';
    const SCHEMA_VERSION = 1;
    const MAX_SERIALIZED_BYTES = 20 * 1024 * 1024;
    const ALLOWED_RECORD_KEYS = new Set([
        'settings', 'progress', 'engagement', 'selected_mascot', 'parvaresh_parent_pin'
    ]);
    const EXTRA_KEYS = [
        'parvaresh_hoosh_adaptive_v2',
        'parvaresh_hoosh_iq_v3',
        'parvaresh_hoosh_game_progress_v1',
        'parvaresh_hoosh_engagement_v1',
        'ph_gallery'
    ];

    function getExtraLocalStorage() {
        const values = {};
        EXTRA_KEYS.forEach(key => {
            const value = window.localStorage.getItem(key);
            if (value !== null) values[key] = value;
        });
        return values;
    }

    async function create() {
        const records = window.Storage && window.Storage.exportAll ? await window.Storage.exportAll() : {};
        return {
            format: FORMAT,
            schemaVersion: SCHEMA_VERSION,
            appVersion: window.App && window.App.version || 'unknown',
            exportedAt: new Date().toISOString(),
            records,
            localStorage: getExtraLocalStorage()
        };
    }

    function serialize(payload) {
        return JSON.stringify(payload, null, 2);
    }

    function download(payload) {
        const blob = new Blob([serialize(payload)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `پشتیبان-پرورش-هوش-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function validate(payload) {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('ساختار فایل معتبر نیست');
        if (payload.format !== FORMAT) throw new Error('این فایل مربوط به پرورش هوش کودک نیست');
        if (payload.schemaVersion !== SCHEMA_VERSION) throw new Error('نسخهٔ فایل پشتیبان پشتیبانی نمی‌شود');
        if (!payload.records || typeof payload.records !== 'object' || Array.isArray(payload.records)) throw new Error('داده‌های فایل ناقص است');
        if (payload.localStorage && (typeof payload.localStorage !== 'object' || Array.isArray(payload.localStorage))) throw new Error('تنظیمات فایل ناقص است');

        let serialized;
        try { serialized = JSON.stringify(payload); } catch (error) { throw new Error('فایل پشتیبان قابل خواندن نیست'); }
        if (new Blob([serialized]).size > MAX_SERIALIZED_BYTES) throw new Error('حجم فایل پشتیبان بیش از حد مجاز است');

        for (const key of Object.keys(payload.records)) {
            if (!ALLOWED_RECORD_KEYS.has(key)) throw new Error(`کلید ناشناخته در پشتیبان: ${key}`);
        }
        for (const [key, value] of Object.entries(payload.localStorage || {})) {
            if (!EXTRA_KEYS.includes(key) || typeof value !== 'string') throw new Error('تنظیمات فایل معتبر نیست');
            if (value.length > MAX_SERIALIZED_BYTES) throw new Error('یکی از بخش‌های پشتیبان بیش از حد بزرگ است');
        }
        return payload;
    }

    async function restore(payload) {
        const valid = validate(payload);
        if (!window.Storage || !window.Storage.importAll) throw new Error('ذخیره‌سازی آفلاین در دسترس نیست');
        await window.Storage.importAll(valid.records);
        EXTRA_KEYS.forEach(key => window.localStorage.removeItem(key));
        Object.entries(valid.localStorage || {}).forEach(([key, value]) => {
            if (EXTRA_KEYS.includes(key) && typeof value === 'string') window.localStorage.setItem(key, value);
        });
    }

    return { create, serialize, download, validate, restore, FORMAT, SCHEMA_VERSION };
})();
