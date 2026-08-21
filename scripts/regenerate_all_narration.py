# -*- coding: utf-8 -*-
"""Rebuild every shipped narration clip from a canonical Persian transcript.

The app never invokes TTS. This developer-only script guarantees one exact
transcript per auto clip, regenerates letters/topics/gifted intros, removes old
shared/orphan clips, and writes a SHA-256 provenance ledger checked by CI.
"""
import asyncio
import hashlib
import importlib.util
import json
import os
import subprocess
import tempfile
from datetime import datetime, timezone

import edge_tts

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'assets', 'audio', 'kid')
AUTO_MANIFEST = os.path.join(OUT, 'auto-manifest.json')
PROVENANCE = os.path.join(OUT, 'narration-provenance.json')
VOICE = 'fa-IR-DilaraNeural'
RATE = '-10%'
PITCH = '1.15'


def load_module(name, relative):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, relative))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def current_text_map():
    source = open(os.path.join(ROOT, 'src', 'data', 'narration-map.js'), encoding='utf-8').read()
    prefix = 'window.NARRATION_MAP = '
    if not source.startswith('// GENERATED') or prefix not in source:
        raise RuntimeError('narration-map.js has an unexpected format')
    payload = source[source.index(prefix) + len(prefix):].strip()
    if not payload.endswith(';'):
        raise RuntimeError('narration-map.js is not terminated')
    return json.loads(payload[:-1])


def auto_id(text):
    return 'auto-' + hashlib.sha256(text.encode('utf-8')).hexdigest()[:12]


def generated_math_texts():
    words = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده',
             'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست']
    texts = set()
    for n in range(1, 21):
        texts.add(f'چند تا شکل می‌بینی؟ {words[n]} تا')
        texts.add(f'عدد {words[n]} را انتخاب کن')
        texts.add(f'با انگشت روی عدد {str(n).translate(str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹"))} بکش')
        if n < 20:
            texts.add(f'عدد بعد از {words[n]} کدام است؟')
    for a in range(1, 20):
        for b in range(1, 21 - a):
            texts.add(f'{words[a]} به اضافه {words[b]} چند می‌شود؟')
    for a in range(2, 21):
        for b in range(1, a):
            texts.add(f'{words[a]} منهای {words[b]} چند می‌شود؟')
    return texts


def runtime_extra_texts():
    balloon_sounds = {
        'صدای آ', 'صدای ب', 'صدای پ', 'صدای ت', 'صدای ج', 'صدای د', 'صدای ر', 'صدای س',
        'صدای ش', 'صدای م', 'صدای ن', 'صدای ک', 'صدای گ', 'صدای ل',
        'عدد یک', 'عدد دو', 'عدد سه', 'عدد چهار', 'عدد پنج', 'عدد شش', 'عدد هفت', 'عدد هشت', 'عدد نه', 'عدد ده',
        'شکل دایره', 'شکل مربع', 'شکل مثلث', 'ستاره طلایی', 'خورشید', 'باران', 'گل زیبا', 'درخت سبز',
        'گربه', 'سگ', 'خرگوش', 'فیل', 'سیب قرمز', 'موز زرد', 'کتاب', 'قلب مهربانی'
    }
    animal_names = ['خرگوش مهربون', 'هاپو باوفا', 'پیشی ملوس', 'میمون زرنگ', 'فیل آرام', 'خرس مهربان',
                    'لاک‌پشت آرام', 'روباه زرنگ', 'قورباغه شاد', 'گاو دوست‌داشتنی', 'گوسفند پشمالو', 'اردک زرد']
    turns = [
        ('کودک', 'یک رنگ در اتاق پیدا کن و اسمش را بگو.'),
        ('والد', 'یک جملهٔ کوتاه و مشخص برای تشویق کودک بگو.'),
        ('کودک', 'یک صدای حیوان را اجرا کن تا والد حدس بزند.'),
        ('والد', 'از کودک بپرس امروز چه چیزی برایش جالب بود.'),
        ('کودک', 'با سه شیء کوچک یک الگو بساز.'),
        ('والد', 'تلاش کودک را توصیف کن، نه فقط نتیجه را.')
    ]
    texts = set(balloon_sounds)
    texts.update(f'به {name} چی غذا بدیم؟' for name in animal_names)
    texts.update(f'{count} تا هدیه داخل واگن قطار بذار!' for count in range(2, 7))
    texts.update(f'{role}. {prompt}' for role, prompt in turns)
    texts.update({
        'کلیدهای رنگین‌کمان را لمس کن تا آهنگ شاد بنوازی!',
        'حالا زنگ‌ها را به همان ترتیب لمس کن!',
        'کدام وسیله ناپدید شد؟',
        'دانلود گزارش در این دستگاه در دسترس نیست',
        'ساخت پشتیبان انجام نشد',
        'داستان را بخوان و پاسخ درست را انتخاب کن',
        'به جمله و واژه‌ها دقت کن و پاسخ درست را پیدا کن'
    })
    return texts


