// Khanak Academy - App Configuration
const APP_CONFIG = {
    version: '1.0.0',
    language: 'fa-IR',
    direction: 'rtl',
    
    // Domain definitions
    domains: [
        {
            id: 'reading',
            name: 'خواندن و نوشتن فارسي',
            icon: 'book',
            color: '#FF6B6B',
            bgColor: '#FFE8E8',
            iconChar: '📖'
        },
        {
            id: 'math',
            name: 'رياضيات',
            icon: 'calculator',
            color: '#4ECDC4',
            bgColor: '#E0F7F5',
            iconChar: '🔢'
        },
        {
            id: 'logic',
            name: 'منطق و حل مسئله',
            icon: 'puzzle',
            color: '#A29BFE',
            bgColor: '#EDEAFE',
            iconChar: '🧩'
        },
        {
            id: 'science',
            name: 'علوم پايه',
            icon: 'flask',
            color: '#F9CA24',
            bgColor: '#FEF5D3',
            iconChar: '🔬'
        },
        {
            id: 'socio-emotional',
            name: 'مهارت اجتماعي-عاطفي',
            icon: 'heart',
            color: '#FF8A5C',
            bgColor: '#FFE5D6',
            iconChar: '❤️'
        },
        {
            id: 'art',
            name: 'هنر و خلاقيت',
            icon: 'palette',
            color: '#F368E0',
            bgColor: '#FDE0F8',
            iconChar: '🎨'
        }
    ],

    // Storage keys
    storageKeys: {
        progress: 'khanak_progress',
        settings: 'khanak_settings',
        parentPin: 'khanak_parent_pin'
    },

    // Game difficulty thresholds
    adaptive: {
        correctStreakUp: 3,   // After 3 correct answers, increase difficulty
        wrongStreakDown: 2,   // After 2 wrong answers, decrease difficulty
        maxDifficulty: 8,
        minDifficulty: 1
    },

    // Audio settings
    audio: {
        voiceEnabled: true,
        sfxEnabled: true,
        musicEnabled: false
    }
};

// Persian messages for the mascot
const MASCOT_MESSAGES = {
    greeting: [
        'سلام! امروز چي ياد ميگيريم؟',
        'خوش اومدي! آماده يادگيري هستي؟',
        'سلام دوست من! بيا با هم ياد بگيريم',
        'هي! امروز چقدر باحالي!'
    ],
    correct: [
        'آفرين! عالي بود!',
        'دقيقاً! تو باهوشي!',
        'به به! چه جواب قشنگي!',
        'هوراا! درست گفتي!'
    ],
    wrong: [
        'نه اشکال نداره، دوباره تلاش کن',
        'تقريباً درست بود، يه کم ديگه فکر کن',
        'نزديک بود! يه بار ديگه امتحان کن'
    ],
    encouragement: [
        'تو ميتوني! من به تو ايمان دارم!',
        'فقط يه کم ديگه مونده، ادامه بده',
        'عاليه! داري پيشرفت ميکني!'
    ]
};
