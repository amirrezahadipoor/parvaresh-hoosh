// Adaptive Difficulty & Skill Mastery Engine for "پرورش هوش کودک"
// 100% Local & Adaptive Assessment without stressful tests
const Adaptive = (function() {
    const KEY = 'parvaresh_hoosh_adaptive_v2';
    let state = { domains: {} };

    function load() {
        try {
            const saved = window.localStorage.getItem(KEY);
            if (saved) state = JSON.parse(saved);
        } catch (e) {}
    }

    function persist() {
        try {
            window.localStorage.setItem(KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function getDomain(domainId) {
        if (!state.domains[domainId]) {
            state.domains[domainId] = {
                difficulty: 1,
                streak: 0,
                total: 0,
                correct: 0,
                history: []
            };
        }
        return state.domains[domainId];
    }

    function record(domainId, correct) {
        const d = getDomain(domainId);
        d.total++;
        if (correct) {
            d.correct++;
            d.streak++;
        } else {
            d.streak = 0;
        }

        // Adaptive level step up/down
        if (d.streak >= App.adaptive.upStreak && d.difficulty < App.adaptive.maxLevel) {
            d.difficulty++;
            d.streak = 0;
        } else if (!correct && d.streak === 0 && d.difficulty > App.adaptive.minLevel) {
            d.difficulty = Math.max(App.adaptive.minLevel, d.difficulty - 1);
        }

        d.history.push({ t: Date.now(), correct });
        if (d.history.length > 100) d.history.shift();
        persist();
        return d.difficulty;
    }

    function getDifficulty(domainId) {
        return getDomain(domainId).difficulty;
    }

    function setDifficulty(domainId, level) {
        const d = getDomain(domainId);
        d.difficulty = Math.min(App.adaptive.maxLevel, Math.max(App.adaptive.minLevel, level));
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
        persist();
    }

    load();
    return { record, getDifficulty, setDifficulty, stats, reset };
})();
