'use client';

import { useEffect, useRef, useState } from 'react';

type PwaProps = { lang: 'en' | 'ru' };
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }> };

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
  const [online, setOnline] = useState(true);
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const acceptingUpdate = useRef(false);
  const t = copy[lang];

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIosHint(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    let registration: ServiceWorkerRegistration | undefined;
    let stopped = false;
    const onControllerChange = () => {
      setReady(true);
      if (acceptingUpdate.current) window.location.reload();
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/flexmap-pwa/sw.js', { scope: '/flexmap-pwa/' }).then((reg) => {
        registration = reg;
        if (stopped) return;
        setReady(Boolean(reg.active));
        if (reg.waiting && navigator.serviceWorker.controller) setWaitingWorker(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'activated') setReady(true);
            if (worker.state === 'installed' && navigator.serviceWorker.controller) setWaitingWorker(worker);
          });
        });
      }).catch(() => setReady(false));
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    }

    return () => {
      stopped = true;
      navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, [waitingWorker]);

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
