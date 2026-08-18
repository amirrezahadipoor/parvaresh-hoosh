// Endless Replayable Arcade Educational Games for "پرورش هوش کودک"
// Continuous Loops, High Replay Value, Score Multipliers & Joyful Mechanics
window.ArcadeGames = (function() {

    // List of Arcade Games
    const GAMES = [
        {
            id: 'balloon-catcher',
            title: 'شکار بادکنک‌های جادویی',
            subtitle: 'ترکاندن بی‌پایان با امتیاز و زنجیره ستاره‌ها',
            icon: '🎈',
            color: '#FF6B6B',
            bg: '#FFEAEA'
        },
        {
            id: 'feed-animals',
            title: 'غذا دادن به حیوانات شکمو',
            subtitle: 'انتخاب خوراکی خوشمزه برای حیوانات بامزه',
            icon: '🥕',
            color: '#FFA502',
            bg: '#FFF4E5'
        },
        {
            id: 'music-bells',
            title: 'بلز و پیانوی جادویی',
            subtitle: 'نواختن آهنگ‌های شاد کودکانه با نت‌های رنگین‌کمان',
            icon: '🎵',
            color: '#00D2D3',
            bg: '#E0F9F9'
        },
        {
            id: 'cargo-train',
            title: 'قطار بارگیری اعداد و ستاره‌ها',
            subtitle: 'پر کردن واگن‌های قطار با شمارش دقیق',
            icon: '🚂',
            color: '#6C5CE7',
            bg: '#EFEAFC'
        },
        {
            id: 'speed-memory',
            title: 'مسابقه سرعت کارت‌های حافظه',
            subtitle: 'رکوردزنی جفت‌یابی کارت‌های سه‌بعدی',
            icon: '⚡',
            color: '#2ED573',
            bg: '#E7F9F0'
        },
        {
            id: 'lucky-wheel',
            title: 'چرخونه شانس و جوایز روزانه',
            subtitle: 'گرداندن چرخونه و دریافت ستاره‌ها و استیکرها',
            icon: '🎡',
            color: '#F368E0',
            bg: '#FEE7FA'
        }
    ];

    function list() {
        return GAMES;
    }

    function toFa(n) {
        const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(n).replace(/[0-9]/g, w => map[+w]);
    }

    // ==========================================
    // 1. BALLOON CATCHER ARCADE (شکار بادکنک‌های جادویی)
    // ==========================================
    function launchBalloonCatcher(container, onExit) {
        container.innerHTML = `
            <div class="arcade-card">
                <div class="arcade-hud">
                    <button class="action-pill-btn" id="arcade-exit-btn"><span>خروج ✕</span></button>
                    <div class="arcade-score-badge">امتیاز: <span id="balloon-score">۰</span></div>
                    <div class="arcade-combo-badge" id="balloon-combo">زنجیره: ۱x</div>
                </div>
                <div class="balloon-arcade-stage" id="balloon-stage"></div>
            </div>
        `;

        let score = 0;
        let combo = 1;
        let activeBalloons = [];
        let spawnInterval = null;

        const stage = container.querySelector('#balloon-stage');
        const scoreEl = container.querySelector('#balloon-score');
        const comboEl = container.querySelector('#balloon-combo');
        const exitBtn = container.querySelector('#arcade-exit-btn');

        exitBtn.onclick = () => {
            clearInterval(spawnInterval);
            AudioEngine.play('click');
            if (onExit) onExit();
        };

        const balloonItems = [
            { text: 'الف', sound: 'صدای آ', color: '#FF4757' },
            { text: 'ب', sound: 'صدای ب', color: '#1E90FF' },
            { text: 'پ', sound: 'صدای پ', color: '#2ED573' },
            { text: 'ت', sound: 'صدای ت', color: '#FFA502' },
            { text: '۱', sound: 'عدد یک', color: '#9B59B6' },
            { text: '۲', sound: 'عدد دو', color: '#FF6B81' },
            { text: '۳', sound: 'عدد سه', color: '#00D2D3' },
            { text: '۴', sound: 'عدد چهار', color: '#F1C40F' },
            { text: '۵', sound: 'عدد پنج', color: '#FF763B' },
            { text: '⭐', sound: 'ستاره طلایی', color: '#F9CA24' }
        ];

        function spawnBalloon() {
            if (activeBalloons.length >= 7) return;
            const item = balloonItems[Math.floor(Math.random() * balloonItems.length)];
            const b = document.createElement('div');
            b.className = 'arcade-balloon-item';
            const leftPct = Math.floor(Math.random() * 75) + 10;
            b.style.left = leftPct + '%';

            b.innerHTML = `
                <div class="balloon-body" style="background:${item.color};">
                    <span class="balloon-text">${item.text}</span>
                    <div class="balloon-knot" style="border-top-color:${item.color};"></div>
                    <div class="balloon-string"></div>
                </div>
            `;

            b.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                if (b.classList.contains('popped')) return;
                b.classList.add('popped');
                AudioEngine.play('pop');
                AudioEngine.speak(item.sound);

                score += 10 * combo;
                combo = Math.min(5, combo + 1);
                scoreEl.textContent = toFa(score);
                comboEl.textContent = `زنجیره: ${toFa(combo)}x`;

                if (window.Fx) {
                    Fx.stars(stage, 4);
                }

                setTimeout(() => {
                    b.remove();
                    activeBalloons = activeBalloons.filter(x => x !== b);
                }, 300);
            });

            stage.appendChild(b);
            activeBalloons.push(b);

            // Float up animation
            const dur = 4500 + Math.random() * 2000;
            const anim = b.animate([
                { transform: 'translateY(360px)', opacity: 1 },
                { transform: 'translateY(-120px)', opacity: 0.9 }
            ], { duration: dur, easing: 'linear' });

            anim.onfinish = () => {
                if (b.parentNode) b.remove();
                activeBalloons = activeBalloons.filter(x => x !== b);
                combo = 1;
                comboEl.textContent = `زنجیره: ۱x`;
            };
        }

        spawnInterval = setInterval(spawnBalloon, 800);
        spawnBalloon();
        spawnBalloon();
    }

    // ==========================================
    // 2. FEED THE HUNGRY ANIMALS (غذا دادن به حیوانات)
    // ==========================================
    function launchFeedAnimals(container, onExit) {
        const pairs = [
            { animal: 'rabbit', animalName: 'خرگوش مهربون', food: 'هویج', foodKey: 'carrot', color: '#FF8FB0' },
            { animal: 'dog', animalName: 'هاپو باوفا', food: 'استخوان', foodKey: 'bone', color: '#F5CD79' },
            { animal: 'cat', animalName: 'پیشی ملوس', food: 'ماهی', foodKey: 'fish', color: '#F8A5C2' },
            { animal: 'bear', animalName: 'خرس قهوه‌ای', food: 'عسل', foodKey: 'honey', color: '#D2996E' },
            { animal: 'monkey', animalName: 'میمون زرنگ', food: 'موز', foodKey: 'banana', color: '#FFCE9E' }
        ];

        let currentIdx = 0;
        let score = 0;

        function renderRound() {
            const current = pairs[currentIdx % pairs.length];
            const foodOptions = [
                { name: 'هویج', key: 'carrot', icon: '🥕' },
                { name: 'استخوان', key: 'bone', icon: '🦴' },
                { name: 'ماهی', key: 'fish', icon: '🐟' },
                { name: 'عسل', key: 'honey', icon: '🍯' },
                { name: 'موز', key: 'banana', icon: '🍌' }
            ];

            container.innerHTML = `
                <div class="arcade-card">
                    <div class="arcade-hud">
                        <button class="action-pill-btn" id="feed-exit-btn"><span>خروج ✕</span></button>
                        <div class="arcade-score-badge">حیوانات شاد: <span id="feed-score">${toFa(score)}</span></div>
                    </div>
                    <div class="feed-prompt-title">چه غذایی به «${current.animalName}» بدهیم؟</div>
                    <div class="feed-animal-stage" id="animal-stage">
                        ${SvgArt.animal(current.animal, 140)}
                    </div>
                    <div class="feed-foods-row" id="foods-row"></div>
                </div>
            `;

            container.querySelector('#feed-exit-btn').onclick = () => {
                AudioEngine.play('click');
                if (onExit) onExit();
            };

            const foodsRow = container.querySelector('#foods-row');
            foodOptions.forEach(f => {
                const btn = document.createElement('button');
                btn.className = 'food-choice-btn';
                btn.innerHTML = `<span class="food-emoji">${f.icon}</span><span class="food-name">${f.name}</span>`;

                btn.onclick = () => {
                    if (f.name === current.food) {
                        // Correct Food!
                        AudioEngine.play('chew');
                        AudioEngine.play('correct');
                        score++;
                        container.querySelector('#feed-score').textContent = toFa(score);
                        btn.classList.add('correct');
                        if (window.Fx) Fx.stars(container.querySelector('#animal-stage'), 5);

                        setTimeout(() => {
                            currentIdx++;
                            renderRound();
                        }, 900);
                    } else {
                        // Wrong Food
                        AudioEngine.play('wrong');
                        btn.classList.add('wrong');
                        if (window.Fx) Fx.shake(btn);
                        setTimeout(() => btn.classList.remove('wrong'), 600);
                    }
                };

                foodsRow.appendChild(btn);
            });

            setTimeout(() => {
                AudioEngine.speak(`به ${current.animalName} چی غذا بدیم؟`);
            }, 200);
        }

        renderRound();
    }

    // ==========================================
    // 3. MUSICAL GLOCKENSPIEL & PIANO (بلز و پیانوی شاد)
    // ==========================================
    function launchMusicBells(container, onExit) {
        const notes = [
            { name: 'دو (C)', freq: 261.63, color: '#FF4757' },
            { name: 'ر (D)', freq: 293.66, color: '#FFA502' },
            { name: 'می (E)', freq: 329.63, color: '#F1C40F' },
            { name: 'فا (F)', freq: 349.23, color: '#2ED573' },
            { name: 'سل (G)', freq: 392.00, color: '#00D2D3' },
            { name: 'لا (A)', freq: 440.00, color: '#1E90FF' },
            { name: 'سی (B)', freq: 493.88, color: '#9B59B6' },
            { name: 'دو بالا', freq: 523.25, color: '#FF6B81' }
        ];

        container.innerHTML = `
            <div class="arcade-card">
                <div class="arcade-hud">
                    <button class="action-pill-btn" id="music-exit-btn"><span>خروج ✕</span></button>
                    <div class="arcade-score-badge">ساز بلز رنگین‌کمان 🎵</div>
                </div>
                <div class="feed-prompt-title">نت‌های رنگین‌کمان را بنواز و آهنگ بساز!</div>
                <div class="xylophone-stage" id="xylophone-stage"></div>
            </div>
        `;

        container.querySelector('#music-exit-btn').onclick = () => {
            AudioEngine.play('click');
            if (onExit) onExit();
        };

        const stage = container.querySelector('#xylophone-stage');

        notes.forEach((n, idx) => {
            const bar = document.createElement('button');
            bar.className = 'xylo-bar';
            bar.style.backgroundColor = n.color;
            bar.style.height = `${170 - idx * 12}px`;
            bar.innerHTML = `<span class="xylo-note-label">${n.name}</span>`;

            bar.onclick = () => {
                AudioEngine.play('bell', n.freq);
                if (window.Fx) Fx.pop(bar);
            };

            stage.appendChild(bar);
        });

        setTimeout(() => {
            AudioEngine.speak('کلیدهای رنگین‌کمان را لمس کن تا آهنگ شاد بنوازی!');
        }, 150);
    }

    // ==========================================
    // 4. MATH STAR TRAIN (قطار بارگیری اعداد)
    // ==========================================
    function launchCargoTrain(container, onExit) {
        let round = 1;
        let score = 0;

        function nextTrain() {
            const targetCount = Math.floor(Math.random() * 5) + 2;
            let loadedCount = 0;

            container.innerHTML = `
                <div class="arcade-card">
                    <div class="arcade-hud">
                        <button class="action-pill-btn" id="train-exit-btn"><span>خروج ✕</span></button>
                        <div class="arcade-score-badge">واگن‌های پر شده: <span id="train-score">${toFa(score)}</span></div>
                    </div>
                    <div class="feed-prompt-title">دقیقاً <b>${toFa(targetCount)} جعبه</b> داخل واگن قطار بگذار:</div>
                    <div class="train-wagon-stage">
                        <div class="train-locomotive">🚂</div>
                        <div class="train-wagon" id="wagon-box">
                            <span class="wagon-target-badge">${toFa(targetCount)}</span>
                            <div class="wagon-slots" id="wagon-slots"></div>
                        </div>
                    </div>
                    <div class="cargo-pool-row" id="cargo-pool"></div>
                </div>
            `;

            container.querySelector('#train-exit-btn').onclick = () => {
                AudioEngine.play('click');
                if (onExit) onExit();
            };

            const pool = container.querySelector('#cargo-pool');
            const slots = container.querySelector('#wagon-slots');

            for (let i = 0; i < targetCount + 3; i++) {
                const box = document.createElement('button');
                box.className = 'cargo-box-btn';
                box.innerHTML = '🎁';
                box.onclick = () => {
                    if (loadedCount < targetCount) {
                        loadedCount++;
                        AudioEngine.play('drop');
                        box.style.display = 'none';

                        const inWagon = document.createElement('span');
                        inWagon.className = 'in-wagon-item';
                        inWagon.textContent = '🎁';
                        slots.appendChild(inWagon);

                        if (loadedCount === targetCount) {
                            AudioEngine.play('win');
                            score++;
                            container.querySelector('#train-score').textContent = toFa(score);
                            if (window.Fx) Fx.confetti();
                            setTimeout(nextTrain, 1200);
                        }
                    }
                };
                pool.appendChild(box);
            }

            setTimeout(() => {
                AudioEngine.speak(`${targetCount} تا جعبه داخل واگن قطار بذار!`);
            }, 150);
        }

        nextTrain();
    }

    // ==========================================
    // 5. LUCKY SPIN WHEEL (چرخونه شانس و جوایز)
    // ==========================================
    function launchLuckyWheel(container, onExit) {
        const prizes = [
            { text: '۳ ستاره ⭐⭐⭐', stars: 3, color: '#FF4757' },
            { text: '۵ ستاره ⭐⭐⭐⭐⭐', stars: 5, color: '#FFA502' },
            { text: '۲ ستاره ⭐⭐', stars: 2, color: '#2ED573' },
            { text: '۱۰ ستاره طلایی 👑', stars: 10, color: '#6C5CE7' },
            { text: '۴ ستاره ⭐⭐⭐⭐', stars: 4, color: '#00D2D3' },
            { text: '۶ ستاره 🌟', stars: 6, color: '#F368E0' }
        ];

        container.innerHTML = `
            <div class="arcade-card">
                <div class="arcade-hud">
                    <button class="action-pill-btn" id="wheel-exit-btn"><span>خروج ✕</span></button>
                    <div class="arcade-score-badge">چرخونه شانس روزانه 🎡</div>
                </div>
                <div class="feed-prompt-title">دکمه چرخش رو بزن و ستاره‌های جایزه بگیر!</div>
                <div class="wheel-stage-wrap">
                    <div class="wheel-pointer">▼</div>
                    <div class="wheel-disc" id="wheel-disc">
                        <div class="wheel-center-knob">⭐</div>
                    </div>
                </div>
                <button class="big-action-btn primary" id="spin-btn" style="margin-top:16px;">
                    <span>🎡 بچرخان!</span>
                </button>
            </div>
        `;

        container.querySelector('#wheel-exit-btn').onclick = () => {
            AudioEngine.play('click');
            if (onExit) onExit();
        };

        const disc = container.querySelector('#wheel-disc');
        const spinBtn = container.querySelector('#spin-btn');
        let spinning = false;

        spinBtn.onclick = () => {
            if (spinning) return;
            spinning = true;
            AudioEngine.play('spin');
            const prizeIdx = Math.floor(Math.random() * prizes.length);
            const prize = prizes[prizeIdx];
            const extraRounds = 5 + Math.floor(Math.random() * 3);
            const deg = extraRounds * 360 + (prizeIdx * 60);

            disc.style.transition = 'transform 3.5s cubic-bezier(0.2, 0.9, 0.3, 1)';
            disc.style.transform = `rotate(${deg}deg)`;

            setTimeout(() => {
                spinning = false;
                AudioEngine.play('win');
                if (window.Fx) {
                    Fx.confetti();
                }

                // Add stars to total
                if (window.Storage) {
                    Storage.load('progress').then(p => {
                        const prog = p || { totalStars: 0, lessonsDone: {} };
                        prog.totalStars = (prog.totalStars || 0) + prize.stars;
                        Storage.save('progress', prog);
                    });
                }

                alert(`🎉 تبریک! شما ${prize.text} برنده شدید!`);
            }, 3600);
        };
    }

    function openGame(gameId, container, onExit) {
        switch (gameId) {
            case 'balloon-catcher': launchBalloonCatcher(container, onExit); break;
            case 'feed-animals': launchFeedAnimals(container, onExit); break;
            case 'music-bells': launchMusicBells(container, onExit); break;
            case 'cargo-train': launchCargoTrain(container, onExit); break;
            case 'lucky-wheel': launchLuckyWheel(container, onExit); break;
            default: launchBalloonCatcher(container, onExit); break;
        }
    }

    return { list, openGame };
})();
