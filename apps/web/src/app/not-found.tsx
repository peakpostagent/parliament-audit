import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#2a2a4e] transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/archive"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
