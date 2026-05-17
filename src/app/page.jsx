import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  return (
    <main
      className="flex overflow-hidden"
      style={{
        background: '#09090b',
        height: 'calc(100dvh - env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
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
