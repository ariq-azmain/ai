import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─────────────────────────────────────────────────────────────
   Global Store
   Persists: theme
   In-memory: messages, ui state
───────────────────────────────────────────────────────────── */
const useStore = create(
  persist(
    (set) => ({
      // ── Theme ──────────────────────────────────────────────
      theme: 'system', // 'light' | 'dark' | 'system'
      setTheme: (theme) => set({ theme }),

      // ── Chat Messages ──────────────────────────────────────
      messages: [],
      isLoading: false,

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      // Append streamed chunk to the last assistant message
      appendToLastMessage: (chunk) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last && last.role === 'assistant') {
            messages[messages.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
          }
          return { messages };
        }),

      setLoading: (isLoading) => set({ isLoading }),

      clearMessages: () => set({ messages: [] }),

      // ── UI State ───────────────────────────────────────────
      sidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      settingsOpen: false,
      setSettingsOpen: (open) => set({ settingsOpen: open }),
    }),
    {
      name: 'ai-chat-storage',
      // Only persist theme preference, not messages
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useStore;
