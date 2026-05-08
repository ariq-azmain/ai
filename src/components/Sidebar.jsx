'use client';

import { useEffect } from 'react';
import {
  Show,
  SignInButton,
  SignUpButton, 
  UserButton, 
  useUser
} from '@clerk/nextjs';
import { 
  MessageSquarePlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot
} from 'lucide-react';

import useStore from '@/store/useStore';

export default function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    clearMessages,
    setSettingsOpen,
    conversations, 
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    setMessages,
    setLoading,
  } = useStore();

  const { isSignedIn, user } = useUser();

  // Load conversations when user signs in
  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setConversations(data); });
  }, [isSignedIn]);

  const handleNewChat = () => {
    clearMessages();
    if (sidebarOpen) toggleSidebar();
  };

  const handleSelectConversation = async (id) => {
    if (id === currentConversationId) { toggleSidebar(); return; }

    setLoading(true);
    setCurrentConversationId(id);
    setMessages([]);

    const res = await fetch(`/api/conversations/${id}/messages`);
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);

    setLoading(false);
    if (sidebarOpen) toggleSidebar();
  };

  return (
    <>
      <aside
        className={`
          sidebar-root relative z-0
          transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarOpen
            ? 'absolute top-0 left-0 bottom-0 h-screen px-5 !w-full'
            : 'w-0 border-r-0 overflow-hidden'}
        `}
      >
        <div className="flex h-full flex-col w-64">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
                AI Chat
              </span>
            </div>
            <button onClick={handleNewChat} className="btn-icon" title="New chat">
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar">
            <p className="text-[10px] uppercase tracking-widest font-semibold px-2 mb-2 text-zinc-400 dark:text-zinc-600">
              Recent
            </p>

            {!isSignedIn ? (
              <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 mt-4 px-2">
                Sign in to see history
              </p>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 mt-4 px-2">
                No conversations yet
              </p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-xs truncate cursor-pointer
                      transition-colors duration-150
                      ${currentConversationId === conv.id
                        ? 'bg-brand-50 dark:bg-brand-600 text-brand-700 dark:text-brand-200'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-neutral-100 dark:bg-neutral-950'}
                    `}
                  >
                    {conv.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-default">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton>
                  <button className="bg-purple-700 text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">Free plan</p>
              </div>
            </div>

            <button onClick={() => setSettingsOpen(true)} className="btn-ghost w-full justify-start">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className={`
          absolute top-1/2 -translate-y-1/2 z-20
          w-5 h-10 flex items-center justify-center
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-700 border-l-0
          rounded-r-lg shadow-sm
          text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200
          transition-all duration-300 cursor-pointer
          ${sidebarOpen ? 'left-[297px]' : 'left-0'}
        `}
      >
        {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
    </>
  );
}
