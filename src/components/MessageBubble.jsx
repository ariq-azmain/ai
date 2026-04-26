"use client";

import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message, isLast, isLoading }) {
    const isUser = message.role === "user";
    const isStreaming = isLast && isLoading && !isUser;
    const isEmpty = message.content === "" && isStreaming;

    return (
        <div
            className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Bot avatar */}
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-600/20 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
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
                        <span className="flex items-center gap-1 h-5">
                            {[0, 1, 2].map(i => (
                                <span
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-blink"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </span>
                    ) : (
                        <ReactMarkdown
                            components={{
                                // Paragraph
                                p: ({ children }) => (
                                    <p className="mb-3 last:mb-0 leading-relaxed">
                                        {children}
                                    </p>
                                ),
                                // Bold
                                strong: ({ children }) => (
                                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                                        {children}
                                    </strong>
                                ),
                                // Italic
                                em: ({ children }) => (
                                    <em className="italic">{children}</em>
                                ),
                                // Inline code
                                code: ({ inline, children }) =>
                                    inline ? (
                                        <code className="px-1.5 py-0.5 rounded-md text-[0.8em] font-mono bg-zinc-100 dark:bg-zinc-800 text-brand-600 dark:text-brand-400">
                                            {children}
                                        </code>
                                    ) : (
                                        <code>{children}</code>
                                    ),
                                // Code block
                                pre: ({ children }) => (
                                    <pre className="my-3 p-4 rounded-xl overflow-x-auto text-xs font-mono bg-zinc-900 dark:bg-zinc-950 text-zinc-100 border border-zinc-700">
                                        {children}
                                    </pre>
                                ),
                                // Unordered list
                                ul: ({ children }) => (
                                    <ul className="mb-3 ml-4 space-y-1 list-disc marker:text-zinc-400">
                                        {children}
                                    </ul>
                                ),
                                // Ordered list
                                ol: ({ children }) => (
                                    <ol className="mb-3 ml-4 space-y-1 list-decimal marker:text-zinc-400">
                                        {children}
                                    </ol>
                                ),
                                // List item
                                li: ({ children }) => (
                                    <li className="leading-relaxed">
                                        {children}
                                    </li>
                                ),
                                // Headings
                                h1: ({ children }) => (
                                    <h1 className="text-lg font-bold mb-2 mt-4 text-zinc-900 dark:text-zinc-100">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-base font-semibold mb-2 mt-3 text-zinc-900 dark:text-zinc-100">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-sm font-semibold mb-1 mt-3 text-zinc-900 dark:text-zinc-100">
                                        {children}
                                    </h3>
                                ),
                                // Horizontal rule
                                hr: () => (
                                    <hr className="my-4 border-zinc-200 dark:border-zinc-700" />
                                ),
                                // Blockquote
                                blockquote: ({ children }) => (
                                    <blockquote className="my-3 pl-3 border-l-2 border-brand-400 text-zinc-500 dark:text-zinc-400 italic">
                                        {children}
                                    </blockquote>
                                ),
                                // Link
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-600 dark:text-brand-400 underline underline-offset-2 hover:text-brand-700"
                                    >
                                        {children}
                                    </a>
                                )
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
