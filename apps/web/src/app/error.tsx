'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">500</h1>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        We encountered an unexpected error. This has been logged and we'll look into it.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#2a2a4e] transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
