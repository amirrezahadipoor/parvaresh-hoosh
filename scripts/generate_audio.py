# -*- coding: utf-8 -*-
"""
Regenerate every bundled narration clip with a REAL Persian neural voice.

Why this script exists
----------------------
The original clips were produced with a text-to-speech service that has no
Persian voice at all (gTTS supports 'ar' but not 'fa'). The letters were
therefore spoken by an ARABIC voice, which is why «ب» sounded wrong.

edge-tts exposes two genuine Persian voices:
    fa-IR-DilaraNeural  (female)  <- used here, warmer for young children
    fa-IR-FaridNeural   (male)

Every transcript lives in this file so the wording can be reviewed and the
clips reproduced exactly. Run:  python3 scripts/generate_audio.py
"""
import asyncio
import os
import sys

try:
    import edge_tts
except ImportError:
    sys.exit("pip install edge-tts")

VOICE = "fa-IR-DilaraNeural"
RATE = "-10%"          # a little slower than default for 4-8 year olds
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "audio")

# ---------------------------------------------------------------- letters ----
# name -> (letter, spoken sound, example word)
LETTERS = {
    "alef":  ("ا",  "اَ",   "اسب"),
    "be":    ("ب",  "بِ",   "بادکنک"),
    "pe":    ("پ",  "پِ",   "پروانه"),
    "te":    ("ت",  "تِ",   "توپ"),
    "se":    ("ث",  "ثِ",   "ثانیه"),
    "jim":   ("ج",  "جِ",   "جوجه"),
    "che":   ("چ",  "چِ",   "چتر"),
    "he":    ("ح",  "حِ",   "حوض"),
    "khe":   ("خ",  "خِ",   "خرگوش"),
    "dal":   ("د",  "دِ",   "درخت"),
    "zal":   ("ذ",  "ذِ",   "ذرت"),
    "re":    ("ر",  "رِ",   "رنگین‌کمان"),
    "ze":    ("ز",  "زِ",   "زنبور"),
    "zhe":   ("ژ",  "ژِ",   "ژاکت"),
    "sin":   ("س",  "سِ",   "سیب"),
    "shin":  ("ش",  "شِ",   "شیر"),
    "sad":   ("ص",  "صِ",   "صابون"),
    "zad":   ("ض",  "ضِ",   "ضربه"),
    "ta":    ("ط",  "طِ",   "طوطی"),
    "za":    ("ظ",  "ظِ",   "ظرف"),
    "eyn":   ("ع",  "عِ",   "عسل"),
    "gheyn": ("غ",  "غِ",   "غذا"),
    "fe":    ("ف",  "فِ",   "فیل"),
    "ghaf":  ("ق",  "قِ",   "قایق"),
    "kaf":   ("ک",  "کِ",   "کتاب"),
    "gaf":   ("گ",  "گِ",   "گل"),
    "lam":   ("ل",  "لِ",   "لیمو"),
    "mim":   ("م",  "مِ",   "ماهی"),
    "nun":   ("ن",  "نِ",   "نان"),
    "vav":   ("و",  "وِ",   "ورزش"),
    "heh":   ("ه",  "هِ",   "هندوانه"),
    "ye":    ("ی",  "یِ",   "یخ"),
}

def letter_script(letter, sound, example):
    return (f"این حرف «{letter}» است. صدایش «{sound}» است. "
            f"«{example}» با «{letter}» شروع می‌شود.")

