import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parliament Pulse — Editor Dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-[#1a1a2e] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="font-bold text-lg">PP Admin</a>
            <nav className="flex gap-4 text-sm text-gray-300">
              <a href="/" className="hover:text-white">Review Queue</a>
              <a href="/corrections" className="hover:text-white">Corrections</a>
              <a href="/analytics" className="hover:text-white">Analytics</a>
              <a href="/settings" className="hover:text-white">Settings</a>
            </nav>
          </div>
          <div className="text-sm text-gray-400">Editor Dashboard</div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
