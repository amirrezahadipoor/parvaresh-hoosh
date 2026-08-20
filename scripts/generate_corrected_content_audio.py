# -*- coding: utf-8 -*-
"""Regenerate corrected/added Persian narration introduced by the content audit.

This is a developer-time tool. The app itself never calls TTS. It produces mono
24 kHz MP3 files with the same neural-voice + pitch/formant pipeline as the rest
of assets/audio/kid, then updates auto-manifest.json.
"""
import asyncio
import hashlib
import json
import os
import subprocess
import tempfile

import edge_tts

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'assets', 'audio', 'kid')
MANIFEST = os.path.join(OUT, 'auto-manifest.json')
VOICE = 'fa-IR-DilaraNeural'
RATE = '-10%'

LINES = [
    'هر بخش گیاه چه کاری دارد؟',
    'مراحل چرخهٔ آب را مرتب کن',
    'هر چیز را در سطل بازیافت درست بگذار',
    'برای صرفه‌جویی در آب کدام کار درست است؟',
    'برای صرفه‌جویی در برق کدام کار درست است؟',
    'برای تمیز ماندن طبیعت کدام کار درست است؟',
    'کدام وسیله نور خورشید را به برق تبدیل می‌کند؟',
    'کدام منبع انرژی با وزیدن هوا کار می‌کند؟',
    'کدام منبع انرژی پاک از حرکت آب استفاده می‌کند؟',
    'یخ در کدام حالت زودتر آب می‌شود؟',
    'دانه برای جوانه زدن بیشتر به چه نیاز دارد؟',
    'سایه چگونه ساخته می‌شود؟',
    'باران بیشتر از کجا می‌بارد؟',
    'سکه‌ها روی هم چند تومان می‌شوند؟',
    'ساعت چند است؟',
    'فکر کردن، یادگیری و حل مسئله‌ها',
]

SPECIAL = {
    'letter-se': 'این حرف «ث» است؛ ثِ سه‌نقطه. در فارسی صدای «س» می‌دهد. کلمهٔ «ثانیه» با حرف «ث» شروع می‌شود.',
    'letter-fe': 'این حرف «ف» است؛ فِ تک‌نقطه. صدای «ف» می‌دهد. کلمهٔ «فیل» با حرف «ف» شروع می‌شود.',
}


def auto_id(text):
    return 'auto-' + hashlib.sha256(text.encode('utf-8')).hexdigest()[:12]


async def render(name, text, semaphore):
    destination = os.path.join(OUT, name + '.mp3')
    fd, raw = tempfile.mkstemp(prefix='parvaresh-corrected-', suffix='.mp3')
    os.close(fd)
    try:
        async with semaphore:
            await edge_tts.Communicate(text, VOICE, rate=RATE).save(raw)
        subprocess.run([
            'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', raw,
            '-af', 'rubberband=pitch=1.28:formant=shifted',
            '-codec:a', 'libmp3lame', '-q:a', '4', '-ar', '24000', '-ac', '1', destination
        ], check=True)
        return name, os.path.getsize(destination)
    finally:
        if os.path.exists(raw):
            os.remove(raw)


async def main():
    with open(MANIFEST, encoding='utf-8') as handle:
        manifest = json.load(handle)
    jobs = dict(SPECIAL)
    for text in LINES:
        clip = auto_id(text)
        manifest[text] = clip
        jobs[clip] = text

    semaphore = asyncio.Semaphore(4)
    results = await asyncio.gather(*(render(name, text, semaphore) for name, text in jobs.items()))
    with open(MANIFEST, 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, ensure_ascii=False, indent=2, sort_keys=True)
        handle.write('\n')
    for name, size in results:
        print(f'{name}: {size} bytes')
    print(f'updated {MANIFEST} with {len(LINES)} corrected content lines')


if __name__ == '__main__':
    asyncio.run(main())