# ------------------------------------------------------------ lesson intros --
LESSON = {
    "lesson-R-L1-L01": "بیا با هم صدای حرف‌های اَ، ب، پ و ت را یاد بگیریم.",
    "lesson-R-L1-L02": "بیا با هم صدای حرف‌های ث، ج، چ و ح را یاد بگیریم.",
    "lesson-R-L1-L03": "بیا با هم صدای حرف‌های خ، د، ذ و ر را یاد بگیریم.",
    "lesson-R-L1-L04": "بیا با هم صدای حرف‌های ز، ژ، س و ش را یاد بگیریم.",
    "lesson-R-L1-L05": "بیا با هم صدای حرف‌های ص، ض، ط و ظ را یاد بگیریم.",
    "lesson-R-L1-L06": "بیا با هم صدای حرف‌های ع، غ، ف و ق را یاد بگیریم.",
    "lesson-R-L1-L07": "بیا با هم صدای حرف‌های ک، گ، ل و م را یاد بگیریم.",
    "lesson-R-L1-L08": "بیا با هم صدای حرف‌های ن، و، ه و ی را یاد بگیریم.",
}

# ------------------------------------------------------------ topic intros ---
TOPIC = {
    "topic-counting":    "بیا با هم بشماریم. شمردن یعنی بدانیم چند تا چیز داریم.",
    "topic-addition":    "جمع کردن یعنی چیزها را کنار هم بگذاریم و ببینیم چند تا می‌شود.",
    "topic-subtraction": "تفریق یعنی از تعدادی چیز، چند تا برداریم و ببینیم چند تا می‌ماند.",
    "topic-shapes":      "دور و بر ما پر از شکل است: دایره، مربع، مثلث و ستاره.",
    "topic-animals":     "بیا با حیوان‌ها آشنا شویم. هر حیوان صدا و خانهٔ خودش را دارد.",
    "topic-seasons":     "سال چهار فصل دارد: بهار، تابستان، پاییز و زمستان.",
    "topic-senses":      "ما پنج حس داریم: دیدن، شنیدن، بوییدن، چشیدن و لمس کردن.",
    "topic-emotions":    "همهٔ ما احساس داریم؛ گاهی شاد، گاهی ناراحت. حرف زدن دربارهٔ احساس‌ها خوب است.",
    "topic-art":         "وقت هنر است! با رنگ‌ها هر چه دوست داری بساز.",
    "topic-reading":     "بیا با هم بخوانیم. خواندن ما را به دنیای قصه‌ها می‌برد.",
    "topic-logic":       "وقت فکر کردن است! با دقت نگاه کن و جواب را پیدا کن.",
    "topic-words":       "بیا با کلمه‌ها بازی کنیم و صدای آن‌ها را بشنویم.",
    "topic-memory":      "حافظه‌ات را تمرین کن. با دقت نگاه کن و به یاد بسپار.",
    "topic-sequence":    "بیا چیزها را به ترتیب درست بچینیم؛ از اول تا آخر.",
    "topic-sentence":    "با کنار هم گذاشتن کلمه‌ها، جملهٔ کامل می‌سازیم.",
    "topic-classify":    "بیا چیزها را دسته‌بندی کنیم و هرکدام را کنار هم‌گروهش بگذاریم.",
    "topic-create":      "وقت خلاقیت است! قصه و تصویر خودت را بساز.",
    "topic-music":       "بیا با ریتم و آهنگ بازی کنیم و گوش بدهیم.",
}


async def synth(name, text):
    path = os.path.abspath(os.path.join(OUT, name + ".mp3"))
    c = edge_tts.Communicate(text, VOICE, rate=RATE)
    await c.save(path)
    return name, os.path.getsize(path)


async def main():
    jobs = []
    for key, (ltr, snd, ex) in LETTERS.items():
        jobs.append(("letter-" + key, letter_script(ltr, snd, ex)))
    jobs.extend(LESSON.items())
    jobs.extend(TOPIC.items())

    print(f"voice={VOICE} rate={RATE} clips={len(jobs)}")
    done = 0
    for i in range(0, len(jobs), 6):        # small batches, kinder to the service
        batch = jobs[i:i + 6]
        for name, size in await asyncio.gather(*(synth(n, t) for n, t in batch)):
            done += 1
            print(f"  [{done:2d}/{len(jobs)}] {name:22s} {size:6d} B")
    print("done")


if __name__ == "__main__":
    asyncio.run(main())
