import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parliament Pulse — Canada deserves to know.',
  description: 'Track every vote in Canada\'s Parliament. Non-partisan. Factual. Transparent. See how each party voted on bills, motions, and amendments.',
  openGraph: {
    title: 'Parliament Pulse',
    description: 'Track every vote in Canada\'s Parliament. Non-partisan. Factual. Transparent.',
    siteName: 'Parliament Pulse',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parliament Pulse',
    description: 'Track every vote in Canada\'s Parliament.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-[#1a1a2e] text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <a href="/" className="text-xl font-bold tracking-tight">
            Parliament Pulse
          </a>
          <p className="text-sm text-gray-300 mt-0.5">Canada deserves to know.</p>
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="/" className="hover:text-red-400 transition-colors">Latest</a>
          <a href="/archive" className="hover:text-red-400 transition-colors">Archive</a>
          <a href="/about" className="hover:text-red-400 transition-colors">About</a>
          <a href="/methodology" className="hover:text-red-400 transition-colors">Methodology</a>
          <a href="/glossary" className="hover:text-red-400 transition-colors">Glossary</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-2">Parliament Pulse</h3>
            <p className="text-sm text-gray-600">
              Non-partisan parliamentary vote tracking. We report the record. You decide what it means.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Links</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="/about" className="hover:text-red-600">About Us</a></li>
              <li><a href="/methodology" className="hover:text-red-600">Our Methodology</a></li>
              <li><a href="/corrections" className="hover:text-red-600">Corrections</a></li>
              <li><a href="/glossary" className="hover:text-red-600">Glossary</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Official Sources</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="https://www.ourcommons.ca" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">House of Commons</a></li>
              <li><a href="https://sencanada.ca" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">Senate of Canada</a></li>
              <li><a href="https://www.parl.ca/legisinfo" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">LEGISinfo</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
          Parliament Pulse is an independent civic project. Not affiliated with the Government of Canada.
        </div>
      </div>
    </footer>
  );
}
