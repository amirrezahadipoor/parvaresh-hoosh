// Endless Replayable Arcade Educational Games for "پرورش هوش کودک"
// Zero Emojis, Zero Gambling/Spin Wheels, 100% Pedagogical & Child-Friendly
window.ArcadeGames = (function() {

    const GAMES = [
        {
            id: 'balloon-catcher',
            title: 'شکار بادکنک‌های جادویی',
            subtitle: 'ترکاندن بی‌پایان با امتیاز و زنجیره ستاره‌ها',
            iconHtml: SvgArt.object('balloon', 38),
            color: '#FF6B6B',
            bg: '#FFEAEA'
        },
        {
            id: 'feed-animals',
            title: 'غذا دادن به حیوانات شکمو',
            subtitle: 'انتخاب خوراکی خوشمزه برای حیوانات بامزه',
            iconHtml: SvgArt.animal('rabbit', 38),
            color: '#FFA502',
            bg: '#FFF4E5'
        },
        {
            id: 'music-bells',
            title: 'بلز و پیانوی جادویی',
            subtitle: 'نواختن آهنگ‌های شاد کودکانه با نت‌های رنگین‌کمان',
            iconHtml: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
            color: '#00D2D3',
            bg: '#E0F9F9'
        },
        {
            id: 'cargo-train',
            title: 'قطار بارگیری اعداد و ستاره‌ها',
            subtitle: 'پر کردن واگن‌های قطار با شمارش دقیق',
            iconHtml: SvgArt.object('car', 38),
            color: '#6C5CE7',
            bg: '#EFEAFC'
        },
        {
            id: 'speed-memory',
            title: 'مسابقه سرعت کارت‌های حافظه',
            subtitle: 'رکوردزنی جفت‌یابی کارت‌های سه‌بعدی',
            iconHtml: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
            color: '#2ED573',
            bg: '#E7F9F0'
        }
    ];

    function list() {
        return GAMES;
    }

    function toFa(n) {
        const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(n).replace(/[0-9]/g, w => map[+w]);
    }

    // 1. BALLOON CATCHER ARCADE
    function launchBalloonCatcher(container, onExit) {
        container.innerHTML = `
            <div class="arcade-card">
                <div class="arcade-hud">
                    <button class="action-pill-btn" id="arcade-exit-btn"><span>بازگشت</span></button>
                    <div class="arcade-score-badge">امتیاز: <span id="balloon-score">۰</span></div>
                    <div class="arcade-combo-badge" id="balloon-combo">زنجیره: ۱x</div>
                </div>
                <div class="balloon-arcade-stage" id="balloon-stage"></div>
            </div>
        `;

        let score = 0;
        let combo = 1;
        let active = true;
        let activeBalloons = [];
        let spawnInterval = null;
        const animations = new Set();

        const stage = container.querySelector('#balloon-stage');
        const scoreEl = container.querySelector('#balloon-score');
        const comboEl = container.querySelector('#balloon-combo');
        const exitBtn = container.querySelector('#arcade-exit-btn');

        exitBtn.onclick = () => {
            active = false;
            clearInterval(spawnInterval);
            animations.forEach(animation => {
                try { animation.cancel(); } catch (e) {}
            });
            animations.clear();
            activeBalloons.forEach(balloon => balloon.remove());
            activeBalloons = [];
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
            { text: 'ستاره', sound: 'ستاره طلایی', color: '#F9CA24' }
        ];

        function spawnBalloon() {
            if (!active || activeBalloons.length >= 7) return;
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
                if (!active || b.classList.contains('popped')) return;
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

            const dur = 4500 + Math.random() * 2000;
            const anim = b.animate([
                { transform: 'translateY(360px)', opacity: 1 },
                { transform: 'translateY(-120px)', opacity: 0.9 }
            ], { duration: dur, easing: 'linear' });
            animations.add(anim);

            anim.onfinish = () => {
                animations.delete(anim);
                if (!active) return;
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

    // 2. FEED THE HUNGRY ANIMALS
    function launchFeedAnimals(container, onExit) {
        const pairs = [
            { animal: 'rabbit', animalName: 'خرگوش مهربون', food: 'سیب', foodSvg: SvgArt.object('apple', 50) },
            { animal: 'dog', animalName: 'هاپو باوفا', food: 'استخوان', foodSvg: SvgArt.object('tooth', 50) },
            { animal: 'cat', animalName: 'پیشی ملوس', food: 'ماهی', foodSvg: SvgArt.animal('fish', 50) },
            { animal: 'monkey', animalName: 'میمون زرنگ', food: 'موز', foodSvg: SvgArt.object('banana', 50) }
        ];

        let currentIdx = 0;
        let score = 0;
        let active = true;
        let nextTimer = null;

        function renderRound() {
            if (!active) return;
            const current = pairs[currentIdx % pairs.length];
            const foodOptions = [
                { name: 'سیب', svg: SvgArt.object('apple', 44) },
                { name: 'استخوان', svg: SvgArt.object('tooth', 44) },
                { name: 'ماهی', svg: SvgArt.animal('fish', 44) },
                { name: 'موز', svg: SvgArt.object('banana', 44) }
            ];

            container.innerHTML = `
                <div class="arcade-card">
                    <div class="arcade-hud">
                        <button class="action-pill-btn" id="feed-exit-btn"><span>بازگشت</span></button>
                        <div class="arcade-score-badge">حیوانات خوشحال: <span id="feed-score">${toFa(score)}</span></div>
                    </div>
                    <div class="feed-prompt-title">چه غذایی برای «${current.animalName}» ببریم؟</div>
                    <div class="feed-animal-stage" id="animal-stage">
                        ${SvgArt.animal(current.animal, 130)}
                    </div>
                    <div class="feed-foods-row" id="foods-row"></div>
                </div>
            `;

            container.querySelector('#feed-exit-btn').onclick = () => {
                active = false;
                if (nextTimer) clearTimeout(nextTimer);
                AudioEngine.play('click');
                if (onExit) onExit();
            };

            const foodsRow = container.querySelector('#foods-row');
            foodOptions.forEach(f => {
                const btn = document.createElement('button');
                btn.className = 'food-choice-btn';
                btn.innerHTML = `${f.svg}<span class="food-name">${f.name}</span>`;

                btn.onclick = () => {
                    if (!active) return;
                    if (f.name === current.food) {
                        AudioEngine.play('chew');
                        AudioEngine.play('correct');
                        score++;
                        container.querySelector('#feed-score').textContent = toFa(score);
                        btn.classList.add('correct');
                        if (window.Fx) Fx.stars(container.querySelector('#animal-stage'), 5);

                        nextTimer = setTimeout(() => {
                            nextTimer = null;
                            if (!active) return;
                            currentIdx++;
                            renderRound();
                        }, 900);
                    } else {
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

    // 3. MUSICAL GLOCKENSPIEL & PIANO
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
                    <button class="action-pill-btn" id="music-exit-btn"><span>بازگشت</span></button>
                    <div class="arcade-score-badge">ساز بلز رنگین‌کمان</div>
                </div>
                <div class="feed-prompt-title">کلیدهای رنگین‌کمان را لمس کن تا آهنگ شاد بسازی!</div>
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

    // 4. MATH CARGO TRAIN
    function launchCargoTrain(container, onExit) {
        let score = 0;
        let active = true;
        let nextTimer = null;

        function nextTrain() {
            if (!active) return;
            const targetCount = Math.floor(Math.random() * 5) + 2;
            let loadedCount = 0;

            container.innerHTML = `
                <div class="arcade-card">
                    <div class="arcade-hud">
                        <button class="action-pill-btn" id="train-exit-btn"><span>بازگشت</span></button>
                        <div class="arcade-score-badge">واگن‌های پر شده: <span id="train-score">${toFa(score)}</span></div>
                    </div>
                    <div class="feed-prompt-title">دقیقاً <b>${toFa(targetCount)} هدیه</b> داخل واگن قطار بگذار:</div>
                    <div class="train-wagon-stage">
                        <div class="train-locomotive">${SvgArt.object('car', 60)}</div>
                        <div class="train-wagon" id="wagon-box">
                            <span class="wagon-target-badge">${toFa(targetCount)}</span>
                            <div class="wagon-slots" id="wagon-slots"></div>
                        </div>
                    </div>
                    <div class="cargo-pool-row" id="cargo-pool"></div>
                </div>
            `;

            container.querySelector('#train-exit-btn').onclick = () => {
                active = false;
                if (nextTimer) clearTimeout(nextTimer);
                AudioEngine.play('click');
                if (onExit) onExit();
            };

            const pool = container.querySelector('#cargo-pool');
            const slots = container.querySelector('#wagon-slots');

            for (let i = 0; i < targetCount + 3; i++) {
                const box = document.createElement('button');
                box.className = 'cargo-box-btn';
                box.innerHTML = SvgArt.object('gift', 40);
                box.onclick = () => {
                    if (!active) return;
                    if (loadedCount < targetCount) {
                        loadedCount++;
                        AudioEngine.play('drop');
                        box.style.display = 'none';

                        const inWagon = document.createElement('span');
                        inWagon.className = 'in-wagon-item';
                        inWagon.innerHTML = SvgArt.object('gift', 32);
                        slots.appendChild(inWagon);

                        if (loadedCount === targetCount) {
                            AudioEngine.play('win');
                            score++;
                            container.querySelector('#train-score').textContent = toFa(score);
                            if (window.Fx) Fx.confetti();
                            nextTimer = setTimeout(() => {
                                nextTimer = null;
                                nextTrain();
                            }, 1200);
                        }
                    }
                };
                pool.appendChild(box);
            }

            setTimeout(() => {
                AudioEngine.speak(`${targetCount} تا هدیه داخل واگن قطار بذار!`);
            }, 150);
        }

        nextTrain();
    }

    // 5. SPEED MEMORY CHALLENGE
    function launchSpeedMemory(container, onExit) {
        let score = 0;
        let active = true;
        let nextTimer = null;
        function nextRound() {
            if (!active) return;
            container.innerHTML = `
                <div class="arcade-card">
                    <div class="arcade-hud">
                        <button class="action-pill-btn" id="mem-exit-btn"><span>بازگشت</span></button>
                        <div class="arcade-score-badge">رکورد حافظه: <span id="mem-score">${toFa(score)}</span></div>
                    </div>
                    <div class="feed-prompt-title">جفت‌های مثل هم را با سرعت پیدا کن!</div>
                    <div id="speed-mem-stage" style="flex:1;"></div>
                </div>
            `;

            container.querySelector('#mem-exit-btn').onclick = () => {
                active = false;
                if (nextTimer) clearTimeout(nextTimer);
                AudioEngine.play('click');
                if (onExit) onExit();
            };

            const stage = container.querySelector('#speed-mem-stage');
            const roundDef = {
                cards: [
                    { pair: 0, img: SvgArt.animal('cat', 50), label: 'گربه' },
                    { pair: 0, img: SvgArt.animal('cat', 50), label: 'گربه' },
                    { pair: 1, img: SvgArt.animal('rabbit', 50), label: 'خرگوش' },
                    { pair: 1, img: SvgArt.animal('rabbit', 50), label: 'خرگوش' },
                    { pair: 2, img: SvgArt.object('apple', 50), label: 'سیب' },
                    { pair: 2, img: SvgArt.object('apple', 50), label: 'سیب' }
                ].sort(() => Math.random() - 0.5)
            };

            MemoryActivity.render(stage, roundDef, {
                onCorrect: () => {
                    if (!active) return;
                    score += 5;
                    AudioEngine.play('win');
                    nextTimer = setTimeout(() => {
                        nextTimer = null;
                        nextRound();
                    }, 1000);
                }
            });
        }
        nextRound();
    }

    function openGame(gameId, container, onExit) {
        switch (gameId) {
            case 'balloon-catcher': launchBalloonCatcher(container, onExit); break;
            case 'feed-animals': launchFeedAnimals(container, onExit); break;
            case 'music-bells': launchMusicBells(container, onExit); break;
            case 'cargo-train': launchCargoTrain(container, onExit); break;
            case 'speed-memory': launchSpeedMemory(container, onExit); break;
            default: launchBalloonCatcher(container, onExit); break;
        }
    }

    return { list, openGame };
})();
