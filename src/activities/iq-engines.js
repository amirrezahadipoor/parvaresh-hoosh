// Advanced Early Childhood Cognitive IQ Engines for "پرورش هوش کودک"
// Built for Ages 4.5 to 8: Non-reader friendly, Voice-first, Visual Scaffolding, Tactile Physics - ZERO EMOJIS
window.IQEngines = (function() {

    function toFa(n) {
        const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(n).replace(/[0-9]/g, w => map[+w]);
    }

    // ==========================================
    // 1. RAVEN'S PROGRESSIVE 2x2 MATRIX FOR KIDS
    // ==========================================
    const RavenMatrixActivity = {
        render(container, round, cb) {
            container.innerHTML = '';
            const card = document.createElement('div');
            card.className = 'iq-card raven-card';

            card.innerHTML = `
                <div class="activity-header-row">
                    <h2 class="quiz-prompt">کدام تکه جای خالی را کامل می‌کند؟</h2>
                    <button class="speaker-btn" id="raven-speak"><span>بشنو</span></button>
                </div>
                <div class="raven-grid-2x2">
                    <div class="raven-cell">${round.grid[0]}</div>
                    <div class="raven-cell">${round.grid[1]}</div>
                    <div class="raven-cell">${round.grid[2]}</div>
                    <div class="raven-cell missing-cell" id="raven-target">
                        <span class="missing-qmark">؟</span>
                    </div>
                </div>
                <div class="raven-options-row" id="raven-opts"></div>
            `;

            const speakBtn = card.querySelector('#raven-speak');
            speakBtn.onclick = () => {
                AudioEngine.play('click');
                if (round.audioClip && AudioEngine.playClip && AudioEngine.playClip(round.audioClip)) return;
                AudioEngine.speak(round.speech || 'شکل کامل‌کننده الگو را پیدا کن');
            };

            const optsRow = card.querySelector('#raven-opts');
            let answered = false;

            (round.options || []).forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'raven-opt-btn';
                btn.innerHTML = opt.img;
                // Without this the guiding hand falls back to the FIRST option and
                // can point the child at a wrong answer. Not exposed to a11y/visuals.
                if (idx === round.answer) btn.dataset.correct = 'true';

                btn.onclick = () => {
                    if (answered) return;
                    AudioEngine.play('click');

                    if (idx === round.answer) {
                        answered = true;
                        btn.classList.add('correct');
                        card.querySelector('#raven-target').innerHTML = opt.img;
                        AudioEngine.play('correct');
                        if (window.Fx) Fx.stars(card, 5);
                        setTimeout(() => {
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 900);
                    } else {
                        btn.classList.add('wrong');
                        AudioEngine.play('wrong');
                        if (window.Fx) Fx.shake(btn);
                        setTimeout(() => btn.classList.remove('wrong'), 600);
                    }
                };

                optsRow.appendChild(btn);
            });

            container.appendChild(card);
        }
    };

    // ==========================================
    // 2. SHADOW & SILHOUETTE MATCHING (سایه‌شناسی و تجسم فضایی)
    // ==========================================
    const ShadowMatchActivity = {
        render(container, round, cb) {
            container.innerHTML = '';
            const card = document.createElement('div');
            card.className = 'iq-card shadow-card';

            card.innerHTML = `
                <div class="activity-header-row">
                    <h2 class="quiz-prompt">سایه دقیق این تصویر کدام است؟</h2>
                    <button class="speaker-btn" id="shadow-speak"><span>بشنو</span></button>
                </div>
                <div class="shadow-target-wrap">
                    <div class="shadow-original">${round.originalImg}</div>
                </div>
                <div class="shadow-options-grid" id="shadow-opts"></div>
            `;

            const speakBtn = card.querySelector('#shadow-speak');
            speakBtn.onclick = () => {
                AudioEngine.play('click');
                if (round.audioClip && AudioEngine.playClip && AudioEngine.playClip(round.audioClip)) return;
                AudioEngine.speak(round.speech || 'سایه دقیق این تصویر را پیدا کن!');
            };

            const optsGrid = card.querySelector('#shadow-opts');
            let answered = false;

            (round.shadowOptions || []).forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'shadow-opt-btn';
                btn.innerHTML = `<div class="shadow-silhouette" style="filter: brightness(0) opacity(0.85);">${opt.img}</div>`;
                if (idx === round.answer) btn.dataset.correct = 'true';

                btn.onclick = () => {
                    if (answered) return;
                    AudioEngine.play('click');

                    if (idx === round.answer) {
                        answered = true;
                        btn.classList.add('correct');
                        AudioEngine.play('correct');
                        if (window.Fx) Fx.stars(card, 5);
                        setTimeout(() => {
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 900);
                    } else {
                        btn.classList.add('wrong');
                        AudioEngine.play('wrong');
                        if (window.Fx) Fx.shake(btn);
                        setTimeout(() => btn.classList.remove('wrong'), 600);
                    }
                };

                optsGrid.appendChild(btn);
            });

            container.appendChild(card);
        }
    };

    // ==========================================
    // 3. SIMON SOUND & LIGHT MEMORY SEQUENCE (توالی حافظه سایمون)
    // ==========================================
    const SimonSequenceActivity = {
        render(container, round, cb) {
            container.innerHTML = '';
            const card = document.createElement('div');
            card.className = 'iq-card simon-card';

            const sequenceLength = round.length || 3;
            card.innerHTML = `
                <div class="activity-header-row">
                    <h2 class="quiz-prompt" id="simon-status">خوب نگاه کن و صدای زنگ‌ها را به خاطر بسپار!</h2>
                    <button class="speaker-btn" id="simon-speak"><span>بشنو</span></button>
                </div>
                <div class="simon-bells-grid" id="simon-bells">
                    <button class="simon-bell red" data-idx="0"><svg width="34" height="34" viewBox="0 0 24 24" fill="#FFF"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                    <button class="simon-bell yellow" data-idx="1"><svg width="34" height="34" viewBox="0 0 24 24" fill="#FFF"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                    <button class="simon-bell green" data-idx="2"><svg width="34" height="34" viewBox="0 0 24 24" fill="#FFF"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                    <button class="simon-bell blue" data-idx="3"><svg width="34" height="34" viewBox="0 0 24 24" fill="#FFF"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                </div>
                <div class="simon-step-indicator" id="simon-steps">مرحله: ${toFa(sequenceLength)} تایی</div>
            `;

            const bellFrequencies = [261.63, 329.63, 392.00, 523.25];
            const bells = card.querySelectorAll('.simon-bell');
            const statusEl = card.querySelector('#simon-status');

            const sequence = [];
            for (let i = 0; i < sequenceLength; i++) {
                sequence.push(Math.floor(Math.random() * 4));
            }

            let userIndex = 0;
            let acceptingInput = false;

            function flashBell(bellIdx, durationMs, callback) {
                const b = bells[bellIdx];
                if (!b) return;
                b.classList.add('lit');
                AudioEngine.play('bell', bellFrequencies[bellIdx]);
                setTimeout(() => {
                    b.classList.remove('lit');
                    if (callback) callback();
                }, durationMs || 400);
            }

            function playSequence() {
                acceptingInput = false;
                statusEl.textContent = 'دانا داره زنگ‌ها رو می‌زنه؛ خوب دقت کن!';
                let i = 0;

                function nextNote() {
                    if (i < sequence.length) {
                        flashBell(sequence[i], 450, () => {
                            i++;
                            setTimeout(nextNote, 250);
                        });
                    } else {
                        acceptingInput = true;
                        userIndex = 0;
                        statusEl.textContent = 'حالا نوبت توئه! زنگ‌ها رو به همان ترتیب بزن:';
                        AudioEngine.speak('حالا زنگ‌ها را به همان ترتیب لمس کن!');
                    }
                }

                setTimeout(nextNote, 600);
            }

            bells.forEach(b => {
                b.onclick = () => {
                    if (!acceptingInput) return;
                    const clickedIdx = parseInt(b.dataset.idx, 10);
                    flashBell(clickedIdx, 250);

                    if (clickedIdx === sequence[userIndex]) {
                        userIndex++;
                        if (userIndex >= sequence.length) {
                            acceptingInput = false;
                            statusEl.textContent = 'آفرین حافظه فوق‌العاده‌ای داری!';
                            AudioEngine.play('win');
                            if (window.Fx) Fx.confetti();
                            setTimeout(() => {
                                if (cb && cb.onCorrect) cb.onCorrect(round);
                            }, 1000);
                        }
                    } else {
                        acceptingInput = false;
                        statusEl.textContent = 'اشکالی نداره قشنگم، یک بار دیگه با هم ببینیم!';
                        AudioEngine.play('wrong');
                        if (window.Fx) Fx.shake(card.querySelector('#simon-bells'));
                        setTimeout(playSequence, 1200);
                    }
                };
            });

            setTimeout(playSequence, 400);
            container.appendChild(card);
        }
    };

    // ==========================================
    // 4. DISAPPEARED ITEM MEMORY (کشف شیء ناپدیدشده در سینی جادویی)
    // ==========================================
    const DisappearedItemActivity = {
        render(container, round, cb) {
            container.innerHTML = '';
            const card = document.createElement('div');
            card.className = 'iq-card disappeared-card';

            const itemsPool = [
                { id: 'apple', label: 'سیب', img: SvgArt.object('apple', 65) },
                { id: 'car', label: 'ماشین', img: SvgArt.object('car', 65) },
                { id: 'ball', label: 'توپ', img: SvgArt.object('ball', 65) },
                { id: 'cat', label: 'گربه', img: SvgArt.animal('cat', 65) },
                { id: 'star', label: 'ستاره', img: SvgArt.object('star', 65) }
            ];

            const initialItems = itemsPool.slice(0, 4);
            const missingItem = initialItems[Math.floor(Math.random() * initialItems.length)];
            const remainingItems = initialItems.filter(x => x.id !== missingItem.id);

            card.innerHTML = `
                <div class="activity-header-row">
                    <h2 class="quiz-prompt" id="disp-prompt">چیزهایی که روی سینی هستند را به خاطر بسپار!</h2>
                    <button class="speaker-btn" id="disp-speak"><span>بشنو</span></button>
                </div>
                <div class="tray-stage" id="tray-stage">
                    <div class="tray-items-grid" id="tray-grid">
                        ${initialItems.map(item => `<div class="tray-item">${item.img}<span class="tray-label">${item.label}</span></div>`).join('')}
                    </div>
                    <div class="magic-curtain" id="magic-curtain" style="display:none;">
                        <span class="magic-hat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#F1C40F"><path d="M2 17h20v2H2zM4 15l2-9h12l2 9z"></path></svg>
                        </span>
                        <p>اجی مجی لا ترجی!</p>
                    </div>
                </div>
                <div class="disappeared-options-pool" id="disp-opts" style="display:none;"></div>
            `;

            setTimeout(() => {
                const curtain = card.querySelector('#magic-curtain');
                const grid = card.querySelector('#tray-grid');
                curtain.style.display = 'flex';
                AudioEngine.play('bubble');

                setTimeout(() => {
                    curtain.style.display = 'none';
                    grid.innerHTML = remainingItems.map(item => `<div class="tray-item">${item.img}<span class="tray-label">${item.label}</span></div>`).join('') +
                        `<div class="tray-item missing-slot"><span>؟</span></div>`;

                    card.querySelector('#disp-prompt').textContent = 'کدام وسیله غیب شد و دیگر در سینی نیست؟';
                    AudioEngine.speak('کدام وسیله ناپدید شد؟');

                    const optsDiv = card.querySelector('#disp-opts');
                    optsDiv.style.display = 'flex';
                    let answered = false;

                    initialItems.forEach(opt => {
                        const btn = document.createElement('button');
                        btn.className = 'disp-opt-btn';
                        btn.innerHTML = `${opt.img}<span>${opt.label}</span>`;
                        if (opt.id === missingItem.id) btn.dataset.correct = 'true';

                        btn.onclick = () => {
                            if (answered) return;
                            if (opt.id === missingItem.id) {
                                answered = true;
                                AudioEngine.play('correct');
                                btn.classList.add('correct');
                                if (window.Fx) Fx.stars(card, 5);
                                setTimeout(() => {
                                    if (cb && cb.onCorrect) cb.onCorrect(round);
                                }, 900);
                            } else {
                                AudioEngine.play('wrong');
                                btn.classList.add('wrong');
                                if (window.Fx) Fx.shake(btn);
                                setTimeout(() => btn.classList.remove('wrong'), 600);
                            }
                        };
                        optsDiv.appendChild(btn);
                    });
                }, 1600);
            }, 3500);

            container.appendChild(card);
        }
    };

    // ==========================================
    // 5. INTERACTIVE BALANCE SCALE (ترازوی مقایسه وزن و تعادل)
    // ==========================================
    const BalanceScaleActivity = {
        render(container, round, cb) {
            container.innerHTML = '';
            const card = document.createElement('div');
            card.className = 'iq-card balance-card';

            const leftCount = round.leftCount || 3;
            const rightCount = round.rightCount || 1;
            const heavier = leftCount > rightCount ? 'left' : leftCount < rightCount ? 'right' : 'equal';
            const leftTiltDeg = leftCount > rightCount ? 14 : leftCount < rightCount ? -14 : 0;

            // The apples the child must COMPARE were locked at 28px whatever the
            // count, so a level-8 round with 7 per pan rendered them at ~33px --
            // too small to count at a glance, and the harder the level the worse
            // it got. Size them to the pan instead: few apples => big apples.
            const most = Math.max(leftCount, rightCount);
            const appleSize = most <= 2 ? 62 : most <= 3 ? 54 : most <= 4 ? 48 : most <= 6 ? 42 : 38;
            let leftApples = '';
            for (let i = 0; i < leftCount; i++) leftApples += SvgArt.object('apple', appleSize);
            let rightApples = '';
            for (let i = 0; i < rightCount; i++) rightApples += SvgArt.object('apple', appleSize);

            card.innerHTML = `
                <div class="activity-header-row">
                    <h2 class="quiz-prompt">کدام کفه ترازو سنگین‌تر است و پایین رفته؟</h2>
                    <button class="speaker-btn" id="balance-speak"><span>بشنو</span></button>
                </div>
                <div class="scale-visual-wrap">
                    <div class="scale-beam" style="transform: rotate(${leftTiltDeg}deg);">
                        <div class="scale-pan left-pan">
                            <div class="pan-items">${leftApples}</div>
                        </div>
                        <div class="scale-fulcrum">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="#F39C12"><polygon points="12 2 2 22 22 22"></polygon></svg>
                        </div>
                        <div class="scale-pan right-pan">
                            <div class="pan-items">${rightApples}</div>
                        </div>
                    </div>
                </div>
                <div class="balance-choices-row" id="balance-choices">
                    <button class="balance-choice-btn" data-choice="left">کفه چپ (سنگین‌تر)</button>
                    <button class="balance-choice-btn" data-choice="right">کفه راست (سنگین‌تر)</button>
                </div>
            `;

            let answered = false;
            card.querySelectorAll('.balance-choice-btn').forEach(btn => {
                if (btn.dataset.choice === heavier) btn.dataset.correct = 'true';
                btn.onclick = () => {
                    if (answered) return;
                    const choice = btn.dataset.choice;

                    if (choice === heavier) {
                        answered = true;
                        btn.classList.add('correct');
                        AudioEngine.play('correct');
                        if (window.Fx) Fx.stars(card, 5);
                        setTimeout(() => {
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 900);
                    } else {
                        btn.classList.add('wrong');
                        AudioEngine.play('wrong');
                        if (window.Fx) Fx.shake(btn);
                        setTimeout(() => btn.classList.remove('wrong'), 600);
                    }
                };
            });

            container.appendChild(card);
        }
    };

    return {
        RavenMatrixActivity,
        ShadowMatchActivity,
        SimonSequenceActivity,
        DisappearedItemActivity,
        BalanceScaleActivity
    };
})();
