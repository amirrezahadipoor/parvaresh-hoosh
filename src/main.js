// نقطهٔ ورود برنامه.

import { mount, render, homeScreen } from './ui/screens.js';
import { setMuted, unlockAudio } from './core/audio.js';
import { getState } from './core/storage.js';

function boot() {
  const root = document.getElementById('app');
  mount(root);
  setMuted(getState().muted);
  unlockAudio();
  render(homeScreen());

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        /* بدون service worker هم برنامه کار می‌کند */
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
