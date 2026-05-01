import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // ── Theme ──────────────────────────────────────────────
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // ── Chat Messages ──────────────────────────────────────
      messages: [],
      isLoading: false,

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      appendToLastMessage: (chunk) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last?.role === 'assistant') {
            messages[messages.length - 1] = { ...last, content: last.content + chunk };
          }
          return { messages };
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: [], currentConversationId: null }),

      // ── Conversations ──────────────────────────────────────
      conversations: [],
      currentConversationId: null,

      setConversations: (conversations) => set({ conversations }),
      setCurrentConversationId: (id) => set({ currentConversationId: id }),

      addConversation: (conv) =>
        set((state) => ({ conversations: [conv, ...state.conversations] })),

      updateConversationTime: (id) =>
        set((state) => ({
          conversations: state.conversations
            .map((c) => c.id === id ? { ...c, updated_at: new Date().toISOString() } : c)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
        })),

      // ── UI State ───────────────────────────────────────────
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })), 

      settingsOpen: false,
      setSettingsOpen: (open) => set({ settingsOpen: open }),
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useStore;
