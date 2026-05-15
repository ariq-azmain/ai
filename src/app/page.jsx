import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  return (
    <main className="flex h-dvh overflow-hidden" style={{ background: '#09090b' }}>
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
