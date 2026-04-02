import VideoGrid from '../components/VideoGrid';
import AgeVerification from '../components/AgeVerification';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="max-w-7xl mx-auto">
        <header className="bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <nav className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold text-white">PornHub Clone</h1>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Upload
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Login
              </button>
            </div>
          </nav>
        </header>
        
        <AgeVerification>
          <VideoGrid />
        </AgeVerification>
      </div>
    </main>
  );
}
