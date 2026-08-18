# Khanak Academy — خنک آکادمی

A comprehensive, fully offline Persian educational application for children aged 5 to 8, built with the depth and quality of Khan Academy Kids and localized for Persian language, alphabet, and culture.

The application is a hundred percent offline — no server, no online API, no internet connection is needed at runtime. All assets (audio synthesis, fonts, illustrations, curriculum) are bundled into the Android package.

## Tech stack

| Layer | Technology |
|-------|-----------|
| UI | HTML5, CSS, JavaScript (vanilla) |
| Game engine | Phaser.js (bundled) |
| Animation | GSAP (bundled) |
| Storage | IndexedDB (with localStorage fallback) |
| Audio | WebAudio API (synthesized SFX) + system SpeechSynthesis (Persian TTS) |
| Mobile shell | Capacitor |
| Build | Gradle + Android SDK 33+ |
| Min Android | 6.0 (API 23) |
| Target Android | 15 (API 35) |

## Curriculum

Six domain areas, 36 difficulty levels, 142 lessons:

| Domain | Levels | Lessons |
|--------|-------:|--------:|
| Reading and writing Persian | 7 | 37 |
| Mathematics | 8 | 39 |
| Logic and problem solving | 6 | 19 |
| Basic science | 6 | 20 |
| Social-emotional skills | 5 | 15 |
| Art and creativity | 4 | 12 |
| **Total** | **36** | **142** |

Levels span from very easy (level 1) to challenging (level 8), arranged in a documented `content/curriculum.json`.

## Activity engines

Seven activity types cover all required learning interactions:

1. Quiz — multi-choice with image and audio narration.
2. Memory match — flip cards in pairs.
3. Drag and drop — drag items into matching targets.
4. Tracing — finger writing on canvas over a ghost letter or number.
5. Ordering — tap-tap swap to order by size, sequence, or story.
6. Pattern completion — find the next item in a color, shape, or number pattern.
7. Free painting — canvas with color palette.

Each activity provides instant audio and visual feedback (sound effects, particles, mascot reactions).

## Adaptive assessment

Per-domain performance is tracked. After two correct answers in a row the difficulty is increased; after two wrong answers it is lowered. The system is local only — no data leaves the device.

The parent dashboard is PIN protected and shows per-domain accuracy, current difficulty, badges (Strong / Growing / Needs practice), and a summary screen with total stars collected.

## Visual identity

- Six domain colors (warm red, teal, soft purple, golden yellow, coral, pink).
- Mascot: Khanak the fox — a friendly orange fox wearing round purple glasses, rendered as inline SVG with multiple moods (happy, thinking, surprised, proud, sad).
- Persian font: Vazirmatn (OFL licensed, bundled).
- All illustrations are drawn programmatically with SVG and the Canvas API — no copyrighted or third-party art.

## Project structure

```
.
├── index.html              App shell, RTL layout, splash, screens
├── src/
│   ├── styles/main.css     Stylesheet
│   ├── core/
│   │   ├── config.js       Domain and theme config
│   │   ├── audio.js        WebAudio synthesized SFX
│   │   ├── storage.js      IndexedDB and localStorage
│   │   ├── adaptive.js     Adaptive difficulty engine
│   │   ├── mascot.js       Fox mascot SVG component
│   │   ├── svg-art.js      Programmatic illustration library
│   │   ├── fx.js           Confetti and particle effects
│   │   └── nav.js          Screen router
│   ├── activities/
│   │   ├── generator.js    Per-lesson round generation
│   │   ├── quiz.js
│   │   ├── memory.js
│   │   ├── dragdrop.js
│   │   ├── tracing.js
│   │   ├── ordering.js
│   │   └── painting.js
│   ├── data/
│   │   ├── alphabet.js     Persian alphabet, word lists
│   │   ├── words.js        Frequent words, opposites, rhyming
│   │   ├── math-data.js    Numbers, shapes, patterns
│   │   └── world-data.js   Animals, body, seasons, emotions
│   └── main.js             Main controller
├── content/
│   ├── curriculum.json     Curriculum map (6 domains, 36 levels)
│   └── content_manifest.json
├── assets/fonts/           Bundled Vazirmatn woff2 weights
├── vendor/                 Bundled phaser.min.js, gsap.min.js
├── www/                    Build dir consumed by Capacitor
├── android/                Generated Capacitor Android project
│   └── app/src/main/res/   App icon, theme, strings
└── style-guide.md          Brand and visual style documentation
```

## Offline guarantee

Every network request during runtime is local. The application uses:

- `fetch('content/curriculum.json')` — served from bundled assets via Capacitor's https scheme.
- WebAudio — synthesized in-browser, no audio files.
- SpeechSynthesis — uses device's installed Persian voice (no network call).

The Playwright offline test confirmed zero external requests during a complete user flow.

## Build

Requirements: Node 18+, Java 17 or 21, Android SDK 33+, build-tools 33+.

```sh
git clone <repo>
cd parvaresh-hoosh
npm install
npx cap sync android
cd android
JAVA_HOME=/path/to/java17 ./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk` (about 18 MB).

Install on a connected device: `adb install app-debug.apk`.

## App identity

- Package: `ir.parvareshhoosh.khanak`
- Launcher name: خنک آکادمی
- Launcher icon: fox mascot with round purple glasses on warm red background

## License

Original work licensed under MIT.

Third-party packages used at build time:

- Vazirmatn font — SIL Open Font License 1.1
- Phaser.js — MIT
- GSAP — Standard "no charge" license (free for all uses)
- Capacitor — MIT

All in-game art, audio synthesis code, and curriculum text authored for this project.
