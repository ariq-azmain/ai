'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { ArrowUp, Square } from 'lucide-react';
import useStore from '@/store/useStore';

/* ─────────────────────────────────────────────────────────────
   ChatInput
   - Auto-growing textarea (max 200px)
   - Send on Enter (Shift+Enter = newline)
   - Disabled while streaming
   - Stop button while AI is responding
───────────────────────────────────────────────────────────── */
export default function ChatInput({ onSend, onStop }) {
  const textareaRef = useRef(null);
  const isLoading = useStore((state) => state.isLoading);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [input, setInput] = useState('')
  // Auto-resize textarea
  const resize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, []);
  const handleOnChange = (e) => {
    setInput(e?.target?.value)
    resize()
  }
  useEffect(() => {
    resize();
  }, [resize]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const value = textareaRef.current?.value.trim();
    if (!value || isLoading) return;

    onSend(value);
    textareaRef.current.value = '';
    setInput('')
    resize();
    textareaRef.current.focus();
  };

  return (
    <div className="px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="input-wrapper">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            placeholder="Message AI..."
            disabled={isLoading}
            value={input}
            className="
              flex-1 bg-transparent text-sm leading-relaxed
              text-zinc-900 dark:text-zinc-100
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              disabled:opacity-60
              max-h-[200px] overflow-y-auto
            "
          />

          {/* Send / Stop button */}
          {isLoading ? (
            <button
              onClick={onStop}
              title="Stop generating"
              className="
                flex-shrink-0 w-8 h-8 rounded-xl
                bg-zinc-200 dark:bg-zinc-700
                hover:bg-zinc-300 dark:hover:bg-zinc-600
                flex items-center justify-center
                text-zinc-700 dark:text-zinc-300
                transition-colors duration-150 cursor-pointer
              "
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              title="Send message"
              className={`
                flex-shrink-0 w-8 h-8 rounded-xl
                hover:bg-brand-700
                flex items-center justify-center
                text-white transition-all duration-500
                cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                bg-brand-600
                ${input===''?'opacity-65':'opacity-100'}
              `}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
          AI can make mistakes.<br/>
          <b>©</b> Ariq Azmain {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
