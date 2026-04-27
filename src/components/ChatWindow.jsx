"use client";


import { useEffect, useRef, useCallback } from "react";
import { useUser } from '@clerk/nextjs'
import { useMediaQuery } from 'react-responsive'
import { Bot } from "lucide-react";
import useStore from "@/store/useStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

/* ─────────────────────────────────────────────────────────────
   ChatWindow
   - Renders messages list
   - Handles send → streaming from /api/chat
   - Auto-scrolls to bottom on new content
   - Stop button aborts in-flight stream
───────────────────────────────────────────────────────────── */
export default function ChatWindow() {
   const {
      messages,
      isLoading,
      addMessage,
      appendToLastMessage,
      setLoading,
      sidebarOpen
   } = useStore();
  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });
   const bottomRef = useRef(null);
   const abortRef = useRef(null); // AbortController ref for stop
  const { isSignedIn, user, isLoaded } = useUser()
   // Auto-scroll whenever messages change
   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const handleSend = useCallback(
      async content => {
         // Build new message list
         const userMessage = { role: "user", content };
         const newMessages = [...messages, userMessage];

         // Optimistically add user message + empty AI placeholder
         addMessage(userMessage);
         addMessage({ role: "assistant", content: "" });
         setLoading(true);

         // Create abort controller for stop support
         const controller = new AbortController();
         abortRef.current = controller;

         try {
            const response = await fetch("/api/chat", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ messages: newMessages }),
               signal: controller.signal
            });

            if (!response.ok) {
               const err = await response.json();
               appendToLastMessage(
                  `⚠️ Error: ${err.error || "Something went wrong."}`
               );
               return;
            }

            // Stream the response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
               const { done, value } = await reader.read();
               if (done) break;
               const chunk = decoder.decode(value, { stream: true });
               appendToLastMessage(chunk);
            }
         } catch (err) {
            if (err.name !== "AbortError") {
               appendToLastMessage("⚠️ Connection error. Please try again.");
            }
         } finally {
            setLoading(false);
            abortRef.current = null;
         }
      },
      [messages, addMessage, appendToLastMessage, setLoading]
   );

   const handleStop = useCallback(() => {
      abortRef.current?.abort();
   }, []);

   if (!sidebarOpen||(sidebarOpen && !isMobile)) {
      // ── Empty state ──────────────────────────────────────────
      if (messages.length === 0) {
         return (
            <div className="flex flex-col h-full">
               <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-600/20 flex items-center justify-center shadow-sm">
                     <Bot className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="text-center">
                  {
                    isSignedIn && (
                  <h1 className="text-2xl font-black bg-gradient-to-b from-zinc-400 to-zinc-50 bg-clip-text text-transparent">
                    Hi, {user?.firstName || user?.fullName}
                  </h1>)
                  }
                     <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        How can I help you today?
                     </h2>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Ask me anything — I&apos;m ready to assist you.
                     </p>
                  </div>

                  {/* Quick action suggestions */}
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-md">
                     {[
                        "Explain quantum computing",
                        "Write a Python function",
                        "Summarize a topic for me",
                        "Give me creative ideas"
                     ].map(suggestion => (
                        <button
                           key={suggestion}
                           onClick={() => handleSend(suggestion)}
                           className="
                  text-left px-3 py-2.5 rounded-xl text-xs
                  bg-white dark:bg-zinc-900
                  border border-zinc-200 dark:border-zinc-800
                  text-zinc-600 dark:text-zinc-400
                  hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400
                  transition-colors duration-150 cursor-pointer
                "
                        >
                           {suggestion} →
                        </button>
                     ))}
                  </div>
               </div>

               <ChatInput onSend={handleSend} onStop={handleStop} />
            </div>
         );
      }

      // ── Messages view ────────────────────────────────────────
      return (
         <div className="flex flex-col h-full">
            {/* Messages */}
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

            {/* Input */}
            <ChatInput onSend={handleSend} onStop={handleStop} />
         </div>
      );
   }
   else if (sidebarOpen && !isMobile){
     
   }
}
