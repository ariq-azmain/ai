"use client";

import { useEffect, useRef, useCallback } from "react";
import { useUser } from '@clerk/nextjs';
import { Bot } from "lucide-react";
import useStore from "@/store/useStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const {
    messages, isLoading,
    addMessage, appendToLastMessage, setLoading,
    setMessages,
    sidebarOpen,
    currentConversationId, setCurrentConversationId,
    addConversation, updateConversationTime,
  } = useStore();

  const bottomRef = useRef(null);
  const abortRef = useRef(null);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Refresh করলে currentConversationId থেকে messages reload করো
  useEffect(() => {
    if (!currentConversationId || messages.length > 0) return;
    setLoading(true);
    fetch(`/api/conversations/${currentConversationId}/messages`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMessages(data); })
      .finally(() => setLoading(false));
  }, [currentConversationId]);

  const handleSend = useCallback(async (content) => {
    const userMessage = { role: "user", content };
    const newMessages = [...messages, userMessage];

    addMessage(userMessage);
    addMessage({ role: "assistant", content: "" });
    setLoading(true);

    let convId = currentConversationId;

    if (!convId && isSignedIn) {
      const title = content.slice(0, 50);
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
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
        appendToLastMessage(`⚠️ Error: ${err.error || "Something went wrong."}`);
        return;
      }

      const reader = response.body.getReader();
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

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-600/20 flex items-center justify-center shadow-sm">
            <Bot className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="text-center">
            {isSignedIn && (
              <h1 className="text-2xl font-black bg-gradient-to-b from-zinc-400 to-zinc-50 bg-clip-text text-transparent">
                Hi, {user?.firstName || user?.fullName}
              </h1>
            )}
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              How can I help you today?
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Ask me anything — I&apos;m ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-md">
            {["Explain quantum computing", "Write a Python function", "Summarize a topic for me", "Give me creative ideas"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="text-left px-3 py-2.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150 cursor-pointer"
                >
                  {suggestion} →
                </button>
              )
            )}
          </div>
        </div>
        <ChatInput onSend={handleSend} onStop={handleStop} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isLast={index === messages.length - 1}
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
