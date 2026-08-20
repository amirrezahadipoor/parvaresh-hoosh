#!/usr/bin/env node
'use strict';

// Real Chromium smoke test. Unlike test_runtime.js, this executes the actual
// browser parser, CSP, service worker, layout, events and offline cache.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright-core');

const root = process.env.E2E_ROOT ? path.resolve(__dirname, process.env.E2E_ROOT) : __dirname;
const appVersion = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')).version;
const mime = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg'
};

function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((request, response) => {
            const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
            const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
            const file = path.resolve(root, relative);
            if (!file.startsWith(`${root}${path.sep}`)) {
                response.writeHead(403).end('Forbidden');
                return;
            }
            fs.readFile(file, (error, body) => {
                if (error) {
                    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
                    return;
                }
                response.writeHead(200, {
                    'content-type': mime[path.extname(file)] || 'application/octet-stream',
                    'cache-control': 'no-cache'
                });
                response.end(body);
            });
        });
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => resolve(server));
    });
}

async function main() {
    const server = await startServer();
    const port = server.address().port;
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
    } catch (error) {
        await new Promise(resolve => server.close(resolve));
        throw error;
    }
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        locale: 'fa-IR',
        colorScheme: 'light',
        reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const errors = [];
    let offline = false;
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => {
        if (message.type() === 'error' && !/play\(\) failed|user didn't interact/i.test(message.text())) {
            errors.push(`console: ${message.text()}`);
        }
    });
    page.on('requestfailed', request => {
        if (!offline) errors.push(`request: ${request.url()} ${request.failure()?.errorText || ''}`);
    });

    try {
        await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
        await page.locator('#screen-home.active').waitFor({ timeout: 10000 });

        const onboarding = page.locator('.profile-onboarding-overlay');
        if (await onboarding.count()) {
            await onboarding.locator('.age-choice').first().click();
            await onboarding.locator('#profile-start').click();
        }

        assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
        assert.ok(await page.locator('.domain-tile').count() >= 7, 'seven learning domains should render');
        const homeBottomClearance = await page.locator('#home-content').evaluate(element => parseFloat(getComputedStyle(element).paddingBottom));
        assert.ok(homeBottomClearance >= 10, `home needs a blank system-navigation strip, got ${homeBottomClearance}px`);
        await page.locator('.arcade-banner').click();
        await page.locator('#screen-arcade.active').waitFor();
        assert.equal(await page.locator('.arcade-game-card').count(), 7, 'seven arcade games should render');
        await page.locator('#btn-back-arcade').click();
        await page.locator('#screen-home.active').waitFor();

        const unnamed = await page.locator('button').evaluateAll(buttons => buttons.filter(button =>
            !button.textContent.trim() && !button.getAttribute('aria-label') &&
            !button.getAttribute('aria-labelledby') && !button.getAttribute('title')
        ).map(button => button.id || button.className));
        assert.deepEqual(unnamed, [], `unnamed controls: ${unnamed.join(', ')}`);

        await page.locator('.domain-tile').first().click();
        await page.locator('#screen-domain.active').waitFor();
        await page.locator('#domain-content .difficulty-card').first().click();
        await page.locator('#screen-lesson.active').waitFor();
        assert.ok(await page.locator('#lesson-body').locator(':scope > *').count() > 0, 'lesson body should render');
        const lessonBottomClearance = await page.locator('.activity-fullscreen-stage').evaluate(element => parseFloat(getComputedStyle(element).paddingBottom));
        assert.ok(lessonBottomClearance >= 20, `lesson options need system-navigation clearance, got ${lessonBottomClearance}px`);
        await page.locator('#btn-exit-lesson').click();

        // Wait until all 692 local files are installed, then prove cold navigation
        // works while Chromium itself is offline.
        await page.evaluate(async expectedVersion => {
            if (!('serviceWorker' in navigator)) throw new Error('service worker unavailable');
            await navigator.serviceWorker.ready;
            const deadline = Date.now() + 15000;
            while (Date.now() < deadline) {
                const keys = await caches.keys();
                if (keys.some(key => key.includes(`v${expectedVersion}`))) return;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`versioned offline cache v${expectedVersion} was not installed`);
        }, appVersion);
        offline = true;
        await context.setOffline(true);
        await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        try {
            await page.locator('#screen-home.active').waitFor({ timeout: 10000 });
        } catch (error) {
            const activeScreen = await page.locator('.screen.active').getAttribute('id').catch(() => null);
            throw new Error(`offline startup failed; active=${activeScreen}; errors=${errors.join(' | ')}; ${error.message}`);
        }
        assert.equal(errors.length, 0, errors.join('\n'));
        console.log('Chromium E2E passed: RTL startup, onboarding, domains, arcade, lesson navigation, accessibility names and offline reload.');
    } finally {
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}

main().catch(error => {
    console.error(error.stack || error);
    process.exitCode = 1;
});
