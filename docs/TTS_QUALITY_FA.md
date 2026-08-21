# تصمیم فنی کیفیت تلفظ فارسی

## نتیجهٔ بررسی منابع

1. `edge-tts` فقط کنترل‌های prosody خود Edge مانند rate، volume و pitch را می‌پذیرد؛
   SSML سفارشی و phoneme tag در API عمومی Edge حذف شده است:
   https://pypi.org/project/edge-tts/
2. Azure Speech دو صدای بومی فارسی `fa-IR-DilaraNeural` و
   `fa-IR-FaridNeural` دارد:
   https://learn.microsoft.com/en-us/azure/ai-services/speech-service/releasenotes
3. روش‌های رایج رفع خطای تلفظ TTS عبارت‌اند از normalization، واژه‌نامهٔ مرکزی،
   phonetic respelling، کنترل اعداد و SSML/lexicon در سرویس‌هایی که پشتیبانی می‌کنند:
   https://deepgram.com/learn/common-tts-pronunciation-errors
4. مدل‌های فارسی متن‌باز مانند Persian Coqui/VITS، MMS و Piper وجود دارند، اما
   کیفیت و مجوز هر checkpoint باید جداگانه ارزیابی شود:
   https://github.com/karim23657/awesome-Persian-Speech

## تصمیم اعمال‌شده

- صدای بومی `fa-IR-DilaraNeural` حفظ شد.
- سرعت برای کودک `-10%` است.
- pitch موتور روی حالت طبیعی و بدون تغییر، یعنی `+0Hz`، قرار گرفت.
- تغییر pitch پس از تولید کاملاً حذف شد (`postPitch=1.00`).
- سه پیکربندی روی هر ۳۲ درس حرف با `faster-whisper-small` و معیار CER مقایسه شدند:
  Dilara/+0Hz برابر 0.2223، Dilara/+8Hz برابر 0.2269 و Farid/+8Hz برابر 0.2296.
  پیکربندی +0Hz کمترین خطای میانگین را داشت و انتخاب شد. نتیجه در
  `QA_PRONUNCIATION_BENCHMARK.json` ثبت شده است.
- ffmpeg فقط خروجی را به MP3 mono 24kHz استاندارد می‌کند.
- علت: pitch-shift پس از synthesis می‌تواند مرز همخوان‌های فارسی، مخصوصاً ث/ف،
  س/ص و ز/ذ/ض/ظ را مبهم کند؛ prosody بومی موتور قبل از vocoder کم‌تخریب‌تر است.
- متن گفتاری از متن نمایشی مستقل و با Unicode NFC، حروف فارسی، عددواژه، علائم
  نگارشی و اعراب حداقلی تولید می‌شود.
- عبارت‌های عامیانه یا مبهم از narration حذف شده‌اند.
- برای حروف هم‌آوا، نام نویسه و واج شنیداری جداگانه ثبت شده است.

## محدودیت

Edge عمومی phoneme/IPA سفارشی ندارد. اگر بعداً Azure Speech Key تجاری فراهم شود،
می‌توان pipeline دوم مبتنی بر SSML و custom lexicon ساخت و با آزمون شنیداری A/B
بین Dilara، Farid و مدل منتخب فارسی، بهترین خروجی هر واژه را انتخاب کرد.
