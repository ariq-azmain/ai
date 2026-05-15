'use client';

import { useEffect, useRef } from 'react';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { MessageSquarePlus, Settings, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '@/store/useStore';
import { ActionWordmark, ActionIcon } from '@/components/ActionLogo';

export default function Sidebar() {
  const {
    sidebarOpen, toggleSidebar,
    clearMessages, setSettingsOpen,
    conversations, setConversations,
    currentConversationId, setCurrentConversationId,
    setMessages, setLoading,
  } = useStore();

  const { isSignedIn, user } = useUser();
  const listRef  = useRef(null);
  const logoRef  = useRef(null);

  // Load conversations
  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setConversations(data); });
  }, [isSignedIn]);

  // Animate conversations list on load
  useEffect(() => {
    if (!listRef.current || !conversations.length) return;
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
    );
  }, [conversations.length]);

  // Animate sidebar open
  useEffect(() => {
    if (!logoRef.current) return;
    if (sidebarOpen) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [sidebarOpen]);

  const handleNewChat = () => {
    clearMessages();
    if (sidebarOpen) toggleSidebar();
  };

  const handleSelectConversation = async (id) => {
    if (id === currentConversationId) { toggleSidebar(); return; }
    setLoading(true);
    setCurrentConversationId(id);
    setMessages([]);
    const res  = await fetch(`/api/conversations/${id}/messages`);
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
    setLoading(false);
    if (sidebarOpen) toggleSidebar();
  };

  return (
    <>
      {/* ── Panel ─────────────────────────────────────────── */}
      <aside
        className={`
          sidebar-root relative z-10 flex-shrink-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen
            ? 'absolute top-0 left-0 bottom-0 h-screen !w-full sm:!w-72 z-30'
            : 'w-0 border-r-0 overflow-hidden'}
        `}
      >
        <div className="flex h-full flex-col w-full sm:w-72">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4"
               style={{ borderBottom: '1px solid #1e1e2a' }}>
            <div ref={logoRef}>
              <ActionWordmark width={130} />
            </div>
            <button
              onClick={handleNewChat}
              className="btn-icon"
              title="New chat"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold px-2 mb-3"
               style={{ color: '#3a3a50' }}>
              Conversations
            </p>

            {!isSignedIn ? (
              <div className="flex flex-col items-center gap-3 mt-8 px-4 text-center">
                <LogIn className="w-8 h-8" style={{ color: '#3a3a50' }} />
                <p className="text-xs" style={{ color: '#3a3a50' }}>
                  Sign in to save your chat history
                </p>
                <SignInButton>
                  <button className="text-xs px-4 py-2 rounded-xl cursor-pointer transition-all duration-150"
                          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#AC6AFF' }}>
                    Sign in
                  </button>
                </SignInButton>
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-center mt-6 px-2" style={{ color: '#3a3a50' }}>
                No conversations yet.<br />Start a new chat!
              </p>
            ) : (
              <div ref={listRef} className="space-y-1">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`conv-item ${currentConversationId === conv.id ? 'active' : ''}`}
                  >
                    {conv.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid #1e1e2a' }}>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl transition-colors cursor-default"
                 style={{ ':hover': { background: 'rgba(255,255,255,0.04)' } }}>
              <Show when="signed-out">
                <div className="flex gap-2 w-full">
                  <SignInButton>
                    <button className="flex-1 text-xs py-2 rounded-xl cursor-pointer transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a3a', color: '#888' }}>
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="flex-1 text-xs py-2 rounded-xl cursor-pointer transition-all"
                            style={{ background: 'linear-gradient(135deg,#AC6AFF,#7c3aed)', color: '#fff' }}>
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {user?.firstName || user?.fullName}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#3a3a50' }}>Free plan</p>
                </div>
              </Show>
            </div>

            <button onClick={() => setSettingsOpen(true)} className="btn-ghost w-full justify-start">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 sm:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={toggleSidebar}
        />
      )}

      {/* ── Toggle button ───────────────────────────────────── */}
      <button
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Close' : 'Open sidebar'}
        className={`
          absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer
          w-5 h-12 flex items-center justify-center
          rounded-r-lg transition-all duration-300
          ${sidebarOpen ? 'left-72' : 'left-0'}
        `}
        style={{
          background: '#18181f',
          border: '1px solid #1e1e2a',
          borderLeft: 'none',
          color: '#3a3a50',
        }}
      >
        {sidebarOpen
          ? <ChevronLeft className="w-3 h-3" />
          : <ChevronRight className="w-3 h-3" />}
      </button>
    </>
  );
}
