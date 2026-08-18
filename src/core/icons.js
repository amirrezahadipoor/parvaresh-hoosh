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
        arcade: '<path d="M8 8h8a5 5 0 0 1 4.8 6.5l-1 3a2.2 2.2 0 0 1-3.8.7L14.5 16h-5L8 18.2a2.2 2.2 0 0 1-3.8-.7l-1-3A5 5 0 0 1 8 8Z"/><path d="M7 11v4M5 13h4M16.5 12h.01M18.5 14h.01"/>',
        balloon: '<path d="M12 3a6 7 0 0 1 6 7c0 4-2.7 7-6 7s-6-3-6-7a6 7 0 0 1 6-7Z"/><path d="m10.5 17 1.5 2 1.5-2M12 19c-2 1-2 2 0 3"/>',
        memory: '<rect x="3" y="5" width="13" height="15" rx="3"/><path d="M8 9h3M8 13h3M8 17h3M16 8h2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-2"/>',
        music: '<path d="M9 18V6l11-2v12M9 9l11-2"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
        train: '<path d="M6 17h12l2-4V7a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v10Z"/><path d="M6 10h14M9 7h2M15 7h2M4 17h16M7 21l2-4M17 21l-2-4"/>',
        chat: '<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 9h8M8 12h5"/>',
        play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>'
    };

    function get(name, size) {
        const body = paths[name] || paths.play;
        const px = Number(size) || 24;
        return `<svg class="app-icon" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
    }

    return { get, has: name => Boolean(paths[name]) };
})();
