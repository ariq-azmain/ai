import { X, Sun, Moon, Monitor } from 'lucide-react';

export const THEMES = [
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
