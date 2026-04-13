import type { Metadata } from 'next';
import { PostalCodeLookup } from '@/components/PostalCodeLookup';

export const metadata: Metadata = {
  title: 'Find Your MP',
  description: 'Enter your postal code to find your Member of Parliament and see how they vote on the issues that matter to you.',
};

export default function FindYourMPPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Find Your MP</h1>
      <p className="text-gray-600 mb-8">
        Enter your postal code to find your Member of Parliament and see how they represent you in Ottawa.
      </p>

      <PostalCodeLookup />

      <div className="mt-12 border-t pt-8">
        <h2 className="text-lg font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">What is a recorded division?</h3>
            <p className="text-sm text-gray-600 mt-1">
              A recorded division is a formal vote where every MP&apos;s individual vote is logged by name.
              Most votes in Parliament are voice votes, but recorded divisions happen when 5 or more MPs
              request one. These are the votes Parliament Audit tracks.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Where does this data come from?</h3>
            <p className="text-sm text-gray-600 mt-1">
              MP information comes from the{' '}
              <a href="https://represent.opennorth.ca/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">
                Represent API
              </a>{' '}
              by Open North. Vote records come directly from{' '}
              <a href="https://www.ourcommons.ca" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">
                ourcommons.ca
              </a>.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Can I get notified about my MP&apos;s votes?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Yes! <a href="/subscribe" className="text-red-600 hover:text-red-800 underline">Subscribe for vote alerts</a> and
              we&apos;ll notify you every time a recorded vote happens in Parliament.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
