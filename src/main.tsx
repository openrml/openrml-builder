// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker registration
// vite-plugin-pwa injects the virtual module 'virtual:pwa-register'
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() {
        // New content available — could show a toast here
        // For now: auto-update silently (registerType: 'autoUpdate' handles this)
        console.info('[PWA] New version available, updating...');
      },
      onOfflineReady() {
        console.info('[PWA] App ready to work offline');
      },
      onRegistered(r) {
        console.info('[PWA] Service worker registered:', r);
      },
      onRegisterError(error) {
        console.warn('[PWA] Service worker registration failed:', error);
      },
    });
  }).catch(() => {
    // virtual:pwa-register not available in dev mode (devOptions.enabled: false)
  });
}
