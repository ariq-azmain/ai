import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import {
    ClerkProvider,
    Show,
    SignInButton,
    SignUpButton,
    UserButton
} from "@clerk/nextjs";

import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import InstallButton from "@/components/InstallButton";
import InstallWindow from "@/components/InstallWindow";
import ZoomControl from "@/controllers/ZoomControll";

export const metadata = {
    title: "AI Chat",
    description: "Your intelligent AI assistant created by Ariq Azmain",
    manifest: "/manifest.json"
};
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};
gsap.registerPlugin(Draggable);
/* Inline script injected before React hydrates — prevents
   theme flash by reading localStorage and setting the class
   on <html> synchronously before paint.                    */
const themeScript = `
(function () {
  try {
    var stored = JSON.parse(localStorage.getItem('ai-chat-storage') || '{}');
    var theme = stored?.state?.theme || 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
                        baseTheme: dark
                    }}
                >
                    <ThemeProvider>
                        <ZoomControl />
                        <InstallButton />
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
