// Global Configuration & Constants for "پرورش هوش کودک" - ZERO EMOJIS
const App = {
    name: 'پرورش هوش کودک',
    title: 'پرورش هوش کودک',
    version: '3.0.0',
    lang: 'fa-IR',
    dir: 'rtl',
    domains: [
        {
            id: 'reading',
            title: 'خواندن و الفبا',
            subtitle: 'الفبا، کلمات و جمله‌سازی',
            iconChar: 'الف',
            iconId: 'reading',
            color: '#FF6B6B',
            bg: '#FFE8E8',
            accent: '#EE5253'
        },
        {
            id: 'math',
            title: 'ریاضیات و اعداد',
            subtitle: 'شمارش، جمع، تفریق و اشکال',
            iconChar: '۱۲۳',
            iconId: 'math',
            color: '#4ECDC4',
            bg: '#E0F7F5',
            accent: '#0ABDE3'
        },
        {
            id: 'logic',
            title: 'منطق و پازل',
            subtitle: 'حافظه، الگوها و تفکر',
            iconChar: 'منطق',
            iconId: 'logic',
            color: '#A29BFE',
            bg: '#EDEAFE',
            accent: '#6C5CE7'
        },
        {
            id: 'science',
            title: 'علوم و طبیعت',
            subtitle: 'حیوانات، حواس و جهان',
            iconChar: 'علوم',
            iconId: 'science',
            color: '#F9CA24',
            bg: '#FEF5D3',
            accent: '#F39C12'
        },
        {
            id: 'socio-emotional',
            title: 'هوش هیجانی',
            subtitle: 'شناخت احساسات و آداب',
            iconChar: 'احساس',
            iconId: 'socio-emotional',
            color: '#FF8A5C',
            bg: '#FFE5D6',
            accent: '#E55039'
        },
        {
            id: 'art',
            title: 'هنر و خلاقیت',
            subtitle: 'رنگ‌آمیزی، نقاشی و بازی',
            iconChar: 'هنر',
            iconId: 'art',
            color: '#F368E0',
            bg: '#FDE0F8',
            accent: '#EA2027'
        }
    ],
    adaptive: {
        upStreak: 2,
        downStreak: 2,
        minLevel: 1,
        maxLevel: 8
    },
    sounds: true,
    voice: true
};

const MESSAGES = {
    greeting: [
        'سلام قشنگم! بیا با هم بازی‌های شاد رو شروع کنیم!',
        'خوش اومدی به دنیای شاد پرورش هوش کودک!',
        'سلام قهرمان زرنگم! آماده‌ای ستاره‌های قشنگ جمع کنیم؟',
        'سلام دوست مهربونم! بیا ببینیم امروز چه بازی‌های باحالی داریم!'
    ],
    correct: [
        'آفرین گل قشنگم! عالی بود!',
        'دقیقاً درست گفتی! چه باهوشی!',
        'به‌به! عالی جواب دادی زرنگ من!',
        'هورا! یک ستاره درخشان دیگه گرفتی!',
        'چقدر زرنگی دوست من! ادامه بده!'
    ],
    wrong: [
        'اشکالی نداره مهربونم، دوباره با دقت نگاه کن!',
        'خیلی نزدیک بود! یک بار دیگه با هم تلاش کنیم!',
        'تو خیلی باهوشی، مطمئنم این بار پیداش می‌کنی!'
    ],
    win: [
        'هورا! تبریک می‌گم! همه رو درست حل کردی گل من!',
        'تو یک قهرمان واقعی هستی! سه ستاره کامل گرفتی!',
        'عالی بود دوست زرنگم! بهت افتخار می‌کنم!'
    ]
};

// Explicit window exports keep the classic-script bundle compatible with WebViews and test runners.
window.App = App;
window.MESSAGES = MESSAGES;
