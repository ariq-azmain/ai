'use client';

import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    console.log(result.outcome); // accepted / dismissed
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button className="fixed top-5 right-5 bg-brand-500 p-2 rounded-lg shadow-md" onClick={handleInstall}>
      📲 Install App
    </button>
  );
}