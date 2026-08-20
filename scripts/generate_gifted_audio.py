# -*- coding: utf-8 -*-
"""Record the per-lesson child-voice narration for the gifted («تیزهوشان») track.

NO TEXT-TO-SPEECH RUNS IN THE APP. This script runs on a developer machine at
BUILD time only: it renders each line with an AI voice, then pitch-shifts it
+28% with formant shifting (identical to scripts/kidify.sh) to produce the
approved child timbre. The resulting mp3 is what ships; the app only ever plays
files from assets/audio/kid/.

Every one of the 50 gifted lessons gets its OWN spoken line, written for its
age band, plus the section intros. Wording rules used here:
  ۴ تا ۵ سال  - very short, concrete, no abstract nouns
  ۵ تا ۶ سال  - one short instruction, still picture-led
  ۶ تا ۷ سال  - names the strategy («خوب نگاه کن», «مقایسه کن»)
  ۷ تا ۸ سال  - exam language, allowed to be a full sentence

    python3 scripts/generate_gifted_audio.py

Then run `node scripts/sync_narration.js` to wire the clips in.
"""
import asyncio
import json
import os
import subprocess
import sys

try:
    import edge_tts
except ImportError:
    sys.exit("pip install edge-tts")

VOICE = "fa-IR-DilaraNeural"
RATE = "-10%"
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "assets", "audio", "kid")

# ---------------------------------------------------------------- intros ----
# Played once when the child walks into the section / a level.
SECTION = {
    "gifted-welcome":  "به مدرسه تیزهوشان خوش آمدی! اینجا با بازی، باهوش‌تر می‌شویم.",
    "gifted-raven":    "به جدول نگاه کن. کدام شکل جای خالی را کامل می‌کند؟",
    "gifted-balance":  "به ترازو نگاه کن. کدام طرف سنگین‌تر است؟",
    "gifted-memory":   "خوب نگاه کن و به خاطر بسپار. حافظه‌ات را قوی کن!",
    "gifted-shadow":   "سایه‌ها را با هم مقایسه کن و سایه درست را پیدا کن.",
    "gifted-odd":      "یکی از این‌ها با بقیه فرق دارد. پیدایش کن!",
    "gifted-classify": "این‌ها را در گروه درست خودشان بگذار.",
    "gifted-pattern":  "الگو را ببین و بگو بعدی چه چیزی می‌آید.",
    "gifted-order":    "این‌ها را به ترتیب درست بچین.",
    "gifted-number":   "با عددها بازی کنیم و سریع فکر کنیم!",
    "gifted-riddle":   "یک معمای باحال! خوب فکر کن و جواب را پیدا کن.",
    "gifted-reason":   "با دقت فکر کن و جواب درست را پیدا کن.",
    "gifted-compare":  "این‌ها را با هم مقایسه کن و درست را انتخاب کن.",
}

