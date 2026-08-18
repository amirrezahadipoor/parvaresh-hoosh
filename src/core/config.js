// Khanak Academy - Global Config
const App = {
    version: '1.0.0',
    lang: 'fa-IR',
    dir: 'rtl',
    domains: [
        { id: 'reading', icon: 'book', iconChar: 'ک', color: '#FF6B6B', bg: '#FFE8E8' },
        { id: 'math', icon: 'calc', iconChar: '۱', color: '#4ECDC4', bg: '#E0F7F5' },
        { id: 'logic', icon: 'puzzle', iconChar: '؟', color: '#A29BFE', bg: '#EDEAFE' },
        { id: 'science', icon: 'flask', iconChar: 'ب', color: '#F9CA24', bg: '#FEF5D3' },
        { id: 'socio-emotional', icon: 'heart', iconChar: 'د', color: '#FF8A5C', bg: '#FFE5D6' },
        { id: 'art', icon: 'palette', iconChar: 'ر', color: '#F368E0', bg: '#FDE0F8' }
    ],
    adaptive: {
        upStreak: 2,      // correct answers to go up
        downStreak: 2,    // wrong answers to go down
        min: 1,
        max: 8
    },
    sounds: true,
    voice: true
};

const MESSAGES = {
    greeting: ['سلام! امروز چي ياد مي‌گيريم؟', 'خوش اومدي دوست من!', 'سلام روباه کوچولو، آماده‌اي؟', 'بيا با هم بازي کنيم و ياد بگيريم!'],
    correct: ['آفرين! عالي بود!', 'دقيقاً درست است!', 'چه باهوشي!', 'هورا، درست جواب دادي!', 'به به! خيلي خوب!'],
    wrong: ['اشکال نداره، دوباره تلاش کن', 'نزديک بود، يک بار ديگه فکر کن', 'تو مي‌توني، دوباره امتحان کن'],
    win: ['تبريک! همه را درست جواب دادي!', 'تو قهرماني!', 'چه عالي! سه ستاره گرفتي!']
};