def build_jobs():
    ga = load_module('generate_audio', 'scripts/generate_audio.py')
    gg = load_module('generate_gifted_audio', 'scripts/generate_gifted_audio.py')
    corrected = load_module('generate_corrected_content_audio', 'scripts/generate_corrected_content_audio.py')

    texts = set(corrected.LINES)
    texts.update(generated_math_texts())
    texts.update(runtime_extra_texts())
    texts.update({'صدای آخر کلمه را پیدا کن', 'هر تصویر را به واژهٔ درست وصل کن'})
    for text, old_clip in current_text_map().items():
        if not str(old_clip).startswith('letter-'):
            texts.add(text)

    auto_manifest = {text: auto_id(text) for text in sorted(texts)}
    jobs = {clip: text for text, clip in auto_manifest.items()}
    kinds = {clip: 'runtime-text' for clip in jobs}

    for key, (letter, sound, example) in ga.LETTERS.items():
        clip = 'letter-' + key
        jobs[clip] = ga.letter_script(letter, sound, example)
        kinds[clip] = 'letter'
    for clip, text in ga.TOPIC.items():
        jobs[clip] = text
        kinds[clip] = 'topic'
    for clip, text in gg.SECTION.items():
        jobs[clip] = text
        kinds[clip] = 'gifted-section'
    for lesson_id, text in gg.LESSONS.items():
        clip = gg.clip_id(lesson_id)
        jobs[clip] = text
        kinds[clip] = 'gifted-lesson'

    return jobs, kinds, auto_manifest


async def synthesize(clip, text, semaphore):
    destination = os.path.join(OUT, clip + '.mp3')
    last_error = None
    for attempt in range(4):
        fd, raw = tempfile.mkstemp(prefix='parvaresh-narration-', suffix='.mp3')
        os.close(fd)
        try:
            async with semaphore:
                await edge_tts.Communicate(text, VOICE, rate=RATE).save(raw)
            subprocess.run([
                'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', raw,
                '-af', f'rubberband=pitch={PITCH}:formant=shifted',
                '-codec:a', 'libmp3lame', '-q:a', '4', '-ar', '24000', '-ac', '1', destination
            ], check=True)
            return destination
        except Exception as error:
            last_error = error
            await asyncio.sleep(1.5 * (attempt + 1))
        finally:
            if os.path.exists(raw):
                os.remove(raw)
    raise RuntimeError(f'failed to synthesize {clip}: {last_error}')


async def main():
    os.makedirs(OUT, exist_ok=True)
    jobs, kinds, auto_manifest = build_jobs()
    old_ledger = {}
    if os.path.exists(PROVENANCE):
        try:
            old_ledger = json.load(open(PROVENANCE, encoding='utf-8'))
        except Exception:
            old_ledger = {}
    can_reuse_pipeline = (old_ledger.get('voice') == VOICE and old_ledger.get('rate') == RATE
                          and old_ledger.get('pitch') == PITCH)
    semaphore = asyncio.Semaphore(5)
    names = sorted(jobs)
    completed = 0
    reused = 0

    async def run_one(name):
        nonlocal completed, reused
        path = os.path.join(OUT, name + '.mp3')
        record = (old_ledger.get('clips') or {}).get(name)
        valid_existing = False
        if can_reuse_pipeline and record and record.get('text') == jobs[name] and os.path.exists(path):
            digest = hashlib.sha256(open(path, 'rb').read()).hexdigest()
            valid_existing = digest == record.get('sha256')
        if valid_existing:
            reused += 1
        else:
            path = await synthesize(name, jobs[name], semaphore)
        completed += 1
        if completed % 25 == 0 or completed == len(names):
            print(f'{completed}/{len(names)}', flush=True)
        return name, path

    results = await asyncio.gather(*(run_one(name) for name in names))
    expected = set(jobs)
    removed = []
    for filename in os.listdir(OUT):
        if not filename.endswith('.mp3'):
            continue
        clip = filename[:-4]
        if clip not in expected:
            os.remove(os.path.join(OUT, filename))
            removed.append(clip)

    with open(AUTO_MANIFEST, 'w', encoding='utf-8') as handle:
        json.dump(auto_manifest, handle, ensure_ascii=False, indent=2, sort_keys=True)
        handle.write('\n')

    ledger = {
        'schemaVersion': 1,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'voice': VOICE,
        'rate': RATE,
        'pitch': PITCH,
        'sampleRate': 24000,
        'channels': 1,
        'clips': {}
    }
    for name, path in results:
        data = open(path, 'rb').read()
        ledger['clips'][name] = {
            'kind': kinds[name],
            'text': jobs[name],
            'bytes': len(data),
            'sha256': hashlib.sha256(data).hexdigest()
        }
    with open(PROVENANCE, 'w', encoding='utf-8') as handle:
        json.dump(ledger, handle, ensure_ascii=False, indent=2, sort_keys=True)
        handle.write('\n')

    print(f'total={len(jobs)} reused={reused} synthesized={len(jobs)-reused} removed_orphans={len(removed)} auto_texts={len(auto_manifest)}')


if __name__ == '__main__':
    asyncio.run(main())
