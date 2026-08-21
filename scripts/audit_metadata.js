#!/usr/bin/env node
'use strict';

// Cross-file truth audit: prevents the count/version/status/documentation drift
// that previously let 142, 192, 292 and 342 coexist in one release.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const packageJson = json('package.json');
const packageLock = json('package-lock.json');
const curriculum = json('content/curriculum.json');
const manifest = json('content/content_manifest.json');
const lessons = curriculum.domains.flatMap(domain =>
    domain.levels.flatMap(level => level.lessons.map(lesson => ({ domain, level, lesson })))
);
const ids = lessons.map(entry => entry.lesson.id);
const titles = lessons.map(entry => entry.lesson.title.trim());

assert.match(packageJson.version, /^\d+\.\d+\.\d+$/, 'package version must be SemVer');
assert.equal(packageLock.version, packageJson.version, 'package-lock root version drift');
assert.equal(packageLock.packages[''].version, packageJson.version, 'package-lock package version drift');
assert.equal(curriculum.version, packageJson.version, 'curriculum version drift');
assert.equal(manifest.appVersion, packageJson.version, 'manifest version drift');
assert.equal(curriculum.totalLessons, lessons.length, 'curriculum totalLessons drift');
assert.equal(manifest.totalItems, lessons.length, 'manifest item count drift');
assert.equal(manifest.completedItems, lessons.length, 'not every shipped lesson is implemented');
assert.equal(manifest.progressPercentage, 100, 'manifest progress is not 100%');
assert.equal(new Set(ids).size, ids.length, 'duplicate lesson IDs');
assert.equal(new Set(titles).size, titles.length, 'duplicate lesson titles');
assert.equal(curriculum.domains.length, 7, 'unexpected domain count');
assert.ok(lessons.every(({ lesson }) => lesson.status === 'implemented'), 'non-implemented lesson is shipped');

const requiredLessonFields = ['id', 'title', 'type', 'status', 'order', 'difficulty', 'ageBand'];
for (const { domain, level, lesson } of lessons) {
    for (const field of requiredLessonFields) {
        assert.notEqual(lesson[field], undefined, `${lesson.id}: missing ${field}`);
    }
    assert.equal(lesson.difficulty, level.difficulty, `${lesson.id}: difficulty differs from level`);
    const item = manifest.items.find(candidate => candidate.id === lesson.id);
    assert.ok(item, `${lesson.id}: absent from manifest`);
    assert.equal(item.domain, domain.id, `${lesson.id}: manifest domain drift`);
    assert.equal(item.level, level.id, `${lesson.id}: manifest level drift`);
    assert.equal(item.title, lesson.title, `${lesson.id}: manifest title drift`);
    assert.equal(item.status, lesson.status, `${lesson.id}: manifest status drift`);
}

const sandbox = { window: {} };
vm.runInNewContext(read('src/data/curriculum.js'), sandbox);
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.CURRICULUM)), curriculum,
    'embedded curriculum fallback is stale; run npm run sync:content');

const config = read('src/core/config.js');
assert.ok(config.includes(`version: '${packageJson.version}'`), 'App.version drift');
const gradle = read('android/app/build.gradle');
assert.ok(gradle.includes(`versionName "${packageJson.version}"`), 'Android versionName drift');
assert.match(gradle, /versionCode\s+[1-9]\d*/, 'Android versionCode must be positive');

const readme = read('README.md');
const toFa = value => String(value).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
assert.ok(readme.includes(`**${toFa(lessons.length)} درس پیاده‌سازی‌شده**`), 'README lesson count is stale');
assert.ok(readme.includes(`**${toFa(curriculum.domains.length)} حوزه`), 'README domain count is stale');
const publicDocs = [readme, read('privacy.html'), read('terms.html')].join('\n');
for (const stale of ['۱۴۲ درس', '۱۹۲ درس', '۲۹۲ درس', 'Web Speech دستگاه']) {
    assert.ok(!publicDocs.includes(stale), `stale public claim remains: ${stale}`);
}
assert.ok(!read('index.html').includes("script-src 'self' 'unsafe-inline'"), 'CSP permits inline scripts');
assert.ok(!read('index.html').includes('سنجش هوش کودک'), 'diagnostic-sounding claim remains in index');
const androidManifest = read('android/app/src/main/AndroidManifest.xml');
assert.ok(androidManifest.includes('android:allowBackup="false"'),
    'Android OS backup must be disabled for local child data');
assert.ok(!androidManifest.includes('android.permission.INTERNET'),
    'offline Android build must not request INTERNET permission');
const mainActivity = read('android/app/src/main/java/ir/parvareshhoosh/app/MainActivity.java');
assert.ok(mainActivity.includes('WindowInsetsCompat.Type.systemBars()') && mainActivity.includes('view.setPadding('),
    'Android WebView must reserve system Home/gesture/navigation insets');
assert.ok(fs.existsSync(path.join(root, 'LICENSE')), 'LICENSE is missing');
assert.ok(fs.existsSync(path.join(root, 'docs/EVIDENCE_AND_COMPLIANCE_FA.md')), 'evidence/compliance registry is missing');

const tracked = cp.execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split('\n');
assert.ok(!tracked.some(file => /\.zip$/i.test(file)), 'archive file is tracked in Git');

console.log(JSON.stringify({
    version: packageJson.version,
    domains: curriculum.domains.length,
    levels: curriculum.domains.reduce((sum, domain) => sum + domain.levels.length, 0),
    lessons: lessons.length,
    manifestItems: manifest.items.length,
    implemented: manifest.completedItems,
    uniqueIds: new Set(ids).size,
    uniqueTitles: new Set(titles).size,
    errors: []
}, null, 2));
