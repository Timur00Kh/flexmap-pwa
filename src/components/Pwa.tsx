'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

type PwaProps = { lang: 'en' | 'ru' };
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }> };
const subscribeOnline = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const subscribeInstalled = (callback: () => void) => {
  const media = window.matchMedia('(display-mode: standalone)');
  media.addEventListener('change', callback);
  window.addEventListener('appinstalled', callback);
  return () => {
    media.removeEventListener('change', callback);
    window.removeEventListener('appinstalled', callback);
  };
};
const subscribeNever = () => () => undefined;

const copy = {
  en: {
    online: 'Online', offline: 'Offline', ready: 'Offline access ready', preparing: 'Preparing offline access…',
    install: 'Install app', installed: 'App installed', update: 'Update available', reload: 'Update now',
    ios: 'To install: tap Share, then “Add to Home Screen”.',
  },
  ru: {
    online: 'В сети', offline: 'Нет сети', ready: 'Офлайн-доступ готов', preparing: 'Подготовка офлайн-доступа…',
    install: 'Установить', installed: 'Приложение установлено', update: 'Доступно обновление', reload: 'Обновить сейчас',
    ios: 'Для установки: нажмите «Поделиться», затем «На экран Домой».',
  },
} as const;

export default function Pwa({ lang }: PwaProps) {
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
  const installed = useSyncExternalStore(subscribeInstalled, isStandalone, () => false);
  const iosHint = useSyncExternalStore(
    subscribeNever,
    () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandalone(),
    () => false,
  );
  const [ready, setReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const acceptingUpdate = useRef(false);
  const t = copy[lang];

  useEffect(() => {
    const onInstalled = () => setInstallPrompt(null);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    let stopped = false;
    let removeUpdateFoundListener: (() => void) | undefined;
    const onControllerChange = () => {
      setReady(true);
      if (acceptingUpdate.current) window.location.reload();
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/flexmap-pwa/sw.js', { scope: '/flexmap-pwa/' }).then((reg) => {
        if (stopped) return;
        setReady(Boolean(reg.active));
        if (reg.waiting && navigator.serviceWorker.controller) setWaitingWorker(reg.waiting);
        const onUpdateFound = () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'activated') setReady(true);
            if (worker.state === 'installed' && navigator.serviceWorker.controller) setWaitingWorker(worker);
          });
        };
        reg.addEventListener('updatefound', onUpdateFound);
        removeUpdateFoundListener = () => reg.removeEventListener('updatefound', onUpdateFound);
      }).catch(() => setReady(false));
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    }

    return () => {
      stopped = true;
      removeUpdateFoundListener?.();
      navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstallPrompt(null);
  };

  const update = () => {
    if (!waitingWorker) return;
    acceptingUpdate.current = true;
    waitingWorker.postMessage('SKIP_WAITING');
  };

  return (
    <aside aria-label={lang === 'ru' ? 'Статус приложения' : 'App status'} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
      <span aria-live="polite" title={ready ? t.ready : t.preparing}>
        <span aria-hidden="true" style={{ color: online ? '#198754' : '#d97706', marginRight: 5 }}>●</span>{online ? t.online : t.offline}
      </span>
      {ready && <span>{t.ready}</span>}
      {installed && <span>{t.installed}</span>}
      {!installed && installPrompt && <button type="button" onClick={install}>{t.install}</button>}
      {!installed && iosHint && <span>{t.ios}</span>}
      {waitingWorker && <button type="button" onClick={update} aria-label={`${t.update}: ${t.reload}`}>{t.reload}</button>}
    </aside>
  );
}
