// Local child profile, daily goals and streak tracking.
// No account, server or identifying data is required.
window.Engagement = (function() {
    const KEY = 'parvaresh_hoosh_engagement_v1';
    const DEFAULT_GOAL = 3;
    let state = {
        profile: { name: '', age: null },
        profileCompleted: false,
        dailyGoal: DEFAULT_GOAL,
        lastActiveDate: null,
        currentStreak: 0,
        bestStreak: 0,
        today: { date: null, completed: 0, lessonIds: [] },
        reviewQueue: [],
        history: []
    };

    function localDateKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function shiftDate(dateKey, days) {
        const date = new Date(`${dateKey}T12:00:00`);
        date.setDate(date.getDate() + days);
        return localDateKey(date);
    }

    function normalize() {
        if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
        if (!state.profile || typeof state.profile !== 'object') state.profile = {};
        state.profile.name = typeof state.profile.name === 'string' ? state.profile.name.trim().slice(0, 24) : '';
        const age = Number(state.profile.age);
        state.profile.age = Number.isFinite(age) && age >= 4 && age <= 12 ? age : null;
        state.profileCompleted = Boolean(state.profileCompleted || state.profile.name || state.profile.age);
        const goal = Number(state.dailyGoal);
        state.dailyGoal = Number.isFinite(goal) ? Math.max(1, Math.min(5, Math.round(goal))) : DEFAULT_GOAL;
        state.lastActiveDate = typeof state.lastActiveDate === 'string' ? state.lastActiveDate : null;
        state.currentStreak = Number.isFinite(Number(state.currentStreak)) ? Math.max(0, Number(state.currentStreak)) : 0;
        state.bestStreak = Number.isFinite(Number(state.bestStreak)) ? Math.max(state.currentStreak, Number(state.bestStreak)) : state.currentStreak;
        if (!state.today || typeof state.today !== 'object') state.today = {};
        const today = localDateKey();
        if (state.today.date !== today) state.today = { date: today, completed: 0, lessonIds: [] };
        state.today.completed = Number.isFinite(Number(state.today.completed)) ? Math.max(0, Number(state.today.completed)) : 0;
        state.today.lessonIds = Array.isArray(state.today.lessonIds) ? [...new Set(state.today.lessonIds.filter(Boolean))] : [];
        state.today.completed = state.today.lessonIds.length;
        state.reviewQueue = Array.isArray(state.reviewQueue) ? state.reviewQueue.filter(item => item && item.lessonId).slice(-30) : [];
        state.history = Array.isArray(state.history) ? state.history.slice(-30) : [];
    }

    function persist() {
        normalize();
        if (window.Storage && typeof window.Storage.save === 'function') {
            return window.Storage.save('engagement', state);
        }
        try {
            window.localStorage.setItem(KEY, JSON.stringify(state));
        } catch (e) {}
        return Promise.resolve(false);
    }

    async function init() {
        try {
            if (window.Storage && typeof window.Storage.load === 'function') {
                const saved = await window.Storage.load('engagement');
                if (saved) state = saved;
            } else {
                const saved = window.localStorage.getItem(KEY);
                if (saved) state = JSON.parse(saved);
            }
        } catch (e) {
            state = {};
        }
        normalize();
        await persist();
    }

    function getProfile() {
        normalize();
        return { ...state.profile };
    }

    function hasProfile() {
        normalize();
        return Boolean(state.profileCompleted);
    }

    async function saveProfile(profile) {
        const name = typeof profile?.name === 'string' ? profile.name.trim().slice(0, 24) : '';
        const age = Number(profile?.age);
        state.profile = {
            name,
            age: Number.isFinite(age) && age >= 4 && age <= 12 ? age : null
        };
        state.profileCompleted = true;
        await persist();
        return getProfile();
    }

    function getToday() {
        normalize();
        return {
            date: state.today.date,
            completed: state.today.completed,
            goal: state.dailyGoal,
            remaining: Math.max(0, state.dailyGoal - state.today.completed),
            percent: Math.min(100, Math.round((state.today.completed / state.dailyGoal) * 100)),
            lessonIds: [...state.today.lessonIds]
        };
    }

    function getStreak() {
        normalize();
        return { current: state.currentStreak, best: state.bestStreak };
    }

    async function recordLesson(lessonId) {
        if (!lessonId) return getToday();
        normalize();
        const today = localDateKey();
        if (state.today.date !== today) {
            state.today = { date: today, completed: 0, lessonIds: [] };
        }
        if (!state.today.lessonIds.includes(lessonId)) {
            state.today.lessonIds.push(lessonId);
            state.today.completed = state.today.lessonIds.length;
        }

        if (state.lastActiveDate !== today) {
            if (state.lastActiveDate === shiftDate(today, -1)) {
                state.currentStreak += 1;
            } else {
                state.currentStreak = 1;
            }
            state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
            state.lastActiveDate = today;
        }

        const existing = state.history.find(item => item.date === today);
        if (existing) {
            existing.completed = state.today.completed;
        } else {
            state.history.push({ date: today, completed: state.today.completed });
        }
        state.history = state.history.slice(-30);
        await persist();
        return getToday();
    }

    async function recordMistake(lessonId, skillType) {
        if (!lessonId) return getReviewQueue();
        normalize();
        const existing = state.reviewQueue.find(item => item.lessonId === lessonId);
        if (existing) {
            existing.count = Math.min(9, (existing.count || 0) + 1);
            existing.lastAt = Date.now();
            existing.skillType = skillType || existing.skillType || '';
        } else {
            state.reviewQueue.push({ lessonId, skillType: skillType || '', count: 1, lastAt: Date.now() });
        }
        state.reviewQueue.sort((a, b) => (b.count - a.count) || (b.lastAt - a.lastAt));
        state.reviewQueue = state.reviewQueue.slice(0, 30);
        await persist();
        return getReviewQueue();
    }

    async function recordSuccess(lessonId) {
        if (!lessonId) return getReviewQueue();
        normalize();
        state.reviewQueue = state.reviewQueue.filter(item => item.lessonId !== lessonId);
        await persist();
        return getReviewQueue();
    }

    function getReviewQueue() {
        normalize();
        return state.reviewQueue.map(item => ({ ...item }));
    }

    function getHistory() {
        normalize();
        return state.history.map(item => ({ ...item }));
    }

    async function reset() {
        state = {
            profile: { name: '', age: null },
            profileCompleted: false,
            dailyGoal: DEFAULT_GOAL,
            lastActiveDate: null,
            currentStreak: 0,
            bestStreak: 0,
            today: { date: localDateKey(), completed: 0, lessonIds: [] },
            reviewQueue: [],
            history: []
        };
        if (window.Storage && typeof window.Storage.save === 'function') {
            await window.Storage.save('engagement', state);
        }
        try { window.localStorage.removeItem(KEY); } catch (e) {}
    }

    return {
        init,
        getProfile,
        hasProfile,
        saveProfile,
        getToday,
        getStreak,
        recordLesson,
        recordMistake,
        recordSuccess,
        getReviewQueue,
        getHistory,
        reset
    };
})();
