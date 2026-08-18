// Global Configuration & Constants for "پرورش هوش کودک"
const App = {
    name: 'پرورش هوش کودک',
    title: 'پرورش هوش کودک',
    version: '2.0.0',
    lang: 'fa-IR',
    dir: 'rtl',
    domains: [
        {
            id: 'reading',
            title: 'خواندن و الفبا',
            subtitle: 'الفبا، کلمات و جمله‌سازی',
            iconChar: 'الف',
            color: '#FF6B6B',
            bg: '#FFE8E8',
            accent: '#EE5253'
        },
        {
            id: 'math',
            title: 'ریاضیات و اعداد',
            subtitle: 'شمارش، جمع، تفریق و اشکال',
            iconChar: '۱۲۳',
            color: '#4ECDC4',
            bg: '#E0F7F5',
            accent: '#0ABDE3'
        },
        {
            id: 'logic',
            title: 'منطق و پازل',
            subtitle: 'حافظه، الگوها و تفکر',
            iconChar: '🧩',
            color: '#A29BFE',
            bg: '#EDEAFE',
            accent: '#6C5CE7'
        },
        {
            id: 'science',
            title: 'علوم و طبیعت',
            subtitle: 'حیوانات، حواس و جهان',
            iconChar: '🌱',
            color: '#F9CA24',
            bg: '#FEF5D3',
            accent: '#F39C12'
        },
        {
            id: 'socio-emotional',
            title: 'هوش هیجانی',
            subtitle: 'شناخت احساسات و آداب',
            iconChar: '❤️',
            color: '#FF8A5C',
            bg: '#FFE5D6',
            accent: '#E55039'
        },
        {
            id: 'art',
            title: 'هنر و خلاقیت',
            subtitle: 'رنگ‌آمیزی، نقاشی و بازی',
            iconChar: '🎨',
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
        'سلام دوست مهربونم! بیا با هم بازی و یادگیری رو شروع کنیم!',
        'خوش اومدی به پرورش هوش کودک! امروز کلی مرحله قشنگ داریم!',
        'سلام قهرمان باهوش! آماده‌ای یک عالمه ستاره درخشان بگیری؟',
        'سلام روباه دانا منتظرته! بیا بریم سراغ بازی‌های شاد!'
    ],
    correct: [
        'آفرین! فوق‌العاده بود!',
        'دقیقاً درسته! چه باهوشی!',
        'به‌به! عالی جواب دادی!',
        'هورا! یک ستاره درخشان دیگه گرفتی!',
        'چقدر زرنگی دوست من! ادامه بده!'
    ],
    wrong: [
        'اشکالی نداره مهربونم، دوباره با دقت نگاه کن!',
        'نزدیک بود! یک بار دیگه با هم تلاش کنیم!',
        'تو خیلی باهوشی، مطمئنم این بار پیداش می‌کنی!'
    ],
    win: [
        'هورااا! تبریک می‌گم! همه رو درست حل کردی!',
        'تو یک قهرمان واقعی هستی! سه ستاره کامل گرفتی!',
        'عالی بود دوست زرنگم! دانا بهت افتخار می‌کنه!'
    ]
};
