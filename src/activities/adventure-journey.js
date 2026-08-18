// Age-ordered learning journey. The child always sees younger/earlier content first,
// then progressively harder content within the same age band.
window.AdventureJourney = (function() {
    function ageStart(ageBand) {
        const m = String(ageBand || '').match(/(\d+)\s*تا\s*(\d+)/);
        return m ? Number(m[1]) : 99;
    }

    function getCurriculumLessons() {
        const curriculum = (window.AppState && window.AppState.curriculum) || window.CURRICULUM || null;
        if (!curriculum || !Array.isArray(curriculum.domains)) return [];
        const out = [];
        curriculum.domains.forEach((dom, domainIndex) => {
            (dom.levels || []).forEach((lv, levelIndex) => {
                (lv.lessons || []).forEach((lesson, lessonIndex) => {
                    out.push({
                        ...lesson,
                        domain: dom.id,
                        domainTitle: dom.title,
                        domainIndex,
                        levelIndex,
                        lessonIndex,
                        levelTitle: lv.title
                    });
                });
            });
        });
        return out.sort((a,b) =>
            ageStart(a.ageBand) - ageStart(b.ageBand) ||
            (a.difficulty || 999) - (b.difficulty || 999) ||
            a.domainIndex - b.domainIndex ||
            a.levelIndex - b.levelIndex ||
            (a.order || a.lessonIndex) - (b.order || b.lessonIndex)
        );
    }

    function getNodes() {
        return getCurriculumLessons().map((lesson, i) => ({
            id: `age-journey-${i + 1}`,
            title: lesson.title,
            domain: lesson.domain,
            lessonId: lesson.id,
            icon: lesson.domainTitle || 'درس',
            color: '#6C5CE7',
            ageBand: lesson.ageBand || '',
            levelTitle: lesson.levelTitle || ''
        }));
    }

    function getNextNode(lessonsDone) {
        const progress = lessonsDone || {};
        return getNodes().find(node => !progress[node.lessonId] || !progress[node.lessonId].done) || null;
    }

    return { getNodes, getNextNode };
})();