# ------------------------------------------------------- per-lesson lines ----
# clip id -> spoken text. The clip id matches the lesson id in lower case so the
# wiring is obvious: G-L1-L01 -> gifted-g-l1-l01.
LESSONS = {
    # ---- G-L1  ۴ تا ۵ سال : چشم تیزبین -------------------------------------
    "G-L1-L01": "یکی از این‌ها با بقیه فرق دارد. آن را پیدا کن!",
    "G-L1-L02": "هر چیزی یک سایه دارد. سایه درست را پیدا کن.",
    "G-L1-L03": "دو تا کارت مثل هم پیدا کن.",
    "G-L1-L04": "خوب نگاه کن. کدام یکی بزرگ‌تر است؟",
    "G-L1-L05": "چیزهای هم‌رنگ و هم‌شکل را کنار هم بگذار.",
    # ---- G-L2  ۴ تا ۵ سال : الگو و ترتیب -----------------------------------
    "G-L2-L01": "رنگ‌ها پشت سر هم می‌آیند. رنگ بعدی چیست؟",
    "G-L2-L02": "از کوچک شروع کن و تا بزرگ بچین.",
    "G-L2-L03": "خوب نگاه کن! یکی از تصویرها ناپدید می‌شود.",
    "G-L2-L04": "با هم بشماریم. چند تا شد؟",
    "G-L2-L05": "بادکنک درست را پیدا کن و بترکان!",
    # ---- G-L3  ۵ تا ۶ سال : الگوهای پنهان ----------------------------------
    "G-L3-L01": "الگوی شکل‌ها را ببین و شکل بعدی را پیدا کن.",
    "G-L3-L02": "عددها به ترتیب می‌آیند. عدد بعدی کدام است؟",
    "G-L3-L03": "دو تصویر شبیه هم هستند، اما یک فرق دارند. پیدایش کن!",
    "G-L3-L04": "جانداران را از بقیه چیزها جدا کن.",
    "G-L3-L05": "جای کارت‌ها را به خاطر بسپار و جفت‌ها را پیدا کن.",
    # ---- G-L4  ۵ تا ۶ سال : استدلال تصویری ---------------------------------
    "G-L4-L01": "یک خانه از جدول خالی است. کدام شکل آن‌جا می‌نشیند؟",
    "G-L4-L02": "این دو با هم رابطه دارند. رابطه را پیدا کن.",
    "G-L4-L03": "یک معمای کوچک! خوب فکر کن.",
    "G-L4-L04": "به ترتیب زنگ‌ها گوش کن و همان‌طور تکرار کن.",
    "G-L4-L05": "کارها را از اول تا آخر مرتب کن.",
    # ---- G-L5  ۵ تا ۶ سال : دقت و تمرکز ------------------------------------
    "G-L5-L01": "همه را خوب نگاه کن. کدام تصویر کم شد؟",
    "G-L5-L02": "سایه‌ها شبیه هم هستند. با دقت سایه درست را انتخاب کن.",
    "G-L5-L03": "با دقت بشمار و عدد درست را انتخاب کن.",
    "G-L5-L04": "اندازه‌ها را با هم مقایسه کن و به ترتیب بچین.",
    "G-L5-L05": "این طرف را مثل آن طرف رنگ کن تا قرینه شود.",
    # ---- G-L6  ۶ تا ۷ سال : ماتریس ریون ------------------------------------
    "G-L6-L01": "به سطر و ستون جدول نگاه کن و جای خالی را کامل کن.",
    "G-L6-L02": "این جدول سخت‌تر است. قانون شکل‌ها را پیدا کن.",
    "G-L6-L03": "مثل هم بودن یعنی چه؟ جفت درست را انتخاب کن.",
    "G-L6-L04": "از روی سرنخ‌ها حدس بزن جواب کدام است.",
    "G-L6-L05": "این‌ها را در دو مرحله دسته‌بندی کن.",
    # ---- G-L7  ۶ تا ۷ سال : ترازو و تعادل ----------------------------------
    "G-L7-L01": "ترازو به کدام طرف خم شده؟ آن طرف سنگین‌تر است.",
    "G-L7-L02": "دو وزنه داری. ترازو را متعادل کن.",
    "G-L7-L03": "این مسئله چند مرحله دارد. قدم به قدم حل کن.",
    "G-L7-L04": "بدون انگشت شمردن، در ذهنت حساب کن.",
    "G-L7-L05": "یک معمای منطقی! با دقت فکر کن.",
    # ---- G-L8  ۶ تا ۷ سال : حافظه فعال -------------------------------------
    "G-L8-L01": "به ترتیب زنگ‌ها خوب گوش کن و بعد تکرار کن.",
    "G-L8-L02": "وسیله‌ها را به خاطر بسپار. کدام یکی کم شد؟",
    "G-L8-L03": "جای جفت‌ها را حفظ کن و آن‌ها را پیدا کن.",
    "G-L8-L04": "اتفاق‌های داستان را به ترتیب درست بچین.",
    "G-L8-L05": "الگوی صداها و رنگ‌ها را دنبال کن.",
    # ---- G-L9  ۷ تا ۸ سال : آزمون ورودی ------------------------------------
    "G-L9-L01": "این ماتریس پیشرفته است. قانون سطرها و ستون‌ها را کشف کن.",
    "G-L9-L02": "دنباله عددی را ادامه بده. قانون آن چیست؟",
    "G-L9-L03": "متضاد این کلمه کدام است؟ خوب فکر کن.",
    "G-L9-L04": "این مسئله چند گام دارد. هر گام را جداگانه حل کن.",
    "G-L9-L05": "از روی اطلاعاتی که داری، نتیجه درست را بگیر.",
    # ---- G-L10 ۷ تا ۸ سال : سرعت و دقت -------------------------------------
    "G-L10-L01": "یک توالی بلند! همه را به خاطر بسپار و تکرار کن.",
    "G-L10-L02": "سریع باش و دقیق. تفاوت را زود پیدا کن.",
    "G-L10-L03": "سریع و درست حساب کن.",
    "G-L10-L04": "این الگو چند قانون با هم دارد. همه را پیدا کن.",
    "G-L10-L05": "آخرین معمای تیزهوشان! نشان بده چقدر باهوشی.",
}


def clip_id(lesson_id):
    """G-L1-L01 -> gifted-g-l1-l01 (stable, lowercase, filesystem-safe)."""
    return "gifted-" + lesson_id.lower()


async def render(name, text, sem):
    final = os.path.join(OUT, name + ".mp3")
    raw = f"/tmp/raw_{name}.mp3"
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, VOICE, rate=RATE).save(raw)
                break
            except Exception as exc:                       # network flake
                if attempt == 2:
                    print("VOICE FAIL:", name, exc, flush=True)
                    return name, False
                await asyncio.sleep(2 * (attempt + 1))
    try:
        # Identical to scripts/kidify.sh: the ONE approved transformation.
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", raw,
             "-af", "rubberband=pitch=1.28:formant=shifted",
             "-codec:a", "libmp3lame", "-q:a", "4", "-ar", "24000", "-ac", "1",
             final],
            check=True)
    except subprocess.CalledProcessError as exc:
        print("KIDIFY FAIL:", name, exc, flush=True)
        return name, False
    finally:
        if os.path.exists(raw):
            os.remove(raw)
    return name, True


async def main():
    jobs = dict(SECTION)
    for lesson_id, text in LESSONS.items():
        jobs[clip_id(lesson_id)] = text

    sem = asyncio.Semaphore(4)
    results = await asyncio.gather(*(render(n, t, sem) for n, t in jobs.items()))
    ok = [n for n, good in results if good]
    bad = [n for n, good in results if not good]
    print(f"recorded {len(ok)} / {len(jobs)} clips")
    if bad:
        print("FAILED:", bad)

    # Emit the lesson -> clip mapping the generator reads.
    mapping = {lid: clip_id(lid) for lid in LESSONS}
    with open(os.path.join(OUT, "gifted-lesson-clips.json"), "w", encoding="utf-8") as handle:
        json.dump(mapping, handle, ensure_ascii=False, indent=1, sort_keys=True)
    print("wrote gifted-lesson-clips.json with", len(mapping), "entries")

asyncio.run(main())
