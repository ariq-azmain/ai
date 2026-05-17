import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/next"


import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { InstallButtonDraggable } from "@/components/InstallButton";
import RequestFullScreen from "@/components/RequestFullScreen";
import ZoomControl from "@/controllers/ZoomControll";
import TouchControlle from "@/controllers/TouchControlle";
import GSAPInit from '@/init/GSAPInit.jsx';

export const metadata = {
  title: "Action AI",
  description: "Your intelligent AI assistant created by Ariq Azmain",
  manifest: "/manifest.json"
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const themeScript = `
(function () {
  try {
    let stored = JSON.parse(localStorage.getItem('ai-chat-storage') || '{}');
    let theme = stored?.state?.theme || 'system';
    let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorBackground:        '#0f0f12',
              colorInputBackground:   '#18181f',
              colorInputText:         '#f4f4f5',
              colorText:              '#f4f4f5',
              colorTextSecondary:     '#71717a',
              colorPrimary:           '#7c3aed',
              colorDanger:            '#ef4444',
              colorSuccess:           '#22c55e',
              borderRadius:           '0.75rem',
              fontFamily:             'Plus Jakarta Sans, sans-serif',
            },
            elements: {
              /* Card / modal */
              card:                   'bg-[#0f0f12] border border-[#2a2a3a] shadow-2xl',
              /* Header */
              headerTitle:            'text-white font-bold',
              headerSubtitle:         'text-zinc-400',
              /* Social buttons */
              socialButtonsBlockButton: 'border-[#2a2a3a] bg-[#18181f] text-zinc-200 hover:bg-[#222230]',
              socialButtonsBlockButtonText: 'text-zinc-200 font-medium',
              /* Divider */
              dividerLine:            'bg-[#2a2a3a]',
              dividerText:            'text-zinc-600',
              /* Input */
              formFieldInput:         'bg-[#18181f] border-[#2a2a3a] text-zinc-100 focus:border-[#7c3aed]',
              formFieldLabel:         'text-zinc-400 text-sm',
              /* Primary button */
              formButtonPrimary:      'bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium',
              /* Footer links */
              footerActionLink:       'text-[#AC6AFF] hover:text-[#D6B4FF]',
              /* Internal links */
              identityPreviewEditButton: 'text-[#AC6AFF]',
            },
          }}
        >
          <ThemeProvider>
            <GSAPInit />
            <ZoomControl />
            <TouchControlle />
            <InstallButtonDraggable />
            {children}
            <Analytics/>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
