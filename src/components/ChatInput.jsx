'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import useStore from '@/store/useStore';
import { isTouchDevice } from '@/utility'
/* Touch device detection — much more reliable than screen width.
   Returns true for phones/tablets regardless of zoom level.
   Uses maxTouchPoints (all modern browsers) with ontouchstart as fallback. */


export default function ChatInput({ onSend, onStop }) {
  const textareaRef = useRef(null);
  const isLoading   = useStore((state) => state.isLoading);
  const [input, setInput] = useState('');

  const resize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, []);

  const handleOnChange = (e) => {
    setInput(e?.target?.value);
    resize();
  };

  useEffect(() => {
    resize();
  }, [resize]);

  const handleKeyDown = (e) => {
    // Enter sends only on non-touch devices (desktop/laptop)
    // On touch devices (mobile/tablet) Enter = newline, user taps the button
    if (e.key === 'Enter' && !e.shiftKey && !isTouchDevice()) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const value = textareaRef.current?.value.trim();
    if (!value || isLoading) return;

    onSend(value);
    textareaRef.current.value = '';
    setInput('');
    resize();
    textareaRef.current.focus();
  };

  return (
    <div className="px-4 py-4">
      <div className="max-w-3xl mx-auto max-w-[500px]">
        <div className="input-wrapper">
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
                ${input === '' ? 'opacity-65' : 'opacity-100'}
              `}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
          AI can make mistakes.<br />
          <b>©</b> Ariq Azmain 2026 {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
