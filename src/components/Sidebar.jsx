'use client';

import { MessageSquarePlus, Settings, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import useStore from '@/store/useStore';

/* ─────────────────────────────────────────────────────────────
   Sidebar
   - Logo + New Chat
   - Chat history placeholder (to be developed)
   - Bottom: User avatar + Settings
───────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, clearMessages, setSettingsOpen } = useStore();

  const handleNewChat = () => {
    clearMessages();
    toggleSidebar();
  };

  return (
    <>
      {/* Sidebar panel */}
      <aside
        className={`
          sidebar-root relative z-0
          transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarOpen ? 'absolute top-0 left-0 bottom-0 h-screen px-5 !w-full': 'w-0 border-r-0 overflow-hidden'}
        `}
      >
        <div className="flex h-full flex-col w-64">
          {/* ── Top: Brand + New Chat ─────────────── */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
                AI Chat
              </span>
            </div>
            <button
              onClick={handleNewChat}
              className="btn-icon"
              title="New chat"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>

          {/* ── Middle: Chat History Placeholder ──── */}
          <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar">
            {/* History section label */}
            <p className="text-[10px] uppercase tracking-widest font-semibold px-2 mb-2 text-zinc-400 dark:text-zinc-600">
              Recent
            </p>
            {/* Placeholder — will be replaced with real history later */}
            <div className="space-y-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 animate-pulse"
                  style={{ opacity: 1 - i * 0.25 }}
                />
              ))}
            </div>
            <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 mt-6 px-4">
              Chat history coming soon
            </p>
          </div>

          {/* ── Bottom: User + Settings ────────────── */}
          <div className="px-3 py-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            {/* Demo user row */}
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-default">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  User
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                  Free plan
                </p>
              </div>
            </div>

            {/* Settings button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-ghost w-full justify-start"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Collapse/Expand toggle button */}
      <button
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className={`
          absolute top-1/2 -translate-y-1/2 z-20
          w-5 h-10 flex items-center justify-center
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-700
          rounded-r-lg shadow-sm
          text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200
          transition-all duration-300 cursor-pointer
          border-l-0
          ${sidebarOpen ? 'left-[297px]' : 'left-0'}
        `}
      >
        {sidebarOpen
          ? <ChevronLeft className="w-3 h-3 border-l-0" />
          : <ChevronRight className="w-3 h-3 border-l-0" />}
      </button>
    </>
  );
}
