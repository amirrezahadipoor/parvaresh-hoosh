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
            iconHtml: SvgArt.object('train', 38),
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
        },
        {
            id: 'grand-piano',
            title: 'پیانوی بزرگ من',
            subtitle: 'نواختن آزاد و یادگیری آهنگ‌های کودکانه',
            iconHtml: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 5v9M12 5v9M16 5v9"></path></svg>`,
            color: '#111827',
            bg: '#E8EAF0'
        },
        {
            id: 'turn-taking',
            title: 'نوبت من و تو',
            subtitle: 'بازی گفت‌وگویی کودک و والد',
            iconHtml: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v10H8l-4 4z"></path><path d="M8 9h8M8 12h5"></path></svg>`,
            color: '#8B5CF6',
            bg: '#F1ECFF'
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
            if (window.GameProgress) window.GameProgress.record('balloon-catcher', score, Math.max(1, score / 10));
            AudioEngine.play('click');
            if (onExit) onExit();
        };

        const balloonItems = [
            { text: 'الف', sound: 'صدای آ', color: '#FF4757' }, { text: 'ب', sound: 'صدای ب', color: '#1E90FF' },
            { text: 'پ', sound: 'صدای پ', color: '#2ED573' }, { text: 'ت', sound: 'صدای ت', color: '#FFA502' },
            { text: 'ج', sound: 'صدای ج', color: '#9B59B6' }, { text: 'د', sound: 'صدای د', color: '#FF6B81' },
            { text: 'ر', sound: 'صدای ر', color: '#00D2D3' }, { text: 'س', sound: 'صدای س', color: '#F1C40F' },
            { text: 'ش', sound: 'صدای ش', color: '#FF763B' }, { text: 'م', sound: 'صدای م', color: '#6C5CE7' },
            { text: 'ن', sound: 'صدای ن', color: '#00B894' }, { text: 'ک', sound: 'صدای ک', color: '#E84393' },
            { text: 'گ', sound: 'صدای گ', color: '#0984E3' }, { text: 'ل', sound: 'صدای ل', color: '#D35400' },
            { text: '۱', sound: 'عدد یک', color: '#9B59B6' }, { text: '۲', sound: 'عدد دو', color: '#FF6B81' },
            { text: '۳', sound: 'عدد سه', color: '#00D2D3' }, { text: '۴', sound: 'عدد چهار', color: '#F1C40F' },
            { text: '۵', sound: 'عدد پنج', color: '#FF763B' }, { text: '۶', sound: 'عدد شش', color: '#74B9FF' },
            { text: '۷', sound: 'عدد هفت', color: '#A29BFE' }, { text: '۸', sound: 'عدد هشت', color: '#55EFC4' },
            { text: '۹', sound: 'عدد نه', color: '#FD79A8' }, { text: '۱۰', sound: 'عدد ده', color: '#FDCB6E' },
            { text: 'دایره', sound: 'شکل دایره', color: '#E17055' }, { text: 'مربع', sound: 'شکل مربع', color: '#00CEC9' },
            { text: 'مثلث', sound: 'شکل مثلث', color: '#6C5CE7' }, { text: 'ستاره', sound: 'ستاره طلایی', color: '#F9CA24' },
            { text: 'خورشید', sound: 'خورشید', color: '#FFB142' }, { text: 'باران', sound: 'باران', color: '#3498DB' },
            { text: 'گل', sound: 'گل زیبا', color: '#E84393' }, { text: 'درخت', sound: 'درخت سبز', color: '#2ED573' },
            { text: 'گربه', sound: 'گربه', color: '#F8A5C2' }, { text: 'سگ', sound: 'سگ', color: '#A0522D' },
            { text: 'خرگوش', sound: 'خرگوش', color: '#B2BEC3' }, { text: 'فیل', sound: 'فیل', color: '#74B9FF' },
            { text: 'سیب', sound: 'سیب قرمز', color: '#E74C3C' }, { text: 'موز', sound: 'موز زرد', color: '#F1C40F' },
            { text: 'کتاب', sound: 'کتاب', color: '#6C5CE7' }, { text: 'قلب', sound: 'قلب مهربانی', color: '#FF6B6B' }
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

            // Travel the full height of the stage. The distance used to be hardcoded for a
            // 380px stage, so on taller screens balloons never rose into view.
            const stageHeight = stage.clientHeight || 380;
            const travel = stageHeight + 200;
            const dur = (4500 + Math.random() * 2000) * Math.max(1, travel / 500);
            const anim = b.animate([
                { transform: 'translateY(0px)', opacity: 1 },
                { transform: `translateY(-${travel}px)`, opacity: 0.9 }
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
            { animal: 'dog', animalName: 'هاپو باوفا', food: 'استخوان', foodSvg: SvgArt.object('bone', 50) },
            { animal: 'cat', animalName: 'پیشی ملوس', food: 'ماهی', foodSvg: SvgArt.animal('fish', 50) },
            { animal: 'monkey', animalName: 'میمون زرنگ', food: 'موز', foodSvg: SvgArt.object('banana', 50) },
            { animal: 'elephant', animalName: 'فیل آرام', food: 'هندوانه', foodSvg: SvgArt.object('watermelon', 50) },
            { animal: 'bear', animalName: 'خرس مهربان', food: 'سیب', foodSvg: SvgArt.object('apple', 50) },
            { animal: 'turtle', animalName: 'لاک‌پشت آرام', food: 'هندوانه', foodSvg: SvgArt.object('watermelon', 50) },
            { animal: 'fox', animalName: 'روباه زرنگ', food: 'پرتقال', foodSvg: SvgArt.object('orange', 50) },
            { animal: 'frog', animalName: 'قورباغه شاد', food: 'پرتقال', foodSvg: SvgArt.object('orange', 50) },
            { animal: 'cow', animalName: 'گاو دوست‌داشتنی', food: 'هندوانه', foodSvg: SvgArt.object('watermelon', 50) },
            { animal: 'sheep', animalName: 'گوسفند پشمالو', food: 'سیب', foodSvg: SvgArt.object('apple', 50) },
            { animal: 'duck', animalName: 'اردک زرد', food: 'ماهی', foodSvg: SvgArt.animal('fish', 50) }
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
                { name: 'استخوان', svg: SvgArt.object('bone', 44) },
                { name: 'ماهی', svg: SvgArt.animal('fish', 44) },
                { name: 'موز', svg: SvgArt.object('banana', 44) },
                { name: 'پرتقال', svg: SvgArt.object('orange', 44) },
                { name: 'هندوانه', svg: SvgArt.object('watermelon', 44) }
            ].sort(() => Math.random() - 0.5);

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
                if (window.GameProgress) window.GameProgress.record('feed-animals', score, currentIdx);
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
                        <div class="train-locomotive">${SvgArt.object('train', 60)}</div>
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
                if (window.GameProgress) window.GameProgress.record('cargo-train', score, score);
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
                if (window.GameProgress) window.GameProgress.record('speed-memory', score, score);
                AudioEngine.play('click');
                if (onExit) onExit();
            };

            const stage = container.querySelector('#speed-mem-stage');
            const memoryPool = [
                ['گربه', SvgArt.animal('cat', 50)], ['خرگوش', SvgArt.animal('rabbit', 50)],
                ['سیب', SvgArt.object('apple', 50)], ['موز', SvgArt.object('banana', 50)],
                ['فیل', SvgArt.animal('elephant', 50)], ['ماهی', SvgArt.animal('fish', 50)],
                ['روباه', SvgArt.animal('fox', 50)], ['درخت', SvgArt.object('tree', 50)]
            ];
            const pairCount = Math.min(6, 3 + Math.floor(score / 3));
            const chosen = memoryPool.slice().sort(() => Math.random() - 0.5).slice(0, pairCount);
            const roundDef = {
                cards: chosen.flatMap(([label,img], pair) => [
                    { pair, img, label }, { pair, img, label }
                ]).sort(() => Math.random() - 0.5)
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

    // 6. TURN-TAKING CO-PLAY FOR CHILD AND PARENT
    function launchTurnTaking(container, onExit) {
        const turns = [
            { role: 'کودک', color: '#2563EB', prompt: 'یک رنگ در اتاق پیدا کن و اسمش را بگو.', action: 'پیدا کردم' },
            { role: 'والد', color: '#8B5CF6', prompt: 'یک جملهٔ کوتاه و مشخص برای تشویق کودک بگو.', action: 'تشویق کردم' },
            { role: 'کودک', color: '#2563EB', prompt: 'یک صدای حیوان را اجرا کن تا والد حدس بزند.', action: 'اجرا کردم' },
            { role: 'والد', color: '#8B5CF6', prompt: 'از کودک بپرس امروز چه چیزی برایش جالب بود.', action: 'پرسیدم' },
            { role: 'کودک', color: '#2563EB', prompt: 'با سه شیء کوچک یک الگو بساز.', action: 'الگو ساختم' },
            { role: 'والد', color: '#8B5CF6', prompt: 'تلاش کودک را توصیف کن، نه فقط نتیجه را.', action: 'بازخورد دادم' }
        ];
        const sessionTurns = turns.slice().sort(() => Math.random() - 0.5);
        let index = 0;
        let score = 0;
        let active = true;

        function renderTurn() {
            if (!active) return;
            const turn = sessionTurns[index % sessionTurns.length];
            container.innerHTML = `
                <div class="arcade-card cooperative-card">
                    <div class="arcade-hud">
                        <button class="action-pill-btn" id="coop-exit-btn"><span>بازگشت</span></button>
                        <div class="arcade-score-badge">نوبت ${toFa(index + 1)} از ${toFa(turns.length)}</div>
                    </div>
                    <div class="cooperative-role" style="--role-color:${turn.color}">${turn.role}</div>
                    <div class="cooperative-prompt">${turn.prompt}</div>
                    <div class="cooperative-note">این بازی جواب درست یا غلط ندارد؛ هدف، گفت‌وگو و توجه دوطرفه است.</div>
                    <button class="big-action-btn primary" id="coop-next-btn">${turn.action}</button>
                </div>
            `;
            container.querySelector('#coop-exit-btn').onclick = () => {
                active = false;
                if (window.GameProgress) window.GameProgress.record('turn-taking', score, index);
                AudioEngine.play('click');
                if (onExit) onExit();
            };
            container.querySelector('#coop-next-btn').onclick = () => {
                if (!active) return;
                score += 10;
                AudioEngine.play('correct');
                index++;
                if (index >= turns.length) {
                    if (window.GameProgress) window.GameProgress.record('turn-taking', score, turns.length);
                    if (window.Fx) Fx.confetti();
                    active = false;
                    container.querySelector('.cooperative-prompt').textContent = 'آفرین! امروز با هم شش نوبت گفت‌وگوی خوب داشتید.';
                    container.querySelector('#coop-next-btn').textContent = 'بازگشت به بازی‌ها';
                    container.querySelector('#coop-next-btn').onclick = () => { if (onExit) onExit(); };
                } else {
                    renderTurn();
                }
            };
            setTimeout(() => AudioEngine.speak(`${turn.role}. ${turn.prompt}`), 150);
        }
        renderTurn();
    }


    // 7. GRAND PIANO — a real keyboard with white + black keys, free play and
    // a guided song mode that lights the next key to press.
    function launchGrandPiano(container, onExit) {
        const WHITE = [
            { n: 'دو', f: 261.63, id: 'C' }, { n: 'ر', f: 293.66, id: 'D' },
            { n: 'می', f: 329.63, id: 'E' }, { n: 'فا', f: 349.23, id: 'F' },
            { n: 'سل', f: 392.00, id: 'G' }, { n: 'لا', f: 440.00, id: 'A' },
            { n: 'سی', f: 493.88, id: 'B' }, { n: 'دو۲', f: 523.25, id: 'C2' }
        ];
        // Black keys sit between specific white keys (no black between E-F and B-C).
        const BLACK = [
            { f: 277.18, after: 0 }, { f: 311.13, after: 1 },
            { f: 369.99, after: 3 }, { f: 415.30, after: 4 }, { f: 466.16, after: 5 }
        ];
        const SONGS = [
            { title: 'ستاره کوچولو', keys: ['C','C','G','G','A','A','G','F','F','E','E','D','D','C'] },
            { title: 'زنگوله‌ها', keys: ['E','E','E','E','E','E','E','G','C','D','E'] },
            { title: 'قایق من', keys: ['C','C','C','D','E','E','D','E','F','G'] }
        ];

        let songMode = null;
        let songPos = 0;
        let score = 0;

        container.innerHTML = `
            <div class="arcade-card">
                <div class="arcade-hud">
                    <button class="action-pill-btn" id="piano-exit-btn"><span>بازگشت</span></button>
                    <div class="arcade-score-badge" id="piano-status">نواختن آزاد</div>
                    <div class="arcade-combo-badge" id="piano-score">امتیاز: ۰</div>
                </div>
                <div class="piano-song-bar" id="piano-song-bar"></div>
                <div class="piano-stage">
                    <div class="piano-keys" id="piano-keys"></div>
                </div>
            </div>
        `;

        container.querySelector('#piano-exit-btn').onclick = () => {
            AudioEngine.play('click');
            if (window.GameProgress) window.GameProgress.record('grand-piano', score, 1);
            if (onExit) onExit();
        };

        const statusEl = container.querySelector('#piano-status');
        const scoreEl = container.querySelector('#piano-score');
        const keysEl = container.querySelector('#piano-keys');
        const songBar = container.querySelector('#piano-song-bar');

        const freeBtn = document.createElement('button');
        freeBtn.className = 'action-pill-btn piano-song-btn active';
        freeBtn.textContent = 'نواختن آزاد';
        freeBtn.onclick = () => { songMode = null; songPos = 0; refreshSongButtons(); highlight(); statusEl.textContent = 'نواختن آزاد'; };
        songBar.appendChild(freeBtn);

        SONGS.forEach(song => {
            const b = document.createElement('button');
            b.className = 'action-pill-btn piano-song-btn';
            b.textContent = song.title;
            b.onclick = () => {
                AudioEngine.play('click');
                songMode = song; songPos = 0;
                refreshSongButtons(); highlight();
                statusEl.textContent = song.title;
            };
            songBar.appendChild(b);
        });

        function refreshSongButtons() {
            [...songBar.querySelectorAll('.piano-song-btn')].forEach(b => b.classList.remove('active'));
            const label = songMode ? songMode.title : 'نواختن آزاد';
            const match = [...songBar.querySelectorAll('.piano-song-btn')].find(b => b.textContent === label);
            if (match) match.classList.add('active');
        }

        function highlight() {
            keysEl.querySelectorAll('.piano-key').forEach(k => k.classList.remove('next'));
            if (!songMode) return;
            const want = songMode.keys[songPos];
            const target = keysEl.querySelector(`.piano-key[data-id="${want}"]`);
            if (target) target.classList.add('next');
        }

        function press(key, freq, id) {
            AudioEngine.play('bell', freq);
            key.classList.add('pressed');
            setTimeout(() => key.classList.remove('pressed'), 160);
            if (window.Fx) Fx.pop(key);
            if (!songMode) return;
            if (id === songMode.keys[songPos]) {
                songPos++;
                score += 10;
                scoreEl.textContent = `امتیاز: ${toFa(score)}`;
                if (songPos >= songMode.keys.length) {
                    statusEl.textContent = 'آفرین! آهنگ کامل شد';
                    AudioEngine.play('win');
                    if (window.Fx) Fx.confetti();
                    if (window.GameProgress) window.GameProgress.record('grand-piano', score, 1);
                    songPos = 0;
                }
                highlight();
            }
        }

        // White keys first (they form the row), black keys are absolutely placed.
        WHITE.forEach((w, i) => {
            const key = document.createElement('button');
            key.className = 'piano-key piano-key-white';
            key.dataset.id = w.id;
            key.style.left = `${(i / WHITE.length) * 100}%`;
            key.style.width = `${100 / WHITE.length}%`;
            key.innerHTML = `<span class="piano-key-label">${w.n}</span>`;
            key.onclick = () => press(key, w.f, w.id);
            keysEl.appendChild(key);
        });
        BLACK.forEach(bk => {
            const key = document.createElement('button');
            key.className = 'piano-key piano-key-black';
            const unit = 100 / WHITE.length;
            key.style.left = `${unit * (bk.after + 1) - unit * 0.3}%`;
            key.style.width = `${unit * 0.6}%`;
            key.onclick = ev => { ev.stopPropagation(); press(key, bk.f, null); };
            keysEl.appendChild(key);
        });

        highlight();
    }

    function openGame(gameId, container, onExit) {
        switch (gameId) {
            case 'balloon-catcher': launchBalloonCatcher(container, onExit); break;
            case 'feed-animals': launchFeedAnimals(container, onExit); break;
            case 'music-bells': launchMusicBells(container, onExit); break;
            case 'cargo-train': launchCargoTrain(container, onExit); break;
            case 'speed-memory': launchSpeedMemory(container, onExit); break;
            case 'grand-piano': launchGrandPiano(container, onExit); break;
            case 'turn-taking': launchTurnTaking(container, onExit); break;
            default: launchBalloonCatcher(container, onExit); break;
        }
    }

    return { list, openGame };
})();
