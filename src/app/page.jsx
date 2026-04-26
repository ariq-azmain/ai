import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  return (
    // h-dvh = dynamic viewport height — adjusts when mobile keyboard opens/closes
    // fixes input scrolling off screen on mobile
    <main className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div className="relative flex-shrink-0 flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow />
      </div>

      <SettingsModal />
    </main>
  );
}
