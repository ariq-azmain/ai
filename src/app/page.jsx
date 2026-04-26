'use client';

import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import SettingsModal from '@/components/SettingsModal';

/* ─────────────────────────────────────────────────────────────
   Main Page
   Full-height layout: sidebar left + chat right
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar wrapper — position relative for the toggle button */}
      <div className="relative flex-shrink-0 flex">
        <Sidebar />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow />
      </div>

      {/* Settings modal (portal-style, rendered at root) */}
      <SettingsModal />
    </main>
  );
}
