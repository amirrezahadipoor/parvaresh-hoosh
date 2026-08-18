// Smart Learning Journey & Adventure Island Map for "پرورش هوش کودک"
// Blends Alphabet, Math, Logic, Science, and Art into a cohesive Easy-to-Hard adventure path
window.AdventureJourney = (function() {

    // 24 Progressive Adventure Island Milestones
    const JOURNEY_NODES = [
        { id: 'adv-1', title: '۱. ورود به جزیره الفبا', domain: 'reading', lessonId: 'R-L1-L01', icon: 'الف', color: '#FF6B6B', difficulty: 1 },
        { id: 'adv-2', title: '۲. برکه شمارش اعداد', domain: 'math', lessonId: 'M-L1-L01', icon: '۱', color: '#4ECDC4', difficulty: 1 },
        { id: 'adv-3', title: '۳. جنگل حیوانات دانا', domain: 'science', lessonId: 'S-L1-L01', icon: '🐾', color: '#F9CA24', difficulty: 1 },
        { id: 'adv-4', title: '۴. کارگاه رنگ‌آمیزی شاد', domain: 'art', lessonId: 'A-L1-L01', icon: '🎨', color: '#F368E0', difficulty: 1 },
        { id: 'adv-5', title: '۵. پازل حافظه جادویی', domain: 'logic', lessonId: 'L-L1-L01', icon: '🧩', color: '#A29BFE', difficulty: 1 },
        { id: 'adv-6', title: '۶. قطار صدای کلمات', domain: 'reading', lessonId: 'R-L1-L02', icon: 'ب', color: '#FF6B6B', difficulty: 2 },
        { id: 'adv-7', title: '۷. باغ اشکال هندسی', domain: 'math', lessonId: 'M-L3-L01', icon: '🔺', color: '#4ECDC4', difficulty: 2 },
        { id: 'adv-8', title: '۸. کاشف حواس پنج‌گانه', domain: 'science', lessonId: 'S-L2-L01', icon: '👁️', color: '#F9CA24', difficulty: 2 },
        { id: 'adv-9', title: '۹. شهر احساسات مهربان', domain: 'socio-emotional', lessonId: 'SE-L1-L01', icon: '❤️', color: '#FF8A5C', difficulty: 2 },
        { id: 'adv-10', title: '۱۰. چالش پیدا کردن تفاوت‌ها', domain: 'logic', lessonId: 'L-L2-L01', icon: '🔍', color: '#A29BFE', difficulty: 2 },
        { id: 'adv-11', title: '۱۱. نوشتن حروف با انگشت', domain: 'reading', lessonId: 'R-L5-L01', icon: '✍️', color: '#FF6B6B', difficulty: 3 },
        { id: 'adv-12', title: '۱۲. جمع‌های کوچک ستاره‌ای', domain: 'math', lessonId: 'M-L4-L01', icon: '➕', color: '#4ECDC4', difficulty: 3 },
        { id: 'adv-13', title: '۱۳. سفر در چهار فصل سال', domain: 'science', lessonId: 'S-L4-L01', icon: '🌈', color: '#F9CA24', difficulty: 3 },
        { id: 'adv-14', title: '۱۴. کلمات هم‌قافیه و شعر', domain: 'reading', lessonId: 'R-L2-L02', icon: '🎵', color: '#FF6B6B', difficulty: 3 },
        { id: 'adv-15', title: '۱۵. پازل ترتیب رشد گیاه', domain: 'logic', lessonId: 'L-L4-L03', icon: '🌱', color: '#A29BFE', difficulty: 4 },
        { id: 'adv-16', title: '۱۶. تفریق‌های ملموس و شاد', domain: 'math', lessonId: 'M-L5-L01', icon: '➖', color: '#4ECDC4', difficulty: 4 },
        { id: 'adv-17', title: '۱۷. شناخت متضادها و کلمات', domain: 'reading', lessonId: 'R-L4-L05', icon: '↔️', color: '#FF6B6B', difficulty: 4 },
        { id: 'adv-18', title: '۱۸. رفتارها و آداب معاشرت', domain: 'socio-emotional', lessonId: 'SE-L2-L01', icon: '🌟', color: '#FF8A5C', difficulty: 4 },
        { id: 'adv-19', title: '۱۹. جمله‌سازی با کارت‌ها', domain: 'reading', lessonId: 'R-L4-L02', icon: '📝', color: '#FF6B6B', difficulty: 5 },
        { id: 'adv-20', title: '۲۰. الگوهای پیشرفته ریاضی', domain: 'math', lessonId: 'M-L6-L01', icon: '🔢', color: '#4ECDC4', difficulty: 5 },
        { id: 'adv-21', title: '۲۱. داستان‌خوانی و ترتیب وقایع', domain: 'logic', lessonId: 'L-L4-L02', icon: '📖', color: '#A29BFE', difficulty: 5 },
        { id: 'adv-22', title: '۲۲. زیستگاه حیوانات جنگل', domain: 'science', lessonId: 'S-L5-L01', icon: '🦁', color: '#F9CA24', difficulty: 6 },
        { id: 'adv-23', title: '۲۳. جشن جمع و تفریق تا ۲۰', domain: 'math', lessonId: 'M-L7-L01', icon: '⭐', color: '#4ECDC4', difficulty: 6 },
        { id: 'adv-24', title: '۲۴. تاج طلایی قهرمان هوش', domain: 'art', lessonId: 'A-L4-L01', icon: '👑', color: '#F368E0', difficulty: 6 }
    ];

    function getNodes() {
        return JOURNEY_NODES;
    }

    function getNextNode(lessonsDone) {
        for (const node of JOURNEY_NODES) {
            if (!lessonsDone[node.lessonId] || !lessonsDone[node.lessonId].done) {
                return node;
            }
        }
        return JOURNEY_NODES[JOURNEY_NODES.length - 1];
    }

    return { getNodes, getNextNode };
})();
