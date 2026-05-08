import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

import { InstallButtonDraggable } from "@/components/InstallButton";
import InstallWindow from "@/components/InstallWindow";
import RequestFullScreen from "@/components/RequestFullScreen";

import ZoomControl from "@/controllers/ZoomControll";
import TouchControlle from "@/controllers/TouchControlle";

import GSAPInit from '@/init/GSAPInit.jsx';

export const metadata = {
  title: "AI Chat",
  description: "Your intelligent AI assistant created by Ariq Azmain",
  manifest: "/manifest.json"
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

/* Inline script injected before React hydrates — prevents
   theme flash by reading localStorage and setting the class
   on <html> synchronously before paint.                    */
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
        {/* Prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorBackground: "#000000",
              colorText: "#defeff"
            }
          }}
        >
          <ThemeProvider>
            <GSAPInit />
            <ZoomControl />
            <TouchControlle/>
            <InstallButtonDraggable />
            <RequestFullScreen/>
            {
              //<InstallWindow/>
            }
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
