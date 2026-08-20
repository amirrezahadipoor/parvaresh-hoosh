#!/usr/bin/env node
'use strict';

// Regenerate every duplicated curriculum representation from the canonical JSON.
// Run after editing content/curriculum.json. CI verifies that the generated files
// are committed and byte-for-byte current.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const curriculumPath = path.join(root, 'content/curriculum.json');
const manifestPath = path.join(root, 'content/content_manifest.json');
const embeddedPath = path.join(root, 'src/data/curriculum.js');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
const previousManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const previousById = new Map((previousManifest.items || []).map(item => [item.id, item]));
const flattened = [];

for (const domain of curriculum.domains || []) {
    for (const level of domain.levels || []) {
        for (const lesson of level.lessons || []) flattened.push({ domain, level, lesson });
    }
}

curriculum.version = packageJson.version;
curriculum.totalLessons = flattened.length;
fs.writeFileSync(curriculumPath, `${JSON.stringify(curriculum, null, 2)}\n`);
fs.writeFileSync(embeddedPath, `window.CURRICULUM = ${JSON.stringify(curriculum)};\n`);

const items = flattened.map(({ domain, level, lesson }) => ({
    ...(previousById.get(lesson.id) || {}),
    id: lesson.id,
    title: lesson.title,
    domain: domain.id,
    domainTitle: domain.title,
    level: level.id,
    levelTitle: level.title,
    type: lesson.type,
    status: lesson.status,
    order: lesson.order,
    difficulty: lesson.difficulty,
    ageBand: lesson.ageBand
}));
const implementedItems = items.filter(item => item.status === 'implemented').length;
const manifest = {
    ...previousManifest,
    appVersion: packageJson.version,
    targetAge: curriculum.targetAge,
    generated: curriculum.lastUpdated,
    totalItems: items.length,
    completedItems: implementedItems,
    progressPercentage: items.length ? Math.round(implementedItems / items.length * 100) : 0,
    items
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Synced ${items.length} lessons for version ${packageJson.version}.`);
