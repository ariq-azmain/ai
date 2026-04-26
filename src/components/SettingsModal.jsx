'use client';

import { X, Sun, Moon, Monitor } from 'lucide-react';
import useStore from '@/store/useStore';

/* ─────────────────────────────────────────────────────────────
   SettingsModal
   Currently only contains theme switcher.
   More settings will be added later.
───────────────────────────────────────────────────────────── */

const THEMES = [
  {
    id: 'light',
    label: 'Light',
    Icon: Sun,
    preview: 'bg-white border-zinc-200',
    iconColor: 'text-amber-500',
  },
  {
    id: 'dark',
    label: 'Dark',
    Icon: Moon,
    preview: 'bg-zinc-900 border-zinc-700',
    iconColor: 'text-indigo-400',
  },
  {
    id: 'system',
    label: 'System',
    Icon: Monitor,
    preview: 'bg-gradient-to-br from-white to-zinc-900 border-zinc-400',
    iconColor: 'text-zinc-500',
  },
];

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, theme, setTheme } = useStore();

  if (!settingsOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Settings
          </h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="btn-icon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme section */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Appearance
          </p>

          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ id, label, Icon, preview, iconColor }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`theme-option ${theme === id ? 'active' : ''}`}
              >
                {/* Mini preview */}
                <div
                  className={`
                    w-full h-12 rounded-lg border-2
                    ${preview}
                    ${theme === id ? 'border-brand-500' : 'border-transparent'}
                    transition-all duration-150
                  `}
                />
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="my-5 border-zinc-200 dark:border-zinc-800" />

        {/* Placeholder sections — to be built later */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Coming Soon
          </p>
          {['Account', 'Integrations', 'API Keys', 'Usage'].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{item}</span>
              <span className="badge">Soon</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
