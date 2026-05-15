"use client";

import { useEffect, useRef, useCallback } from "react";
import { useUser } from '@clerk/nextjs';
import { gsap } from 'gsap';
import useStore from "@/store/useStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { ActionIcon } from "./ActionLogo";

const SUGGESTIONS = [
  { label: "Explain a concept",   prompt: "Explain quantum computing in simple terms" },
  { label: "Write code",          prompt: "Write a Python function to sort a list of dicts" },
  { label: "Summarize",           prompt: "Summarize the key ideas of stoic philosophy" },
  { label: "Creative ideas",      prompt: "Give me 5 unique startup ideas for 2025" },
];

export default function ChatWindow() {
  const {
    messages, isLoading,
    addMessage, appendToLastMessage, setLoading,
    setMessages, sidebarOpen,
    currentConversationId, setCurrentConversationId,
    addConversation, updateConversationTime,
  } = useStore();

  const bottomRef    = useRef(null);
  const abortRef     = useRef(null);
  const heroRef      = useRef(null);
  const logoRef      = useRef(null);
  const chipsRef     = useRef(null);
  const greetRef     = useRef(null);

  const { isSignedIn, user } = useUser();

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reload on refresh
  useEffect(() => {
    if (!currentConversationId || messages.length > 0) return;
    setLoading(true);
    fetch(`/api/conversations/${currentConversationId}/messages`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data); })
      .finally(() => setLoading(false));
  }, [currentConversationId]);

  // GSAP hero entrance animation
  useEffect(() => {
    if (messages.length > 0 || !heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Logo float + glow pulse
    tl.fromTo(logoRef.current,
      { scale: 0.7, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7 }
    )
    .fromTo(greetRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    )
    .fromTo(chipsRef.current?.children ?? [],
      { opacity: 0, y: 12, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.07 },
      '-=0.2'
    );

    // Continuous float for logo
    gsap.to(logoRef.current, {
      y: -8,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.7,
    });
  }, [messages.length]);

  const handleSend = useCallback(async (content) => {
    const userMessage = { role: "user", content };
    const newMessages = [...messages, userMessage];

    addMessage(userMessage);
    addMessage({ role: "assistant", content: "" });
    setLoading(true);

    let convId = currentConversationId;

    if (!convId && isSignedIn) {
      const res  = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: content.slice(0, 50) }),
      });
      const conv = await res.json();
      if (conv?.id) {
        convId = conv.id;
        setCurrentConversationId(conv.id);
        addConversation(conv);
      }
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, conversationId: convId }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json();
        appendToLastMessage(`⚠️ ${err.error || "Something went wrong."}`);
        return;
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToLastMessage(decoder.decode(value, { stream: true }));
      }

      if (convId) updateConversationTime(convId);

    } catch (err) {
      if (err.name !== "AbortError") {
        appendToLastMessage("⚠️ Connection error. Please try again.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages, addMessage, appendToLastMessage, setLoading, currentConversationId, isSignedIn]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const isMobile = typeof window !== 'undefined' && navigator.maxTouchPoints > 0;
  if (sidebarOpen && isMobile) return null;

  /* ── Empty state ─────────────────────────────── */
  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div ref={heroRef} className="flex-1 flex flex-col items-center justify-center gap-6 px-6">

          {/* Logo with glow ring */}
          <div
            ref={logoRef}
            className="relative flex items-center justify-center w-20 h-20 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg,rgba(214,180,255,0.12) 0%,rgba(94,23,235,0.18) 100%)',
              border: '1px solid rgba(124,58,237,0.25)',
              boxShadow: '0 0 40px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <ActionIcon size={44} />
            {/* Glow pulse ring */}
            <div className="absolute inset-0 rounded-2xl animate-pulse-ring pointer-events-none" />
          </div>

          {/* Greeting */}
          <div ref={greetRef} className="text-center space-y-2">
            {isSignedIn && (
              <p className="text-sm font-medium" style={{ color: '#6b6b80' }}>
                Welcome back,{' '}
                <span className="text-gradient-brand font-semibold">
                  {user?.firstName || user?.fullName}
                </span>
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              What can I help<br />you with today?
            </h1>
            <p className="text-sm" style={{ color: '#4a4a60' }}>
              Powered by Llama 3.3 · 70B
            </p>
          </div>

          {/* Suggestion chips */}
          <div ref={chipsRef} className="grid grid-cols-2 gap-2 w-full max-w-md mt-2">
            {SUGGESTIONS.map(({ label, prompt }) => (
              <button
                key={label}
                onClick={() => handleSend(prompt)}
                className="prompt-chip text-left"
              >
                <span className="block font-medium text-zinc-300 mb-0.5">{label}</span>
                <span className="block text-[11px] leading-relaxed" style={{ color: '#4a4a60' }}>
                  {prompt.slice(0, 38)}…
                </span>
              </button>
            ))}
          </div>
        </div>

        <ChatInput onSend={handleSend} onStop={handleStop} />
      </div>
    );
  }

  /* ── Messages view ──────────────────────────── */
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              isLast={i === messages.length - 1}
              isLoading={isLoading}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={handleSend} onStop={handleStop} />
    </div>
  );
}
