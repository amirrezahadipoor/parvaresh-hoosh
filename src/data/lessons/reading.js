// تولیدشده با scripts/build-reading-lessons.js — دستی ویرایش نکنید.
//
// هر درس فقط از حروفی ساخته شده که کلیپ صوتی واقعی دارند.
// حروف بدون صدا: هیچ‌کدام — هر ۳۲ حرف صدا دارند

export const READING_LESSONS = [
  {
    "id": "reading-letters-01",
    "domain": "reading",
    "order": 1,
    "title": "نشانه‌های ا ب",
    "schoolLessons": [
      "آ ا ــ بـ ب"
    ],
    "goal": "کودک صدای حرف‌های ا، ب را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ا",
      "ب"
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
        "kind": "letter-word",
        "letter": "ب",
        "name": "بِ",
        "prompt": "کدام کلمه با حرف «ب» شروع می‌شود؟",
        "answer": "بابا",
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
    "title": "نشانه‌های د",
    "schoolLessons": [
      "اَ ــ د"
    ],
    "goal": "کودک صدای حرف‌های د را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "د"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "د",
        "name": "دال",
        "prompt": "با انگشت روی حرف «د» بکش",
        "speak": "با انگشت روی حرف د بکش"
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
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «د» شروع می‌شوند.",
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
    "title": "نشانه‌های م س",
    "schoolLessons": [
      "مـ م ــ سـ س"
    ],
    "goal": "کودک صدای حرف‌های م، س را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "م",
      "س"
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
        "kind": "letter-word",
        "letter": "س",
        "name": "سین",
        "prompt": "کدام کلمه با حرف «س» شروع می‌شود؟",
        "answer": "سام",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "م",
        "name": "میم",
        "prompt": "کدام کلمه حرف «م» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "س",
        "name": "سین",
        "prompt": "کدام کلمه حرف «س» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "س",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "س",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "س",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "س",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
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
    "id": "reading-read-01",
    "domain": "reading",
    "order": 4,
    "title": "خواندن تا م س",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "س",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "س",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "س",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "س",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "س",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-04",
    "domain": "reading",
    "order": 5,
    "title": "نشانه‌های و ت",
    "schoolLessons": [
      "او و ــ تـ ت"
    ],
    "goal": "کودک صدای حرف‌های و، ت را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "و",
      "ت"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "ت",
        "name": "تِ",
        "prompt": "کدام کلمه با حرف «ت» شروع می‌شود؟",
        "answer": "توت",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "و",
        "name": "واو",
        "prompt": "کدام کلمه حرف «و» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ت",
        "name": "تِ",
        "prompt": "کدام کلمه حرف «ت» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ت",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ت",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ت",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ت",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «و» یا «ت» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-02",
    "domain": "reading",
    "order": 6,
    "title": "خواندن تا و ت",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ت",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ت",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ت",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ت",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ت",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ت",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-05",
    "domain": "reading",
    "order": 7,
    "title": "نشانه‌های ر ن",
    "schoolLessons": [
      "ر ــ نـ ن"
    ],
    "goal": "کودک صدای حرف‌های ر، ن را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ر",
      "ن"
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
        "kind": "letter-word",
        "letter": "ن",
        "name": "نون",
        "prompt": "کدام کلمه با حرف «ن» شروع می‌شود؟",
        "answer": "نان",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ر",
        "name": "رِ",
        "prompt": "کدام کلمه حرف «ر» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ن",
        "name": "نون",
        "prompt": "کدام کلمه حرف «ن» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ن",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ن",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ن",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ن",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
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
    "id": "reading-read-03",
    "domain": "reading",
    "order": 8,
    "title": "خواندن تا ر ن",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ن",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ن",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ن",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ن",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ن",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ن",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-01",
    "domain": "reading",
    "order": 9,
    "title": "مرور ا ب د م س و ت ر ن",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن"
    ],
    "minutes": 5,
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
        "kind": "blend-word",
        "letter": "ن",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-06",
    "domain": "reading",
    "order": 10,
    "title": "نشانه‌های ی ز",
    "schoolLessons": [
      "ایـ یـ ی ــ ز"
    ],
    "goal": "کودک صدای حرف‌های ی، ز را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ی",
      "ز"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "ز",
        "name": "زِ",
        "prompt": "کدام کلمه با حرف «ز» شروع می‌شود؟",
        "answer": "زرد",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ی",
        "name": "یِ",
        "prompt": "کدام کلمه حرف «ی» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ز",
        "name": "زِ",
        "prompt": "کدام کلمه حرف «ز» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ز",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ز",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ز",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ز",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ی» یا «ز» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-04",
    "domain": "reading",
    "order": 11,
    "title": "خواندن تا ی ز",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ز",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ز",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ز",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ز",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ز",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ز",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-01",
    "domain": "reading",
    "order": 12,
    "title": "بازی صداها ۱",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ز",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ز",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ز",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ز",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ز",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-07",
    "domain": "reading",
    "order": 13,
    "title": "نشانه‌های ه ش",
    "schoolLessons": [
      "اِ ـه ه ــ شـ ش"
    ],
    "goal": "کودک صدای حرف‌های ه، ش را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ه",
      "ش"
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
        "kind": "letter-in-word",
        "letter": "ه",
        "name": "هِ",
        "prompt": "کدام کلمه حرف «ه» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ش",
        "name": "شین",
        "prompt": "کدام کلمه حرف «ش» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ش",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ش",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ش",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
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
    "id": "reading-read-05",
    "domain": "reading",
    "order": 14,
    "title": "خواندن تا ه ش",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ش",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ش",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ش",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-02",
    "domain": "reading",
    "order": 15,
    "title": "بازی صداها ۲",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ش",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ش",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ش",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ش",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-02",
    "domain": "reading",
    "order": 16,
    "title": "مرور م س و ت ر ن ی ز ه ش",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش"
    ],
    "minutes": 5,
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
        "kind": "letter-in-word",
        "letter": "م",
        "name": "میم",
        "prompt": "کدام کلمه حرف «م» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "س",
        "name": "سین",
        "prompt": "کدام کلمه حرف «س» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ش",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-08",
    "domain": "reading",
    "order": 17,
    "title": "نشانه‌های ک",
    "schoolLessons": [
      "کـ ک ــ و"
    ],
    "goal": "کودک صدای حرف‌های ک را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ک"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "ک",
        "name": "کاف",
        "prompt": "با انگشت روی حرف «ک» بکش",
        "speak": "با انگشت روی حرف ک بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ک",
        "name": "کاف",
        "prompt": "کدام کلمه با حرف «ک» شروع می‌شود؟",
        "answer": "کتاب",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ک",
        "name": "کاف",
        "prompt": "کدام کلمه حرف «ک» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ک",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ک",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ک",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ک",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ک",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ک» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-06",
    "domain": "reading",
    "order": 18,
    "title": "خواندن تا ک",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ک",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ک",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ک",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ک",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ک",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ک",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-03",
    "domain": "reading",
    "order": 19,
    "title": "بازی صداها ۳",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ک",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ک",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ک",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ک",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ک",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-01",
    "domain": "reading",
    "order": 20,
    "title": "کلمه و معنی ۱",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ک",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ک",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ک",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ک",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ک",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-09",
    "domain": "reading",
    "order": 21,
    "title": "نشانه‌های پ گ",
    "schoolLessons": [
      "پـ پ ــ گـ گ"
    ],
    "goal": "کودک صدای حرف‌های پ، گ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "پ",
      "گ"
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
        "kind": "letter-in-word",
        "letter": "پ",
        "name": "پِ",
        "prompt": "کدام کلمه حرف «پ» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "گ",
        "name": "گاف",
        "prompt": "کدام کلمه حرف «گ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "گ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "گ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "گ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
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
    "id": "reading-read-07",
    "domain": "reading",
    "order": 22,
    "title": "خواندن تا پ گ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "گ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "گ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "گ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-04",
    "domain": "reading",
    "order": 23,
    "title": "بازی صداها ۴",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "گ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "گ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "گ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "گ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-02",
    "domain": "reading",
    "order": 24,
    "title": "کلمه و معنی ۲",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "گ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "گ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "گ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "گ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "گ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-03",
    "domain": "reading",
    "order": 25,
    "title": "مرور ر ن ی ز ه ش ک پ گ",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ"
    ],
    "minutes": 5,
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
        "kind": "letter-in-word",
        "letter": "ر",
        "name": "رِ",
        "prompt": "کدام کلمه حرف «ر» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ن",
        "name": "نون",
        "prompt": "کدام کلمه حرف «ن» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "گ",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-10",
    "domain": "reading",
    "order": 26,
    "title": "نشانه‌های ف خ",
    "schoolLessons": [
      "فـ ف ــ خـ خ"
    ],
    "goal": "کودک صدای حرف‌های ف، خ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ف",
      "خ"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "خ",
        "name": "خِ",
        "prompt": "کدام کلمه با حرف «خ» شروع می‌شود؟",
        "answer": "خانه",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ف",
        "name": "فِ",
        "prompt": "کدام کلمه حرف «ف» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "خ",
        "name": "خِ",
        "prompt": "کدام کلمه حرف «خ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "خ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "خ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "خ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "خ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "خ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ف» یا «خ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-08",
    "domain": "reading",
    "order": 27,
    "title": "خواندن تا ف خ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "خ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "خ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "خ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "خ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "خ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "خ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-05",
    "domain": "reading",
    "order": 28,
    "title": "بازی صداها ۵",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "خ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "خ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "خ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "خ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "خ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-03",
    "domain": "reading",
    "order": 29,
    "title": "کلمه و معنی ۳",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "خ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "خ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "خ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "خ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "خ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-gap-01",
    "domain": "reading",
    "order": 30,
    "title": "صدای گم‌شده ۱",
    "goal": "کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "which-sound",
        "letter": "خ",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "which-sound",
        "letter": "خ",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "segment-count",
        "letter": "خ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "syllable-build",
        "letter": "خ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "first-sound",
        "letter": "خ",
        "maxSounds": 4,
        "prompt": "کدام با این صدا شروع می‌شود؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "خ",
        "maxSounds": 5,
        "prompt": "کدام هم‌آهنگ است؟"
      }
    ],
    "parentNote": "سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-11",
    "domain": "reading",
    "order": 31,
    "title": "نشانه‌های ق ل",
    "schoolLessons": [
      "قـ ق ــ لـ ل"
    ],
    "goal": "کودک صدای حرف‌های ق، ل را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ق",
      "ل"
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
        "kind": "letter-in-word",
        "letter": "ق",
        "name": "قاف",
        "prompt": "کدام کلمه حرف «ق» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ل",
        "name": "لام",
        "prompt": "کدام کلمه حرف «ل» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ل",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ل",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ل",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
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
    "id": "reading-read-09",
    "domain": "reading",
    "order": 32,
    "title": "خواندن تا ق ل",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ل",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ل",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ل",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-06",
    "domain": "reading",
    "order": 33,
    "title": "بازی صداها ۶",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ل",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ل",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ل",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ل",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-04",
    "domain": "reading",
    "order": 34,
    "title": "کلمه و معنی ۴",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ل",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ل",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ل",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ل",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ل",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-04",
    "domain": "reading",
    "order": 35,
    "title": "مرور ه ش ک پ گ ف خ ق ل",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل"
    ],
    "minutes": 5,
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
        "kind": "letter-in-word",
        "letter": "ه",
        "name": "هِ",
        "prompt": "کدام کلمه حرف «ه» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ش",
        "name": "شین",
        "prompt": "کدام کلمه حرف «ش» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ل",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-12",
    "domain": "reading",
    "order": 36,
    "title": "نشانه‌های ج",
    "schoolLessons": [
      "جـ ج"
    ],
    "goal": "کودک صدای حرف‌های ج را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ج"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "ج",
        "name": "جیم",
        "prompt": "با انگشت روی حرف «ج» بکش",
        "speak": "با انگشت روی حرف ج بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ج",
        "name": "جیم",
        "prompt": "کدام کلمه با حرف «ج» شروع می‌شود؟",
        "answer": "جوجه",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ج",
        "name": "جیم",
        "prompt": "کدام کلمه حرف «ج» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ج",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ج",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ج",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ج» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-10",
    "domain": "reading",
    "order": 37,
    "title": "خواندن تا ج",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ج",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ج",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ج",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-07",
    "domain": "reading",
    "order": 38,
    "title": "بازی صداها ۷",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ج",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ج",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ج",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ج",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-05",
    "domain": "reading",
    "order": 39,
    "title": "کلمه و معنی ۵",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ج",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ج",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ج",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ج",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ج",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-gap-02",
    "domain": "reading",
    "order": 40,
    "title": "صدای گم‌شده ۲",
    "goal": "کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "which-sound",
        "letter": "ج",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "which-sound",
        "letter": "ج",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "segment-count",
        "letter": "ج",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ج",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "first-sound",
        "letter": "ج",
        "maxSounds": 4,
        "prompt": "کدام با این صدا شروع می‌شود؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ج",
        "maxSounds": 5,
        "prompt": "کدام هم‌آهنگ است؟"
      }
    ],
    "parentNote": "سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-01",
    "domain": "reading",
    "order": 41,
    "title": "روان بخوان ۱",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ج",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ج",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ج",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ج",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ج",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-13",
    "domain": "reading",
    "order": 42,
    "title": "نشانه‌های چ",
    "schoolLessons": [
      "هـ ه ــ چـ چ"
    ],
    "goal": "کودک صدای حرف‌های چ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "چ"
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
        "kind": "letter-trace",
        "letter": "چ",
        "name": "چِه",
        "prompt": "با انگشت روی حرف «چ» بکش",
        "speak": "با انگشت روی حرف چ بکش"
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
        "kind": "letter-in-word",
        "letter": "چ",
        "name": "چِه",
        "prompt": "کدام کلمه حرف «چ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "چ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "چ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "چ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «چ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-11",
    "domain": "reading",
    "order": 43,
    "title": "خواندن تا چ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "چ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "چ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "چ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-08",
    "domain": "reading",
    "order": 44,
    "title": "بازی صداها ۸",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "چ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "چ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "چ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "چ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-06",
    "domain": "reading",
    "order": 45,
    "title": "کلمه و معنی ۶",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "چ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "چ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "چ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "چ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "چ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-05",
    "domain": "reading",
    "order": 46,
    "title": "مرور پ گ ف خ ق ل ج چ",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ"
    ],
    "minutes": 5,
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
        "kind": "letter-in-word",
        "letter": "پ",
        "name": "پِ",
        "prompt": "کدام کلمه حرف «پ» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "گ",
        "name": "گاف",
        "prompt": "کدام کلمه حرف «گ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-02",
    "domain": "reading",
    "order": 47,
    "title": "روان بخوان ۲",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "چ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "چ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "چ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "چ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "چ",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-14",
    "domain": "reading",
    "order": 48,
    "title": "نشانه‌های ژ",
    "schoolLessons": [
      "ژ ــ خوا"
    ],
    "goal": "کودک صدای حرف‌های ژ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ژ"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "با انگشت روی حرف «ژ» بکش",
        "speak": "با انگشت روی حرف ژ بکش"
      },
      {
        "kind": "letter-word",
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "کدام کلمه با حرف «ژ» شروع می‌شود؟",
        "answer": "ژاله",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "کدام کلمه حرف «ژ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ژ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ژ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ژ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ژ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-12",
    "domain": "reading",
    "order": 49,
    "title": "خواندن تا ژ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ژ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ژ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ژ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-09",
    "domain": "reading",
    "order": 50,
    "title": "بازی صداها ۹",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ژ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ژ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ژ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ژ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-07",
    "domain": "reading",
    "order": 51,
    "title": "کلمه و معنی ۷",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ژ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ژ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ژ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ژ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ژ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-gap-03",
    "domain": "reading",
    "order": 52,
    "title": "صدای گم‌شده ۳",
    "goal": "کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "which-sound",
        "letter": "ژ",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "which-sound",
        "letter": "ژ",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "segment-count",
        "letter": "ژ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ژ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "first-sound",
        "letter": "ژ",
        "maxSounds": 4,
        "prompt": "کدام با این صدا شروع می‌شود؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ژ",
        "maxSounds": 5,
        "prompt": "کدام هم‌آهنگ است؟"
      }
    ],
    "parentNote": "سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-01",
    "domain": "reading",
    "order": 53,
    "title": "جمله بخوان ۱",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "ژ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ژ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "ژ",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "ژ",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "ژ",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ژ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-03",
    "domain": "reading",
    "order": 54,
    "title": "روان بخوان ۳",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ژ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ژ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ژ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ژ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ژ",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-15",
    "domain": "reading",
    "order": 55,
    "title": "نشانه‌های ص ذ",
    "schoolLessons": [
      "صـ ص ــ ذ"
    ],
    "goal": "کودک صدای حرف‌های ص، ذ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ص",
      "ذ"
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
        "kind": "letter-word",
        "letter": "ص",
        "name": "صاد",
        "prompt": "کدام کلمه با حرف «ص» شروع می‌شود؟",
        "answer": "صدف",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ص",
        "name": "صاد",
        "prompt": "کدام کلمه حرف «ص» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ذ",
        "name": "ذال",
        "prompt": "کدام کلمه حرف «ذ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ذ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ذ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ذ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
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
    "id": "reading-read-13",
    "domain": "reading",
    "order": 56,
    "title": "خواندن تا ص ذ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ذ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ذ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ذ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-10",
    "domain": "reading",
    "order": 57,
    "title": "بازی صداها ۱۰",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ذ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ذ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ذ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ذ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-08",
    "domain": "reading",
    "order": 58,
    "title": "کلمه و معنی ۸",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ذ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ذ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ذ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ذ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ذ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-06",
    "domain": "reading",
    "order": 59,
    "title": "مرور ق ل ج چ ژ ص ذ",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 5,
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
        "kind": "letter-in-word",
        "letter": "ق",
        "name": "قاف",
        "prompt": "کدام کلمه حرف «ق» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ل",
        "name": "لام",
        "prompt": "کدام کلمه حرف «ل» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-02",
    "domain": "reading",
    "order": 60,
    "title": "جمله بخوان ۲",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "ذ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ذ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "ذ",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "ذ",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "ذ",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ذ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-understand-01",
    "domain": "reading",
    "order": 61,
    "title": "فهمیدن متن ۱",
    "goal": "کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "wh-question",
        "letter": "ذ",
        "prompt": "{q}"
      },
      {
        "kind": "wh-question",
        "letter": "ذ",
        "prompt": "{q}"
      },
      {
        "kind": "passage-read",
        "letter": "ذ",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-read",
        "letter": "ذ",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-order",
        "letter": "ذ",
        "prompt": "اول کدام بود؟ به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ذ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-04",
    "domain": "reading",
    "order": 62,
    "title": "روان بخوان ۴",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ذ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ذ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ذ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ذ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ذ",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-16",
    "domain": "reading",
    "order": 63,
    "title": "نشانه‌های ع ث",
    "schoolLessons": [
      "عـ ع ــ ثـ ث"
    ],
    "goal": "کودک صدای حرف‌های ع، ث را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ع",
      "ث"
    ],
    "minutes": 6,
    "rounds": [
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
        "kind": "letter-in-word",
        "letter": "ع",
        "name": "عین",
        "prompt": "کدام کلمه حرف «ع» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ث",
        "name": "ثِ",
        "prompt": "کدام کلمه حرف «ث» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ث",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ث",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ث",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ع» یا «ث» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-14",
    "domain": "reading",
    "order": 64,
    "title": "خواندن تا ع ث",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ث",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ث",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ث",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-11",
    "domain": "reading",
    "order": 65,
    "title": "بازی صداها ۱۱",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ث",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ث",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ث",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ث",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-09",
    "domain": "reading",
    "order": 66,
    "title": "کلمه و معنی ۹",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ث",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ث",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ث",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ث",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ث",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-gap-04",
    "domain": "reading",
    "order": 67,
    "title": "صدای گم‌شده ۴",
    "goal": "کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "which-sound",
        "letter": "ث",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "which-sound",
        "letter": "ث",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "segment-count",
        "letter": "ث",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ث",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "first-sound",
        "letter": "ث",
        "maxSounds": 4,
        "prompt": "کدام با این صدا شروع می‌شود؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ث",
        "maxSounds": 5,
        "prompt": "کدام هم‌آهنگ است؟"
      }
    ],
    "parentNote": "سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-03",
    "domain": "reading",
    "order": 68,
    "title": "جمله بخوان ۳",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "ث",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ث",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "ث",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "ث",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "ث",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ث",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-understand-02",
    "domain": "reading",
    "order": 69,
    "title": "فهمیدن متن ۲",
    "goal": "کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "wh-question",
        "letter": "ث",
        "prompt": "{q}"
      },
      {
        "kind": "wh-question",
        "letter": "ث",
        "prompt": "{q}"
      },
      {
        "kind": "passage-read",
        "letter": "ث",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-read",
        "letter": "ث",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-order",
        "letter": "ث",
        "prompt": "اول کدام بود؟ به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ث",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-05",
    "domain": "reading",
    "order": 70,
    "title": "روان بخوان ۵",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ث",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ث",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ث",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ث",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ث",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-17",
    "domain": "reading",
    "order": 71,
    "title": "نشانه‌های ح",
    "schoolLessons": [
      "حـ ح"
    ],
    "goal": "کودک صدای حرف‌های ح را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ح"
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
        "kind": "letter-trace",
        "letter": "ح",
        "name": "حِ",
        "prompt": "با انگشت روی حرف «ح» بکش",
        "speak": "با انگشت روی حرف ح بکش"
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
        "kind": "letter-in-word",
        "letter": "ح",
        "name": "حِ",
        "prompt": "کدام کلمه حرف «ح» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ح",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ح",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ح",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ح» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-15",
    "domain": "reading",
    "order": 72,
    "title": "خواندن تا ح",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ح",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ح",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ح",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-12",
    "domain": "reading",
    "order": 73,
    "title": "بازی صداها ۱۲",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ح",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ح",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ح",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ح",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-10",
    "domain": "reading",
    "order": 74,
    "title": "کلمه و معنی ۱۰",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ح",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ح",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ح",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ح",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ح",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-07",
    "domain": "reading",
    "order": 75,
    "title": "مرور چ ژ ص ذ ع ث ح",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 5,
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
        "kind": "letter-sound",
        "letter": "ص",
        "name": "صاد",
        "prompt": "کدام یکی حرف «صاد» است؟",
        "speak": "صدای حرف صاد",
        "answer": "ص",
        "distractorPool": "letters"
      },
      {
        "kind": "letter-in-word",
        "letter": "چ",
        "name": "چِه",
        "prompt": "کدام کلمه حرف «چ» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ژ",
        "name": "ژِ",
        "prompt": "کدام کلمه حرف «ژ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-04",
    "domain": "reading",
    "order": 76,
    "title": "جمله بخوان ۴",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "ح",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ح",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "ح",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "ح",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "ح",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ح",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-understand-03",
    "domain": "reading",
    "order": 77,
    "title": "فهمیدن متن ۳",
    "goal": "کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "wh-question",
        "letter": "ح",
        "prompt": "{q}"
      },
      {
        "kind": "wh-question",
        "letter": "ح",
        "prompt": "{q}"
      },
      {
        "kind": "passage-read",
        "letter": "ح",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-read",
        "letter": "ح",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-order",
        "letter": "ح",
        "prompt": "اول کدام بود؟ به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ح",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-06",
    "domain": "reading",
    "order": 78,
    "title": "روان بخوان ۶",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ح",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ح",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ح",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ح",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ح",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-18",
    "domain": "reading",
    "order": 79,
    "title": "نشانه‌های ض ط",
    "schoolLessons": [
      "ضـ ض ــ ط"
    ],
    "goal": "کودک صدای حرف‌های ض، ط را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ض",
      "ط"
    ],
    "minutes": 6,
    "rounds": [
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
        "letter": "ط",
        "name": "طا",
        "prompt": "کدام کلمه با حرف «ط» شروع می‌شود؟",
        "answer": "طوطی",
        "readablePool": true,
        "distractorPool": "words"
      },
      {
        "kind": "letter-in-word",
        "letter": "ض",
        "name": "ضاد",
        "prompt": "کدام کلمه حرف «ض» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ط",
        "name": "طا",
        "prompt": "کدام کلمه حرف «ط» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ط",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ط",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ط",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ض» یا «ط» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-16",
    "domain": "reading",
    "order": 80,
    "title": "خواندن تا ض ط",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ط",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ط",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ط",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-13",
    "domain": "reading",
    "order": 81,
    "title": "بازی صداها ۱۳",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ط",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ط",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ط",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ط",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-11",
    "domain": "reading",
    "order": 82,
    "title": "کلمه و معنی ۱۱",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ط",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ط",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ط",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ط",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ط",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-gap-05",
    "domain": "reading",
    "order": 83,
    "title": "صدای گم‌شده ۵",
    "goal": "کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "which-sound",
        "letter": "ط",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "which-sound",
        "letter": "ط",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "segment-count",
        "letter": "ط",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ط",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "first-sound",
        "letter": "ط",
        "maxSounds": 4,
        "prompt": "کدام با این صدا شروع می‌شود؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ط",
        "maxSounds": 5,
        "prompt": "کدام هم‌آهنگ است؟"
      }
    ],
    "parentNote": "سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-05",
    "domain": "reading",
    "order": 84,
    "title": "جمله بخوان ۵",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "ط",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ط",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "ط",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "ط",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "ط",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ط",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-understand-04",
    "domain": "reading",
    "order": 85,
    "title": "فهمیدن متن ۴",
    "goal": "کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "wh-question",
        "letter": "ط",
        "prompt": "{q}"
      },
      {
        "kind": "wh-question",
        "letter": "ط",
        "prompt": "{q}"
      },
      {
        "kind": "passage-read",
        "letter": "ط",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-read",
        "letter": "ط",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-order",
        "letter": "ط",
        "prompt": "اول کدام بود؟ به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ط",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-07",
    "domain": "reading",
    "order": 86,
    "title": "روان بخوان ۷",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ط",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ط",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ط",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ط",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ط",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-19",
    "domain": "reading",
    "order": 87,
    "title": "نشانه‌های غ",
    "schoolLessons": [
      "غـ غ"
    ],
    "goal": "کودک صدای حرف‌های غ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "غ"
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
        "kind": "letter-trace",
        "letter": "غ",
        "name": "غین",
        "prompt": "با انگشت روی حرف «غ» بکش",
        "speak": "با انگشت روی حرف غ بکش"
      },
      {
        "kind": "letter-in-word",
        "letter": "غ",
        "name": "غین",
        "prompt": "کدام کلمه حرف «غ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "غ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "غ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "غ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «غ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-17",
    "domain": "reading",
    "order": 88,
    "title": "خواندن تا غ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "غ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "غ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "غ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-14",
    "domain": "reading",
    "order": 89,
    "title": "بازی صداها ۱۴",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "غ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "غ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "غ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "غ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-12",
    "domain": "reading",
    "order": 90,
    "title": "کلمه و معنی ۱۲",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "غ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "غ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "غ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "غ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "غ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-review-08",
    "domain": "reading",
    "order": 91,
    "title": "مرور ص ذ ع ث ح ض ط غ",
    "goal": "کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 5,
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
        "kind": "letter-in-word",
        "letter": "ص",
        "name": "صاد",
        "prompt": "کدام کلمه حرف «ص» را دارد؟"
      },
      {
        "kind": "letter-in-word",
        "letter": "ذ",
        "name": "ذال",
        "prompt": "کدام کلمه حرف «ذ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 4,
        "maxSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-06",
    "domain": "reading",
    "order": 92,
    "title": "جمله بخوان ۶",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "غ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "غ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "غ",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "غ",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "غ",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "غ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-understand-05",
    "domain": "reading",
    "order": 93,
    "title": "فهمیدن متن ۵",
    "goal": "کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "wh-question",
        "letter": "غ",
        "prompt": "{q}"
      },
      {
        "kind": "wh-question",
        "letter": "غ",
        "prompt": "{q}"
      },
      {
        "kind": "passage-read",
        "letter": "غ",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-read",
        "letter": "غ",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-order",
        "letter": "غ",
        "prompt": "اول کدام بود؟ به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "غ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-08",
    "domain": "reading",
    "order": 94,
    "title": "روان بخوان ۸",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "غ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "غ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "غ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "غ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "غ",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-letters-20",
    "domain": "reading",
    "order": 95,
    "title": "نشانه‌های ظ",
    "schoolLessons": [
      "ظ"
    ],
    "goal": "کودک صدای حرف‌های ظ را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.",
    "letters": [
      "ظ"
    ],
    "minutes": 6,
    "rounds": [
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
      },
      {
        "kind": "letter-in-word",
        "letter": "ظ",
        "name": "ظا",
        "prompt": "کدام کلمه حرف «ظ» را دارد؟"
      },
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ظ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ظ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ظ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "بعد از بازی، دنبال چیزهایی در خانه بگردید که با «ظ» شروع می‌شوند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-read-18",
    "domain": "reading",
    "order": 96,
    "title": "خواندن تا ظ",
    "goal": "کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 6,
        "maxSyllables": 2,
        "minSyllables": 2,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ظ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "segment-count",
        "letter": "ظ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "count-letters",
        "letter": "ظ",
        "prompt": "کلمهٔ {w} چند حرف دارد؟"
      }
    ],
    "parentNote": "این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sound-15",
    "domain": "reading",
    "order": 97,
    "title": "بازی صداها ۱۵",
    "goal": "کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "rhyme-pick",
        "letter": "ظ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ظ",
        "prompt": "کدام با این هم‌آهنگ است؟"
      },
      {
        "kind": "first-sound",
        "letter": "ظ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "first-sound",
        "letter": "ظ",
        "prompt": "این کلمه با کدام صدا شروع می‌شود؟"
      },
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 3,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": true,
        "prompt": "کدام کلمه می‌شود؟"
      }
    ],
    "parentNote": "این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-word-13",
    "domain": "reading",
    "order": 98,
    "title": "کلمه و معنی ۱۳",
    "goal": "کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "word-pic",
        "letter": "ظ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ظ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ظ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "pic-word",
        "letter": "ظ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-build",
        "letter": "ظ",
        "maxLetters": 4,
        "prompt": "حرف‌ها را بچین تا کلمه بسازی"
      }
    ],
    "parentNote": "خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-gap-06",
    "domain": "reading",
    "order": 99,
    "title": "صدای گم‌شده ۶",
    "goal": "کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 5,
    "rounds": [
      {
        "kind": "which-sound",
        "letter": "ظ",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "which-sound",
        "letter": "ظ",
        "maxSounds": 4,
        "prompt": "کدام صدا گم شده؟"
      },
      {
        "kind": "segment-count",
        "letter": "ظ",
        "maxSounds": 5,
        "prompt": "این کلمه چند صدا دارد؟"
      },
      {
        "kind": "syllable-build",
        "letter": "ظ",
        "prompt": "بخش‌ها را به ترتیب بچین"
      },
      {
        "kind": "first-sound",
        "letter": "ظ",
        "maxSounds": 4,
        "prompt": "کدام با این صدا شروع می‌شود؟"
      },
      {
        "kind": "rhyme-pick",
        "letter": "ظ",
        "maxSounds": 5,
        "prompt": "کدام هم‌آهنگ است؟"
      }
    ],
    "parentNote": "سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-sentence-07",
    "domain": "reading",
    "order": 100,
    "title": "جمله بخوان ۷",
    "goal": "کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "sentence-pic",
        "letter": "ظ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ظ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "pic-sentence",
        "letter": "ظ",
        "prompt": "کدام جمله درست است؟"
      },
      {
        "kind": "sentence-build",
        "letter": "ظ",
        "parts": 2,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-build",
        "letter": "ظ",
        "parts": 3,
        "prompt": "کلمه‌ها را به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ظ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-understand-06",
    "domain": "reading",
    "order": 101,
    "title": "فهمیدن متن ۶",
    "goal": "کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 6,
    "rounds": [
      {
        "kind": "wh-question",
        "letter": "ظ",
        "prompt": "{q}"
      },
      {
        "kind": "wh-question",
        "letter": "ظ",
        "prompt": "{q}"
      },
      {
        "kind": "passage-read",
        "letter": "ظ",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-read",
        "letter": "ظ",
        "prompt": "بعد چه کار کرد؟"
      },
      {
        "kind": "passage-order",
        "letter": "ظ",
        "prompt": "اول کدام بود؟ به ترتیب بچین"
      },
      {
        "kind": "sentence-pic",
        "letter": "ظ",
        "parts": 3,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      }
    ],
    "parentNote": "اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.",
    "reviewDays": [
      1,
      3,
      7
    ]
  },
  {
    "id": "reading-fluent-09",
    "domain": "reading",
    "order": 102,
    "title": "روان بخوان ۹",
    "goal": "کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.",
    "letters": [
      "ا",
      "ب",
      "د",
      "م",
      "س",
      "و",
      "ت",
      "ر",
      "ن",
      "ی",
      "ز",
      "ه",
      "ش",
      "ک",
      "پ",
      "گ",
      "ف",
      "خ",
      "ق",
      "ل",
      "ج",
      "چ",
      "ژ",
      "ص",
      "ذ",
      "ع",
      "ث",
      "ح",
      "ض",
      "ط",
      "غ",
      "ظ"
    ],
    "minutes": 7,
    "rounds": [
      {
        "kind": "blend-word",
        "letter": "ظ",
        "maxSounds": 4,
        "maxSyllables": 1,
        "minSyllables": 1,
        "longVowelOnly": false,
        "prompt": "کدام کلمه می‌شود؟"
      },
      {
        "kind": "pic-word",
        "letter": "ظ",
        "prompt": "اسم این تصویر کدام است؟"
      },
      {
        "kind": "word-pic",
        "letter": "ظ",
        "prompt": "کدام تصویر این کلمه است؟"
      },
      {
        "kind": "sentence-pic",
        "letter": "ظ",
        "parts": 2,
        "prompt": "کدام تصویر به این جمله می‌خورد؟"
      },
      {
        "kind": "wh-question",
        "letter": "ظ",
        "prompt": "{q}"
      }
    ],
    "parentNote": "این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.",
    "reviewDays": [
      1,
      3,
      7
    ]
  }
];
