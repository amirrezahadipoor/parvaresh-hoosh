// Khanak Academy - Main Application Entry

(function() {
    'use strict';

    // ===== App State =====
    const state = {
        currentDomain: null,
        currentLevel: null,
        currentLesson: null,
        screen: 'splash',
        curriculum: null,
        userProgress: {}
    };

    // ===== DOM References =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const splashScreen = $('#splash-screen');
    const homeScreen = $('#home-screen');
    const domainsGrid = $('#domains-grid');
    const navItems = $$('.nav-item');

    // ===== Initialize =====
    async function init() {
        console.log('Khanak Academy v' + APP_CONFIG.version);
        
        // Load curriculum data
        try {
            const response = await fetch('content/curriculum.json');
            state.curriculum = await response.json();
            console.log('Curriculum loaded:', state.curriculum.totalLessons, 'lessons');
        } catch (e) {
            console.error('Failed to load curriculum:', e);
        }

        // Load user progress
        const progress = await StorageManager.getStats();
        state.userProgress = progress;

        // Build home screen
        buildDomainCards();

        // Splash -> Home transition
        setTimeout(() => {
            showScreen('home');
            splashScreen.style.opacity = '0';
            splashScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }, 2500);
    }

    // ===== Screen Management =====
    function showScreen(name) {
        $$('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(name + '-screen');
        if (target) {
            target.classList.add('active');
            target.style.display = 'flex';
        }
        state.screen = name;
        
        // Update nav
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.screen === name);
        });
    }

    // ===== Build Domain Cards =====
    function buildDomainCards() {
        if (!domainsGrid || !APP_CONFIG) return;
        
        const domainConfigs = APP_CONFIG.domains;
        
        domainsGrid.innerHTML = domainConfigs.map(d => `
            <button class="domain-card" data-domain="${d.id}" 
                    onclick="window.handleDomainClick('${d.id}')"
                    style="border-top: 4px solid ${d.color}">
                <div class="domain-icon" style="background: ${d.bgColor}; color: ${d.color}">
                    <span style="font-size: 28px">${d.iconChar}</span>
                </div>
                <div class="domain-name">${d.name}</div>
                <div class="domain-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%; background: ${d.color}"></div>
                    </div>
                    <span class="progress-text">0%</span>
                </div>
            </button>
        `).join('');
    }

    // ===== Domain Click Handler =====
    window.handleDomainClick = function(domainId) {
        state.currentDomain = domainId;
        console.log('Domain selected:', domainId);
        // TODO: Navigate to domain detail/level select screen
        alert('دامنه ' + domainId + ' انتخاب شد! (بزودي...)');
    };

    // ===== Event Listeners =====
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            showScreen(item.dataset.screen);
        });
    });

    // Profile button
    $('#profile-btn')?.addEventListener('click', () => {
        console.log('Profile clicked');
    });

    // Parent button
    $('#parent-btn')?.addEventListener('click', () => {
        console.log('Parent section clicked');
        // TODO: Parent PIN gate
    });

    // ===== Start App =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
