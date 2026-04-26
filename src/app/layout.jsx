import './globals.css';
import ThemeProvider from '@/providers/ThemeProvider';

export const metadata = {
  title: 'AI Chat',
  description: 'Your intelligent AI assistant powered by DeepSeek',
};

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
