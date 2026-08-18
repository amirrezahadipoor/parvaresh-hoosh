// Local adaptive difficulty and skill mastery engine.
window.Adaptive = (function() {
    const KEY = 'parvaresh_hoosh_adaptive_v2';
    let state = { domains: {} };

    function normalize() {
        if (!state || typeof state !== 'object' || Array.isArray(state)) state = { domains: {} };
        if (!state.domains || typeof state.domains !== 'object' || Array.isArray(state.domains)) state.domains = {};
        Object.keys(state.domains).forEach(id => {
            const d = state.domains[id];
            if (!d || typeof d !== 'object' || Array.isArray(d)) {
                delete state.domains[id];
                return;
            }
            d.difficulty = Number.isFinite(Number(d.difficulty)) ? Math.max(window.App.adaptive.minLevel, Math.min(window.App.adaptive.maxLevel, Number(d.difficulty))) : window.App.adaptive.minLevel;
            d.streak = Number.isFinite(Number(d.streak)) ? Math.max(0, Number(d.streak)) : 0;
            d.total = Number.isFinite(Number(d.total)) ? Math.max(0, Number(d.total)) : 0;
            d.correct = Number.isFinite(Number(d.correct)) ? Math.max(0, Math.min(d.total, Number(d.correct))) : 0;
            d.history = Array.isArray(d.history) ? d.history.slice(-100) : [];
        });
    }

    function load() {
        try {
            const saved = window.localStorage.getItem(KEY);
            if (saved) state = JSON.parse(saved);
        } catch (e) {
            state = { domains: {} };
        }
        normalize();
    }

    function persist() {
        try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }

    function getDomain(domainId) {
        const id = domainId || 'general';
        if (!state.domains[id]) {
            state.domains[id] = {
                difficulty: window.App.adaptive.minLevel,
                streak: 0,
                total: 0,
                correct: 0,
                history: []
            };
        }
        return state.domains[id];
    }

    function record(domainId, correct) {
        const d = getDomain(domainId);
        const isCorrect = Boolean(correct);
        d.total++;
        if (isCorrect) {
            d.correct++;
            d.streak++;
        } else {
            d.streak = 0;
        }

        // Smarter progression: a single slip no longer demotes the child. We look at
        // recent accuracy (last 8 answers) so difficulty tracks real ability rather
        // than one unlucky tap, which used to yo-yo the level constantly.
        if (!isCorrect) d.misses = (d.misses || 0) + 1; else d.misses = 0;

        const recent = d.history.slice(-7).concat([{ correct: isCorrect }]);
        const recentAcc = recent.length >= 4
            ? recent.filter(h => h.correct).length / recent.length
            : null;

        if (d.streak >= window.App.adaptive.upStreak && d.difficulty < window.App.adaptive.maxLevel) {
            d.difficulty++;
            d.streak = 0;
            d.misses = 0;
        } else if (recentAcc !== null && recentAcc >= 0.85 && d.difficulty < window.App.adaptive.maxLevel) {
            // Consistently strong across a window -> promote even without a long streak.
            d.difficulty++;
            d.misses = 0;
        } else if (d.misses >= 2 && recentAcc !== null && recentAcc < 0.5 && d.difficulty > window.App.adaptive.minLevel) {
            // Two misses in a row AND a weak window -> ease off.
            d.difficulty = Math.max(window.App.adaptive.minLevel, d.difficulty - 1);
            d.misses = 0;
        }

        d.history.push({ t: Date.now(), correct: isCorrect });
        if (d.history.length > 100) d.history.shift();
        persist();
        return d.difficulty;
    }

    function getDifficulty(domainId) {
        return getDomain(domainId).difficulty;
    }

    function setDifficulty(domainId, level) {
        const d = getDomain(domainId);
        const numeric = Number(level);
        d.difficulty = Number.isFinite(numeric)
            ? Math.min(window.App.adaptive.maxLevel, Math.max(window.App.adaptive.minLevel, numeric))
            : window.App.adaptive.minLevel;
        persist();
    }

    function stats(domainId) {
        const d = getDomain(domainId);
        const accuracy = d.total ? Math.round((100 * d.correct) / d.total) : 0;
        let statusLabel = 'آغاز یادگیری';
        let statusClass = 'neutral';
        let tip = 'با تمرین روزانه ۵ دقیقه، مهارت‌ها به سرعت تثبیت می‌شوند.';

        if (d.total >= 3) {
            if (accuracy >= 80) {
                statusLabel = 'تسلط عالی';
                statusClass = 'excellent';
                tip = 'عملکرد کودک در این زمینه درخشان است؛ آماده برای مراحل پیشرفته‌تر!';
            } else if (accuracy >= 60) {
                statusLabel = 'در حال پیشرفت';
                statusClass = 'good';
                tip = 'پیشرفت خوبی دارد و با چند مرحله تمرین بیشتر به تسلط کامل می‌رسد.';
            } else {
                statusLabel = 'نیازمند تمرین بیشتر';
                statusClass = 'needs-practice';
                tip = 'توصیه می‌شود فعالیت‌های این بخش با همراهی و راهنمایی والد مرور شود.';
            }
        }

        return {
            difficulty: d.difficulty,
            total: d.total,
            correct: d.correct,
            accuracy,
            statusLabel,
            statusClass,
            tip,
            history: d.history.slice(-20)
        };
    }

    function reset() {
        state = { domains: {} };
        try { window.localStorage.removeItem(KEY); } catch (e) {}
    }

    load();
    return { record, getDifficulty, setDifficulty, stats, reset };
})();
