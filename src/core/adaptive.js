// Adaptive difficulty engine
// Tracks performance per domain and adjusts difficulty level
const Adaptive = (function() {
    const KEY = 'khanak_adaptive';
    let state = { domains: {} };

    function load() {
        const saved = window.localStorage.getItem(KEY);
        if (saved) {
            try { state = JSON.parse(saved); } catch (e) {}
        }
    }

    function persist() {
        try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
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

    // Record a result (correct: boolean) and return updated difficulty
    function record(domainId, correct) {
        const d = getDomain(domainId);
        d.total++;
        d.streak = correct ? d.streak + 1 : 0;
        if (correct) d.correct++;

        // adjust difficulty
        if (d.streak >= App.adaptive.upStreak && d.difficulty < App.adaptive.max) {
            d.difficulty++;
            d.streak = 0;
        } else if (!correct && d.difficulty > App.adaptive.min) {
            d.difficulty--;
            d.streak = 0;
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
        d.difficulty = Math.min(App.adaptive.max, Math.max(App.adaptive.min, level));
        persist();
    }

    // Stats for parent dashboard
    function stats(domainId) {
        const d = getDomain(domainId);
        return {
            difficulty: d.difficulty,
            total: d.total,
            correct: d.correct,
            accuracy: d.total ? Math.round(100 * d.correct / d.total) : 0,
            history: d.history.slice(-20)
        };
    }

    load();
    return { record, getDifficulty, setDifficulty, stats };
})();
