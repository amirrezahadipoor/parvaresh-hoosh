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
    "id": "reading-letters-06",
    "domain": "reading",
    "order": 9,
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
    "order": 10,
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
    "id": "reading-letters-07",
    "domain": "reading",
    "order": 11,
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
    "order": 12,
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
    "id": "reading-letters-08",
    "domain": "reading",
    "order": 13,
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
    "order": 14,
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
    "id": "reading-letters-09",
    "domain": "reading",
    "order": 15,
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
    "order": 16,
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
    "id": "reading-letters-10",
    "domain": "reading",
    "order": 17,
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
    "order": 18,
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
    "id": "reading-letters-11",
    "domain": "reading",
    "order": 19,
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
    "order": 20,
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
    "id": "reading-letters-12",
    "domain": "reading",
    "order": 21,
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
    "order": 22,
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
    "id": "reading-letters-13",
    "domain": "reading",
    "order": 23,
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
    "order": 24,
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
    "id": "reading-letters-14",
    "domain": "reading",
    "order": 25,
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
    "order": 26,
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
    "id": "reading-letters-15",
    "domain": "reading",
    "order": 27,
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
    "order": 28,
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
    "id": "reading-letters-16",
    "domain": "reading",
    "order": 29,
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
    "order": 30,
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
    "id": "reading-letters-17",
    "domain": "reading",
    "order": 31,
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
    "order": 32,
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
    "id": "reading-letters-18",
    "domain": "reading",
    "order": 33,
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
    "order": 34,
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
    "id": "reading-letters-19",
    "domain": "reading",
    "order": 35,
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
    "order": 36,
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
    "id": "reading-letters-20",
    "domain": "reading",
    "order": 37,
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
    "order": 38,
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
  }
];
