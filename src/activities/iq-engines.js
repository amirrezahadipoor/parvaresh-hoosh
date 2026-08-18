// Advanced Early Childhood Cognitive IQ Engines for "پرورش هوش کودک"
// Built for Ages 4.5 to 8: Non-reader friendly, Voice-first, Visual Scaffolding, Tactile Physics
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
                AudioEngine.speak('الگو را ببین؛ کدام شکل جای علامت سوال قرار می‌گیرد؟');
            };

            setTimeout(() => {
                AudioEngine.speak('الگو را ببین؛ کدام شکل جای علامت سوال قرار می‌گیرد؟');
            }, 150);

            const optsRow = card.querySelector('#raven-opts');
            let answered = false;

            (round.options || []).forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'raven-opt-btn';
                btn.innerHTML = opt.img;

                btn.onclick = () => {
                    if (answered) return;
                    AudioEngine.play('click');

                    if (idx === round.answer) {
                        answered = true;
                        btn.classList.add('correct');
                        card.querySelector('#raven-target').innerHTML = opt.img;
                        AudioEngine.play('correct');
                        IQAssessment.recordTrial('raven', true);
                        if (window.Fx) Fx.stars(card, 5);
                        setTimeout(() => {
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 900);
                    } else {
                        btn.classList.add('wrong');
                        AudioEngine.play('wrong');
                        IQAssessment.recordTrial('raven', false);
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
                AudioEngine.speak('سایه دقیق این تصویر را پیدا کن!');
            };

            setTimeout(() => {
                AudioEngine.speak('سایه دقیق این تصویر را پیدا کن!');
            }, 150);

            const optsGrid = card.querySelector('#shadow-opts');
            let answered = false;

            (round.shadowOptions || []).forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'shadow-opt-btn';
                btn.innerHTML = `<div class="shadow-silhouette" style="filter: brightness(0) opacity(0.85);">${opt.img}</div>`;

                btn.onclick = () => {
                    if (answered) return;
                    AudioEngine.play('click');

                    if (idx === round.answer) {
                        answered = true;
                        btn.classList.add('correct');
                        AudioEngine.play('correct');
                        IQAssessment.recordTrial('shadow', true);
                        if (window.Fx) Fx.stars(card, 5);
                        setTimeout(() => {
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 900);
                    } else {
                        btn.classList.add('wrong');
                        AudioEngine.play('wrong');
                        IQAssessment.recordTrial('shadow', false);
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
                    <button class="simon-bell red" data-idx="0"><span class="bell-icon">🔔</span></button>
                    <button class="simon-bell yellow" data-idx="1"><span class="bell-icon">🔔</span></button>
                    <button class="simon-bell green" data-idx="2"><span class="bell-icon">🔔</span></button>
                    <button class="simon-bell blue" data-idx="3"><span class="bell-icon">🔔</span></button>
                </div>
                <div class="simon-step-indicator" id="simon-steps">مرحله: ${toFa(sequenceLength)} تایی</div>
            `;

            const bellFrequencies = [261.63, 329.63, 392.00, 523.25];
            const bellColors = ['#FF4757', '#FFA502', '#2ED573', '#1E90FF'];
            const bells = card.querySelectorAll('.simon-bell');
            const statusEl = card.querySelector('#simon-status');

            // Generate sequence
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
                            // Won Simon Round!
                            acceptingInput = false;
                            statusEl.textContent = 'آفرین حافظه فوق‌العاده‌ای داری!';
                            AudioEngine.play('win');
                            IQAssessment.recordTrial('simon', true);
                            if (window.Fx) Fx.confetti();
                            setTimeout(() => {
                                if (cb && cb.onCorrect) cb.onCorrect(round);
                            }, 1000);
                        }
                    } else {
                        // Failed Sequence -> Replay
                        acceptingInput = false;
                        statusEl.textContent = 'اشکالی نداره، یک بار دیگه با هم ببینیم!';
                        AudioEngine.play('wrong');
                        IQAssessment.recordTrial('simon', false);
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
                        <span class="magic-hat-icon">🎩✨</span>
                        <p>اجی مجی لا ترجی!</p>
                    </div>
                </div>
                <div class="disappeared-options-pool" id="disp-opts" style="display:none;"></div>
            `;

            setTimeout(() => {
                AudioEngine.speak('این وسایل را خوب نگاه کن و به خاطر بسپار!');
            }, 150);

            // Phase 1: Memorize for 3.5 seconds
            setTimeout(() => {
                const curtain = card.querySelector('#magic-curtain');
                const grid = card.querySelector('#tray-grid');
                curtain.style.display = 'flex';
                AudioEngine.play('bubble');

                // Phase 2: Remove 1 item behind curtain
                setTimeout(() => {
                    curtain.style.display = 'none';
                    grid.innerHTML = remainingItems.map(item => `<div class="tray-item">${item.img}<span class="tray-label">${item.label}</span></div>`).join('') +
                        `<div class="tray-item missing-slot"><span>❓</span></div>`;

                    card.querySelector('#disp-prompt').textContent = 'کدام وسیله غیب شد و دیگر در سینی نیست؟';
                    AudioEngine.speak('کدام وسیله ناپدید شد؟');

                    const optsDiv = card.querySelector('#disp-opts');
                    optsDiv.style.display = 'flex';

                    initialItems.forEach(opt => {
                        const btn = document.createElement('button');
                        btn.className = 'disp-opt-btn';
                        btn.innerHTML = `${opt.img}<span>${opt.label}</span>`;

                        btn.onclick = () => {
                            if (opt.id === missingItem.id) {
                                AudioEngine.play('correct');
                                btn.classList.add('correct');
                                IQAssessment.recordTrial('disappeared', true);
                                if (window.Fx) Fx.stars(card, 5);
                                setTimeout(() => {
                                    if (cb && cb.onCorrect) cb.onCorrect(round);
                                }, 900);
                            } else {
                                AudioEngine.play('wrong');
                                btn.classList.add('wrong');
                                IQAssessment.recordTrial('disappeared', false);
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

            card.innerHTML = `
                <div class="activity-header-row">
                    <h2 class="quiz-prompt">کدام کفه ترازو سنگین‌تر است؟</h2>
                    <button class="speaker-btn" id="balance-speak"><span>بشنو</span></button>
                </div>
                <div class="scale-visual-wrap">
                    <div class="scale-beam" style="transform: rotate(${leftTiltDeg}deg);">
                        <div class="scale-pan left-pan">
                            <div class="pan-items">${'🍎'.repeat(leftCount)}</div>
                        </div>
                        <div class="scale-fulcrum">⚖️</div>
                        <div class="scale-pan right-pan">
                            <div class="pan-items">${'🍎'.repeat(rightCount)}</div>
                        </div>
                    </div>
                </div>
                <div class="balance-choices-row" id="balance-choices">
                    <button class="balance-choice-btn" data-choice="left">👈 کفه راست (سنگین‌تر)</button>
                    <button class="balance-choice-btn" data-choice="right">👉 کفه چپ (سنگین‌تر)</button>
                </div>
            `;

            setTimeout(() => {
                AudioEngine.speak('کدام کفه ترازو به سمت پایین رفته و سنگین‌تر است؟');
            }, 150);

            let answered = false;
            card.querySelectorAll('.balance-choice-btn').forEach(btn => {
                btn.onclick = () => {
                    if (answered) return;
                    const choice = btn.dataset.choice;

                    if (choice === heavier) {
                        answered = true;
                        btn.classList.add('correct');
                        AudioEngine.play('correct');
                        IQAssessment.recordTrial('math', true);
                        if (window.Fx) Fx.stars(card, 5);
                        setTimeout(() => {
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 900);
                    } else {
                        btn.classList.add('wrong');
                        AudioEngine.play('wrong');
                        IQAssessment.recordTrial('math', false);
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
