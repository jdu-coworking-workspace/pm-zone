/**
 * Service Worker Registration Utility
 * Handles PWA service worker registration and updates
 */

export async function registerServiceWorker() {
  console.log('🔧 Attempting to register service worker...');
  
  if (!('serviceWorker' in navigator)) {
    console.log('⚠️ Service Workers are not supported in this browser');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('✅ Service Worker registered successfully:', registration.scope);
    console.log('📍 Registration state:', registration.installing ? 'installing' : registration.waiting ? 'waiting' : registration.active ? 'active' : 'unknown');

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('🔄 New Service Worker found, installing...');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('✨ New version available! Refresh to update.');
          showUpdateNotification(registration);
        }
      });
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    console.error('Error details:', error.message, error.stack);
  }
}

function showUpdateNotification(registration) {
  const updateToast = document.createElement('div');
  updateToast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #3b82f6;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 16px;
  `;

  updateToast.innerHTML = `
    <span>🎉 New version available!</span>
    <button id="sw-update-btn" style="background: white; color: #3b82f6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Update Now</button>
  `;

  document.body.appendChild(updateToast);

  document.getElementById('sw-update-btn').addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  });
}

export function setupInstallPrompt() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💾 Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton(deferredPrompt);
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    hideInstallButton();
    deferredPrompt = null;
  });
}

function showInstallButton(deferredPrompt) {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return;
  }

  // Check if user previously dismissed
  if (localStorage.getItem('pwa-install-dismissed') === 'true') {
    return;
  }

  const installBtn = document.createElement('button');
  installBtn.id = 'pwa-install-btn';
  installBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Install App</span>
    <svg id="pwa-dismiss-btn" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px; opacity: 0.7; cursor: pointer;">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  
  installBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, opacity 0.2s;
  `;

  // Hover effect
  installBtn.addEventListener('mouseenter', () => {
    installBtn.style.transform = 'scale(1.05)';
  });
  
  installBtn.addEventListener('mouseleave', () => {
    installBtn.style.transform = 'scale(1)';
  });

  // Install button click
  installBtn.addEventListener('click', async (e) => {
    // Check if clicked on dismiss button
    if (e.target.id === 'pwa-dismiss-btn' || e.target.closest('#pwa-dismiss-btn')) {
      console.log('Install prompt dismissed by user');
      localStorage.setItem('pwa-install-dismissed', 'true');
      installBtn.style.opacity = '0';
      installBtn.style.transform = 'scale(0.8)';
      setTimeout(() => installBtn.remove(), 200);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Install prompt outcome: ${outcome}`);
    deferredPrompt = null;
    installBtn.remove();
  });

  if (!document.getElementById('pwa-install-btn')) {
    document.body.appendChild(installBtn);
  }
}

function hideInstallButton() {
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) installBtn.remove();
}

export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export async function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}
