'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { gsap } from 'gsap';
import useStore from '@/store/useStore';
import { isTouchDevice } from '@/utility';

export default function ChatInput({ onSend, onStop }) {
  const textareaRef  = useRef(null);
  const wrapperRef   = useRef(null);
  const isLoading    = useStore(s => s.isLoading);
  const [input, setInput] = useState('');

  const resize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, []);

  useEffect(() => { resize(); }, [resize]);

  // GSAP entrance
  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.fromTo(wrapperRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  const handleOnChange = e => {
    setInput(e.target.value);
    resize();
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !isTouchDevice()) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const value = textareaRef.current?.value.trim();
    if (!value || isLoading) return;

    // Send button pop animation
    gsap.fromTo('.btn-send',
      { scale: 0.9 },
      { scale: 1, duration: 0.2, ease: 'back.out(2)' }
    );

    onSend(value);
    textareaRef.current.value = '';
    setInput('');
    resize();
    textareaRef.current.focus();
  };

  return (
    <div ref={wrapperRef} className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            rows={1}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Action..."
            disabled={isLoading}
            value={input}
            className="
              flex-1 bg-transparent text-sm leading-relaxed
              text-zinc-100 placeholder:text-zinc-600
              disabled:opacity-50 max-h-[200px] overflow-y-auto
            "
          />

          {isLoading ? (
            <button
              onClick={onStop}
              title="Stop"
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #2a2a3a', color: '#888' }}
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              title="Send"
              disabled={!input.trim()}
              className="btn-send"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-center text-[10px] mt-2" style={{ color: '#3a3a50' }}>
          Action AI · © Ariq Azmain {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
