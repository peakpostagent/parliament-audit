import type { Metadata } from 'next';
import Link from 'next/link';
import { MobileNav } from '@/components/MobileNav';
import { Analytics } from '@/components/Analytics';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://parliamentaudit.ca'),
  title: {
    default: 'Parliament Audit — Canada deserves to know.',
    template: '%s — Parliament Audit',
  },
  description: 'Track every vote in Canada\'s Parliament. Non-partisan. Factual. Transparent. See how each party voted on bills, motions, and amendments.',
  openGraph: {
    title: 'Parliament Audit',
    description: 'Track every vote in Canada\'s Parliament. Non-partisan. Factual. Transparent.',
    siteName: 'Parliament Audit',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ParliamentAudit',
    creator: '@ParliamentAudit',
    title: 'Parliament Audit',
    description: 'Track every vote in Canada\'s Parliament.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Parliament Audit',
              url: 'https://parliamentaudit.ca',
              description: 'Non-partisan parliamentary vote tracking for Canada.',
              sameAs: [
                'https://x.com/ParliamentAudit',
                'https://bsky.app/profile/parliamentaudit.bsky.social',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-[#1a1a2e] focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-[#1a1a2e] text-white relative">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            Parliament Audit
          </Link>
          <p className="text-sm text-gray-300 mt-0.5">Canada deserves to know.</p>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-red-400 transition-colors">Latest</Link>
          <Link href="/news" className="hover:text-red-400 transition-colors">News</Link>
          <Link href="/archive" className="hover:text-red-400 transition-colors">Archive</Link>
          <Link href="/find-your-mp" className="hover:text-red-400 transition-colors">Find Your MP</Link>
          <Link href="/about" className="hover:text-red-400 transition-colors">About</Link>
          <Link href="/methodology" className="hover:text-red-400 transition-colors">Methodology</Link>
          <Link href="/subscribe" className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-white font-medium transition-colors">Subscribe</Link>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-2">Parliament Audit</h3>
            <p className="text-sm text-gray-600">
              Non-partisan parliamentary vote tracking. We report the record. You decide what it means.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Links</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><Link href="/news" className="hover:text-red-600">News</Link></li>
              <li><Link href="/about" className="hover:text-red-600">About Us</Link></li>
              <li><Link href="/find-your-mp" className="hover:text-red-600">Find Your MP</Link></li>
              <li><Link href="/methodology" className="hover:text-red-600">Our Methodology</Link></li>
              <li><Link href="/corrections" className="hover:text-red-600">Corrections</Link></li>
              <li><Link href="/glossary" className="hover:text-red-600">Glossary</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Official Sources</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="https://www.ourcommons.ca" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">House of Commons</a></li>
              <li><a href="https://sencanada.ca" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">Senate of Canada</a></li>
              <li><a href="https://www.parl.ca/legisinfo" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">LEGISinfo</a></li>
            </ul>
            <h3 className="font-bold mt-4 mb-2">Follow Us</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="https://x.com/ParliamentAudit" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
              <li><a href="https://bsky.app/profile/parliamentaudit.bsky.social" className="hover:text-red-600" target="_blank" rel="noopener noreferrer">Bluesky</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
          Parliament Audit is an independent civic project. Not affiliated with the Government of Canada.
        </div>
      </div>
    </footer>
  );
}
