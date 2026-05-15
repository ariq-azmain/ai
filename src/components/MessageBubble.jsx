"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import ReactMarkdown from "react-markdown";
import { ActionIcon } from "./ActionLogo";

export default function MessageBubble({ message, isLast, isLoading }) {
  const isUser      = message.role === "user";
  const isStreaming = isLast && isLoading && !isUser;
  const isEmpty     = message.content === "" && isStreaming;
  const bubbleRef   = useRef(null);

  // GSAP entrance per message
  useEffect(() => {
    if (!bubbleRef.current) return;
    gsap.fromTo(
      bubbleRef.current,
      { opacity: 0, y: 10, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      ref={bubbleRef}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
          style={{
            background: 'linear-gradient(135deg,rgba(214,180,255,0.12) 0%,rgba(94,23,235,0.2) 100%)',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <ActionIcon size={20} />
        </div>
      )}

      {/* Bubble */}
      {isUser ? (
        <div className="msg-user">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      ) : (
        <div className={`msg-ai ${isStreaming ? "cursor-blink" : ""}`}>
          {isEmpty ? (
            /* Thinking dots */
            <span className="flex items-center gap-1.5 h-5 pl-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-blink"
                  style={{
                    background: 'linear-gradient(135deg,#AC6AFF,#7c3aed)',
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </span>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed text-zinc-200">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-zinc-300">{children}</em>
                ),
                code: ({ inline, children }) =>
                  inline ? (
                    <code
                      className="px-1.5 py-0.5 rounded-md text-[0.8em] font-mono"
                      style={{ background: 'rgba(124,58,237,0.2)', color: '#D6B4FF', border: '1px solid rgba(124,58,237,0.25)' }}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className="text-zinc-200">{children}</code>
                  ),
                pre: ({ children }) => (
                  <pre
                    className="my-3 p-4 rounded-xl overflow-x-auto text-xs font-mono text-zinc-200"
                    style={{ background: '#0f0f12', border: '1px solid #2a2a3a' }}
                  >
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 ml-4 space-y-1 list-disc marker:text-purple-500">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 ml-4 space-y-1 list-decimal marker:text-purple-500">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed text-zinc-300">{children}</li>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2 mt-4 text-white">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mb-2 mt-3 text-white">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mb-1 mt-3 text-zinc-200">{children}</h3>
                ),
                hr: () => (
                  <hr className="my-4" style={{ borderColor: '#2a2a3a' }} />
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="my-3 pl-4 italic text-zinc-400"
                    style={{ borderLeft: '2px solid #7c3aed' }}
                  >
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 transition-colors"
                    style={{ color: '#AC6AFF' }}
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full text-xs text-left" style={{ borderCollapse: 'collapse' }}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 text-zinc-300 font-semibold"
                      style={{ borderBottom: '1px solid #2a2a3a', background: '#18181f' }}>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-zinc-400"
                      style={{ borderBottom: '1px solid #1e1e2a' }}>
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      )}
    </div>
  );
}
