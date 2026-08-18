// Local progression for endless games, records and educational badges.
window.GameProgress = (function() {
    const KEY = 'parvaresh_hoosh_game_progress_v1';
    let state = { games: {}, badges: [], totalRounds: 0 };

    function normalize() {
        if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
        if (!state.games || typeof state.games !== 'object' || Array.isArray(state.games)) state.games = {};
        Object.values(state.games).forEach(game => {
            game.bestScore = Number.isFinite(Number(game.bestScore)) ? Math.max(0, Number(game.bestScore)) : 0;
            game.plays = Number.isFinite(Number(game.plays)) ? Math.max(0, Number(game.plays)) : 0;
            game.rounds = Number.isFinite(Number(game.rounds)) ? Math.max(0, Number(game.rounds)) : 0;
            game.lastPlayed = game.lastPlayed || null;
        });
        state.badges = Array.isArray(state.badges) ? [...new Set(state.badges)] : [];
        state.totalRounds = Number.isFinite(Number(state.totalRounds)) ? Math.max(0, Number(state.totalRounds)) : 0;
    }

    function persist() {
        normalize();
        try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }

    function load() {
        try {
            const saved = window.localStorage.getItem(KEY);
            if (saved) state = JSON.parse(saved);
        } catch (e) { state = {}; }
        normalize();
    }

    function ensureGame(gameId) {
        if (!state.games[gameId]) state.games[gameId] = { bestScore: 0, plays: 0, rounds: 0, lastPlayed: null };
        return state.games[gameId];
    }

    function record(gameId, score = 0, rounds = 1) {
        const game = ensureGame(gameId);
        game.bestScore = Math.max(game.bestScore, Number(score) || 0);
        game.plays++;
        game.rounds += Math.max(1, Number(rounds) || 1);
        game.lastPlayed = Date.now();
        state.totalRounds += Math.max(1, Number(rounds) || 1);
        if (game.plays >= 1) state.badges.push(`${gameId}:starter`);
        if (game.bestScore >= 50) state.badges.push(`${gameId}:skilled`);
        if (state.totalRounds >= 20) state.badges.push('all:habit');
        persist();
        return { ...game };
    }

    function getStats(gameId) {
        return { ...ensureGame(gameId) };
    }

    function listBadges() {
        normalize();
        return [...state.badges];
    }

    function getTotalRounds() {
        normalize();
        return state.totalRounds;
    }

    function reset() {
        state = { games: {}, badges: [], totalRounds: 0 };
        try { window.localStorage.removeItem(KEY); } catch (e) {}
    }

    load();
    return { record, getStats, listBadges, getTotalRounds, reset };
})();
