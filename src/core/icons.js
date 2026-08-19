// Shared inline SVG icon set for reliable offline rendering in Android WebView.
// Icons use currentColor, so every tile/button controls the contrast from CSS.
window.AppIcons = (function () {
    const paths = {
        reading: '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v17H8.5A3.5 3.5 0 0 0 5 22V5.5Z"/><path d="M19 5.5A3.5 3.5 0 0 0 15.5 2H12v17h3.5A3.5 3.5 0 0 1 19 22V5.5Z"/><path d="M7.5 7H10M14 7h2.5M7.5 11H10M14 11h2.5"/>',
        math: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 8h4M9 6v4M14 7h3M7 15h4M14 13l3 4M17 13l-3 4"/>',
        logic: '<path d="M9 3h6v4a2 2 0 1 0 4 0h2v6h-4a2 2 0 1 0 0 4h-2v4H9v-4H5a2 2 0 1 1 0-4H3V7h4a2 2 0 1 0 2-4Z"/>',
        science: '<path d="M9 3h6M10 3v6l-5.5 9.2A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.8L14 9V3"/><path d="M7.5 16h9M9.5 13h5"/>',
        'socio-emotional': '<path d="M12 21S3.5 16.2 3.5 9.5A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8.5 2.1C20.5 16.2 12 21 12 21Z"/><path d="M8.5 11.5h.01M15.5 11.5h.01M9 15c1.8 1.4 4.2 1.4 6 0"/>',
        art: '<path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.2 1.8 1.8 0 0 1 1.2-3.2H18a3 3 0 0 0 3-3C21 6.8 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>',
        'socio-emotional': '<path d="M12 21S3.5 16.2 3.5 9.5A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8.5 2.1C20.5 16.2 12 21 12 21Z"/><path d="M8.5 11.5h.01M15.5 11.5h.01M9 15c1.8 1.4 4.2 1.4 6 0"/>',
        home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
        back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
        star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
        arcade: '<path d="M8 8h8a5 5 0 0 1 4.8 6.5l-1 3a2.2 2.2 0 0 1-3.8.7L14.5 16h-5L8 18.2a2.2 2.2 0 0 1-3.8-.7l-1-3A5 5 0 0 1 8 8Z"/><path d="M7 11v4M5 13h4M16.5 12h.01M18.5 14h.01"/>',
        balloon: '<path d="M12 3a6 7 0 0 1 6 7c0 4-2.7 7-6 7s-6-3-6-7a6 7 0 0 1 6-7Z"/><path d="m10.5 17 1.5 2 1.5-2M12 19c-2 1-2 2 0 3"/>',
        memory: '<rect x="3" y="5" width="13" height="15" rx="3"/><path d="M8 9h3M8 13h3M8 17h3M16 8h2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-2"/>',
        music: '<path d="M9 18V6l11-2v12M9 9l11-2"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
        train: '<path d="M6 17h12l2-4V7a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v10Z"/><path d="M6 10h14M9 7h2M15 7h2M4 17h16M7 21l2-4M17 21l-2-4"/>',
        chat: '<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 9h8M8 12h5"/>',
        play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
        // Tool icons for the painting workshop. Pre-readers cannot use a toolbar
        // of Persian words, so every control is a picture of what it does.
        brush: '<path d="M4 20s1-3 3-3 2 2 4 2 2.5-2 2.5-2"/><path d="M9 15 18.5 5.5a2.1 2.1 0 0 1 3 3L12 18"/>',
        'brush-thick': '<path d="M4 20s1-3 3-3 2 2 4 2 2.5-2 2.5-2"/><path d="M8 14 17.5 4.5a3 3 0 0 1 4 4L12 18"/><path d="M6 17.5h.01"/>',
        eraser: '<path d="M8 20H5l-2-2a2 2 0 0 1 0-2.8l9-9a2 2 0 0 1 2.8 0l4 4a2 2 0 0 1 0 2.8L12 20H8Z"/><path d="m9 12 5 5"/>',
        undo: '<path d="M9 7 4 12l5 5"/><path d="M4 12h9a6 6 0 0 1 0 12h-1"/>',
        trash: '<path d="M4 7h16"/><path d="M10 4h4M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
        save: '<path d="M5 4h11l3 3v13H5V4Z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
        rainbow: '<path d="M3 18a9 9 0 0 1 18 0"/><path d="M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M10 18a2 2 0 0 1 4 0"/>',
        cat: '<path d="M5.6 9.4 4.6 3.8l4.8 2.9a8.6 8.6 0 0 1 5.2 0l4.8-2.9-1 5.6a7.4 7.4 0 1 1-12.8 0Z"/><path d="M9.4 12.6h.01M14.6 12.6h.01"/><path d="m12 15-1 1.2h2Z"/>',
        rabbit: '<ellipse cx="9" cy="6" rx="1.9" ry="4.2"/><ellipse cx="15" cy="6" rx="1.9" ry="4.2"/><circle cx="12" cy="15.6" r="5.8"/><path d="M10 14.8h.01M14 14.8h.01"/>',
        fish: '<path d="M21 12c-3 4-7.4 4.6-11 2.6C7.6 13.4 6.4 12 6.4 12s1.2-1.4 3.6-2.6C13.6 7.4 18 8 21 12Z"/><path d="M6.4 12 2.8 8.6 3.9 12l-1.1 3.4Z"/><path d="M16.6 11.2h.01"/>',
        heart: '<path d="M12 20.5S3.6 15 3.6 9.2A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.4 2.6C20.4 15 12 20.5 12 20.5Z"/>',
        flower: '<circle cx="12" cy="6.4" r="3.2"/><circle cx="17" cy="9.8" r="3.2"/><circle cx="15.2" cy="15.6" r="3.2"/><circle cx="8.8" cy="15.6" r="3.2"/><circle cx="7" cy="9.8" r="3.2"/><circle cx="12" cy="11.8" r="2.3"/>',
        speaker: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
        check: '<path d="m5 13 4 4L19 7"/>',
        // Difficulty symbols: a growing plant then a trophy. Chosen so the
        // three levels read as a sequence at a glance, without any text.
        seedling: '<path d="M12 21v-8"/><path d="M12 13c-4.2 0-6.5-2.6-6.5-6C10 7 12 9.3 12 13Z"/>',
        sprout: '<path d="M12 21v-10"/><path d="M12 11C8.4 11 6.4 8.9 6.4 5.6 10 5.6 12 7.8 12 11Z"/><path d="M12 11c0-3.2 2-5.4 5.6-5.4C17.6 8.9 15.6 11 12 11Z"/><path d="M12 15.5c0-2.2 1.6-3.7 4.2-3.7 0 2.2-1.6 3.7-4.2 3.7Z"/>',
        trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 5H5.5a2.5 2.5 0 0 0 2.5 5"/><path d="M16 5h2.5a2.5 2.5 0 0 1-2.5 5"/><path d="M12 13v4M9 21h6l-1-4h-4Z"/>'
    };

    function get(name, size) {
        const body = paths[name] || paths.play;
        const px = Number(size) || 24;
        return `<svg class="app-icon" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
    }

    return { get, has: name => Boolean(paths[name]) };
})();
