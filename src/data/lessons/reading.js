// تولیدشده با scripts/build-reading-lessons.js — دستی ویرایش نکنید.
//
// هر درس فقط از حروفی ساخته شده که کلیپ صوتی واقعی دارند.
// حروف بدون صدا: هیچ‌کدام — هر ۳۲ حرف صدا دارند

export const READING_LESSONS = [
  {
    "id": "reading-letters-01",
    "domain": "reading",
    "order": 1,
    "title": "نشانه‌های ا ب د",
    "schoolLessons": [
      "آ ا ــ بـ ب",
      "اَ ــ د"
    ],
    "goal": "کودک صدای حرف‌های ا، ب، د را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "ا",
      "ب",
      "د"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "ا",
        "name": "الف",
        "prompt": "کدام یکی حرف «الف» است؟",
        "speak": "صدای حرف الف",
        "answer": "ا",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ب",
        "name": "بِ",
        "prompt": "کدام یکی حرف «بِ» است؟",
        "speak": "صدای حرف بِ",
        "answer": "ب",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "د",
        "name": "دال",
        "prompt": "کدام یکی حرف «دال» است؟",
        "speak": "صدای حرف دال",
        "answer": "د",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "ا",
        "name": "الف",
        "prompt": "با انگشت روی حرف «ا» بکش",
        "speak": "با انگشت روی حرف ا بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ب",
        "name": "بِ",
        "prompt": "با انگشت روی حرف «ب» بکش",
        "speak": "با انگشت روی حرف ب بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "د",
        "name": "دال",
        "prompt": "با انگشت روی حرف «د» بکش",
        "speak": "با انگشت روی حرف د بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ب",
        "name": "بِ",
        "prompt": "کدام کلمه با حرف «ب» شروع می‌شود؟",
        "answer": "باد",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "د",
        "name": "دال",
        "prompt": "کدام کلمه با حرف «د» شروع می‌شود؟",
        "answer": "داد",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ا» یا «ب» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-02",
    "domain": "reading",
    "order": 2,
    "title": "نشانه‌های م س و ت",
    "schoolLessons": [
      "مـ م ــ سـ س",
      "او و ــ تـ ت"
    ],
    "goal": "کودک صدای حرف‌های م، س، و، ت را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "م",
      "س",
      "و",
      "ت"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "م",
        "name": "میم",
        "prompt": "کدام یکی حرف «میم» است؟",
        "speak": "صدای حرف میم",
        "answer": "م",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "س",
        "name": "سین",
        "prompt": "کدام یکی حرف «سین» است؟",
        "speak": "صدای حرف سین",
        "answer": "س",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "و",
        "name": "واو",
        "prompt": "کدام یکی حرف «واو» است؟",
        "speak": "صدای حرف واو",
        "answer": "و",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ت",
        "name": "تِ",
        "prompt": "کدام یکی حرف «تِ» است؟",
        "speak": "صدای حرف تِ",
        "answer": "ت",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "م",
        "name": "میم",
        "prompt": "با انگشت روی حرف «م» بکش",
        "speak": "با انگشت روی حرف م بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "س",
        "name": "سین",
        "prompt": "با انگشت روی حرف «س» بکش",
        "speak": "با انگشت روی حرف س بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "و",
        "name": "واو",
        "prompt": "با انگشت روی حرف «و» بکش",
        "speak": "با انگشت روی حرف و بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ت",
        "name": "تِ",
        "prompt": "با انگشت روی حرف «ت» بکش",
        "speak": "با انگشت روی حرف ت بکش"
      },
      {
        "kind": "letter-word",
        "letter": "م",
        "name": "میم",
        "prompt": "کدام کلمه با حرف «م» شروع می‌شود؟",
        "answer": "ماست",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "س",
        "name": "سین",
        "prompt": "کدام کلمه با حرف «س» شروع می‌شود؟",
        "answer": "سام",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ت",
        "name": "تِ",
        "prompt": "کدام کلمه با حرف «ت» شروع می‌شود؟",
        "answer": "توت",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «م» یا «س» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-03",
    "domain": "reading",
    "order": 3,
    "title": "نشانه‌های ر ن ی ز",
    "schoolLessons": [
      "ر ــ نـ ن",
      "ایـ یـ ی ــ ز"
    ],
    "goal": "کودک صدای حرف‌های ر، ن، ی، ز را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "ر",
      "ن",
      "ی",
      "ز"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "ر",
        "name": "رِ",
        "prompt": "کدام یکی حرف «رِ» است؟",
        "speak": "صدای حرف رِ",
        "answer": "ر",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ن",
        "name": "نون",
        "prompt": "کدام یکی حرف «نون» است؟",
        "speak": "صدای حرف نون",
        "answer": "ن",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ی",
        "name": "یِ",
        "prompt": "کدام یکی حرف «یِ» است؟",
        "speak": "صدای حرف یِ",
        "answer": "ی",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ز",
        "name": "زِ",
        "prompt": "کدام یکی حرف «زِ» است؟",
        "speak": "صدای حرف زِ",
        "answer": "ز",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "ر",
        "name": "رِ",
        "prompt": "با انگشت روی حرف «ر» بکش",
        "speak": "با انگشت روی حرف ر بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ن",
        "name": "نون",
        "prompt": "با انگشت روی حرف «ن» بکش",
        "speak": "با انگشت روی حرف ن بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ی",
        "name": "یِ",
        "prompt": "با انگشت روی حرف «ی» بکش",
        "speak": "با انگشت روی حرف ی بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ز",
        "name": "زِ",
        "prompt": "با انگشت روی حرف «ز» بکش",
        "speak": "با انگشت روی حرف ز بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ن",
        "name": "نون",
        "prompt": "کدام کلمه با حرف «ن» شروع می‌شود؟",
        "answer": "نان",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ز",
        "name": "زِ",
        "prompt": "کدام کلمه با حرف «ز» شروع می‌شود؟",
        "answer": "زرد",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ر» یا «ن» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-04",
    "domain": "reading",
    "order": 4,
    "title": "نشانه‌های ه ش ک",
    "schoolLessons": [
      "اِ ـه ه ــ شـ ش",
      "کـ ک ــ و"
    ],
    "goal": "کودک صدای حرف‌های ه، ش، ک را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "ه",
      "ش",
      "ک"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "ه",
        "name": "هِ",
        "prompt": "کدام یکی حرف «هِ» است؟",
        "speak": "صدای حرف هِ",
        "answer": "ه",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ش",
        "name": "شین",
        "prompt": "کدام یکی حرف «شین» است؟",
        "speak": "صدای حرف شین",
        "answer": "ش",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ک",
        "name": "کاف",
        "prompt": "کدام یکی حرف «کاف» است؟",
        "speak": "صدای حرف کاف",
        "answer": "ک",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "ه",
        "name": "هِ",
        "prompt": "با انگشت روی حرف «ه» بکش",
        "speak": "با انگشت روی حرف ه بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ش",
        "name": "شین",
        "prompt": "با انگشت روی حرف «ش» بکش",
        "speak": "با انگشت روی حرف ش بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ک",
        "name": "کاف",
        "prompt": "با انگشت روی حرف «ک» بکش",
        "speak": "با انگشت روی حرف ک بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ه",
        "name": "هِ",
        "prompt": "کدام کلمه با حرف «ه» شروع می‌شود؟",
        "answer": "همه",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ش",
        "name": "شین",
        "prompt": "کدام کلمه با حرف «ش» شروع می‌شود؟",
        "answer": "شب",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ک",
        "name": "کاف",
        "prompt": "کدام کلمه با حرف «ک» شروع می‌شود؟",
        "answer": "کتاب",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ه» یا «ش» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-05",
    "domain": "reading",
    "order": 5,
    "title": "نشانه‌های پ گ ف خ",
    "schoolLessons": [
      "پـ پ ــ گـ گ",
      "فـ ف ــ خـ خ"
    ],
    "goal": "کودک صدای حرف‌های پ، گ، ف، خ را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "پ",
      "گ",
      "ف",
      "خ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "پ",
        "name": "پِ",
        "prompt": "کدام یکی حرف «پِ» است؟",
        "speak": "صدای حرف پِ",
        "answer": "پ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "گ",
        "name": "گاف",
        "prompt": "کدام یکی حرف «گاف» است؟",
        "speak": "صدای حرف گاف",
        "answer": "گ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ف",
        "name": "فِ",
        "prompt": "کدام یکی حرف «فِ» است؟",
        "speak": "صدای حرف فِ",
        "answer": "ف",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "خ",
        "name": "خِ",
        "prompt": "کدام یکی حرف «خِ» است؟",
        "speak": "صدای حرف خِ",
        "answer": "خ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "پ",
        "name": "پِ",
        "prompt": "با انگشت روی حرف «پ» بکش",
        "speak": "با انگشت روی حرف پ بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "گ",
        "name": "گاف",
        "prompt": "با انگشت روی حرف «گ» بکش",
        "speak": "با انگشت روی حرف گ بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ف",
        "name": "فِ",
        "prompt": "با انگشت روی حرف «ف» بکش",
        "speak": "با انگشت روی حرف ف بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "خ",
        "name": "خِ",
        "prompt": "با انگشت روی حرف «خ» بکش",
        "speak": "با انگشت روی حرف خ بکش"
      },
      {
        "kind": "letter-word",
        "letter": "پ",
        "name": "پِ",
        "prompt": "کدام کلمه با حرف «پ» شروع می‌شود؟",
        "answer": "پدر",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "گ",
        "name": "گاف",
        "prompt": "کدام کلمه با حرف «گ» شروع می‌شود؟",
        "answer": "گربه",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "خ",
        "name": "خِ",
        "prompt": "کدام کلمه با حرف «خ» شروع می‌شود؟",
        "answer": "خانه",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «پ» یا «گ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-06",
    "domain": "reading",
    "order": 6,
    "title": "نشانه‌های ق ل ج",
    "schoolLessons": [
      "قـ ق ــ لـ ل",
      "جـ ج"
    ],
    "goal": "کودک صدای حرف‌های ق، ل، ج را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "ق",
      "ل",
      "ج"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "ق",
        "name": "قاف",
        "prompt": "کدام یکی حرف «قاف» است؟",
        "speak": "صدای حرف قاف",
        "answer": "ق",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ل",
        "name": "لام",
        "prompt": "کدام یکی حرف «لام» است؟",
        "speak": "صدای حرف لام",
        "answer": "ل",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ج",
        "name": "جیم",
        "prompt": "کدام یکی حرف «جیم» است؟",
        "speak": "صدای حرف جیم",
        "answer": "ج",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "ق",
        "name": "قاف",
        "prompt": "با انگشت روی حرف «ق» بکش",
        "speak": "با انگشت روی حرف ق بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ل",
        "name": "لام",
        "prompt": "با انگشت روی حرف «ل» بکش",
        "speak": "با انگشت روی حرف ل بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ج",
        "name": "جیم",
        "prompt": "با انگشت روی حرف «ج» بکش",
        "speak": "با انگشت روی حرف ج بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ق",
        "name": "قاف",
        "prompt": "کدام کلمه با حرف «ق» شروع می‌شود؟",
        "answer": "قاشق",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ل",
        "name": "لام",
        "prompt": "کدام کلمه با حرف «ل» شروع می‌شود؟",
        "answer": "لاله",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ج",
        "name": "جیم",
        "prompt": "کدام کلمه با حرف «ج» شروع می‌شود؟",
        "answer": "جوجه",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ق» یا «ل» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-07",
    "domain": "reading",
    "order": 7,
    "title": "نشانه‌های چ ژ",
    "schoolLessons": [
      "هـ ه ــ چـ چ",
      "ژ ــ خوا"
    ],
    "goal": "کودک صدای حرف‌های چ، ژ را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "چ",
      "ژ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "چ",
        "name": "چِه",
        "prompt": "کدام یکی حرف «چِه» است؟",
        "speak": "صدای حرف چِه",
        "answer": "چ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "کدام یکی حرف «ژِ» است؟",
        "speak": "صدای حرف ژِ",
        "answer": "ژ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "چ",
        "name": "چِه",
        "prompt": "با انگشت روی حرف «چ» بکش",
        "speak": "با انگشت روی حرف چ بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "با انگشت روی حرف «ژ» بکش",
        "speak": "با انگشت روی حرف ژ بکش"
      },
      {
        "kind": "letter-word",
        "letter": "چ",
        "name": "چِه",
        "prompt": "کدام کلمه با حرف «چ» شروع می‌شود؟",
        "answer": "چتر",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "کدام کلمه با حرف «ژ» شروع می‌شود؟",
        "answer": "ژاله",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «چ» یا «ژ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-08",
    "domain": "reading",
    "order": 8,
    "title": "نشانه‌های ص ذ ع ث",
    "schoolLessons": [
      "صـ ص ــ ذ",
      "عـ ع ــ ثـ ث"
    ],
    "goal": "کودک صدای حرف‌های ص، ذ، ع، ث را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "ص",
        "name": "صاد",
        "prompt": "کدام یکی حرف «صاد» است؟",
        "speak": "صدای حرف صاد",
        "answer": "ص",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ذ",
        "name": "ذال",
        "prompt": "کدام یکی حرف «ذال» است؟",
        "speak": "صدای حرف ذال",
        "answer": "ذ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ع",
        "name": "عین",
        "prompt": "کدام یکی حرف «عین» است؟",
        "speak": "صدای حرف عین",
        "answer": "ع",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ث",
        "name": "ثِ",
        "prompt": "کدام یکی حرف «ثِ» است؟",
        "speak": "صدای حرف ثِ",
        "answer": "ث",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "ص",
        "name": "صاد",
        "prompt": "با انگشت روی حرف «ص» بکش",
        "speak": "با انگشت روی حرف ص بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ذ",
        "name": "ذال",
        "prompt": "با انگشت روی حرف «ذ» بکش",
        "speak": "با انگشت روی حرف ذ بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ع",
        "name": "عین",
        "prompt": "با انگشت روی حرف «ع» بکش",
        "speak": "با انگشت روی حرف ع بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ث",
        "name": "ثِ",
        "prompt": "با انگشت روی حرف «ث» بکش",
        "speak": "با انگشت روی حرف ث بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ص",
        "name": "صاد",
        "prompt": "کدام کلمه با حرف «ص» شروع می‌شود؟",
        "answer": "صدف",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ص» یا «ذ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-09",
    "domain": "reading",
    "order": 9,
    "title": "نشانه‌های ح ض ط",
    "schoolLessons": [
      "حـ ح",
      "ضـ ض ــ ط"
    ],
    "goal": "کودک صدای حرف‌های ح، ض، ط را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "ح",
        "name": "حِ",
        "prompt": "کدام یکی حرف «حِ» است؟",
        "speak": "صدای حرف حِ",
        "answer": "ح",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ض",
        "name": "ضاد",
        "prompt": "کدام یکی حرف «ضاد» است؟",
        "speak": "صدای حرف ضاد",
        "answer": "ض",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ط",
        "name": "طا",
        "prompt": "کدام یکی حرف «طا» است؟",
        "speak": "صدای حرف طا",
        "answer": "ط",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "ح",
        "name": "حِ",
        "prompt": "با انگشت روی حرف «ح» بکش",
        "speak": "با انگشت روی حرف ح بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ض",
        "name": "ضاد",
        "prompt": "با انگشت روی حرف «ض» بکش",
        "speak": "با انگشت روی حرف ض بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ط",
        "name": "طا",
        "prompt": "با انگشت روی حرف «ط» بکش",
        "speak": "با انگشت روی حرف ط بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ح",
        "name": "حِ",
        "prompt": "کدام کلمه با حرف «ح» شروع می‌شود؟",
        "answer": "حلزون",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-word",
        "letter": "ط",
        "name": "طا",
        "prompt": "کدام کلمه با حرف «ط» شروع می‌شود؟",
        "answer": "طوطی",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ح» یا «ض» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-10",
    "domain": "reading",
    "order": 10,
    "title": "نشانه‌های غ ظ",
    "schoolLessons": [
      "غـ غ",
      "ظ"
    ],
    "goal": "کودک صدای حرف‌های غ، ظ را می‌شناسد و شکلشان را می‌نویسد.",
    "letters": [
      "غ",
      "ظ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "letter-sound",
        "letter": "غ",
        "name": "غین",
        "prompt": "کدام یکی حرف «غین» است؟",
        "speak": "صدای حرف غین",
        "answer": "غ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-sound",
        "letter": "ظ",
        "name": "ظا",
        "prompt": "کدام یکی حرف «ظا» است؟",
        "speak": "صدای حرف ظا",
        "answer": "ظ",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-trace",
        "letter": "غ",
        "name": "غین",
        "prompt": "با انگشت روی حرف «غ» بکش",
        "speak": "با انگشت روی حرف غ بکش"
      },
      {
        "kind": "letter-trace",
        "letter": "ظ",
        "name": "ظا",
        "prompt": "با انگشت روی حرف «ظ» بکش",
        "speak": "با انگشت روی حرف ظ بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ظ",
        "name": "ظا",
        "prompt": "کدام کلمه با حرف «ظ» شروع می‌شود؟",
        "answer": "ظهر",
        "readablePool": true,
        "distractorPool": "words"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «غ» یا «ظ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  }
];
