'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { approveArticle, requestEdits, rejectArticle } from '../../actions';

interface ReviewActionsProps {
  articleId: string;
}

const CHECKLIST_ITEMS = [
  'Vote totals verified against source',
  'Party positions match data',
  'Bill number/title correct',
  'No partisan language',
  'All sources verified',
  'Headline is accurate',
  'Summary is factual',
];

export function ReviewActions({ articleId }: ReviewActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState('');
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const allChecked = checked.every(Boolean);

  function toggleCheck(index: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function handleAction(action: 'approve' | 'edits' | 'reject') {
    if (action === 'approve' && !allChecked) {
      setResult({ type: 'error', message: 'Complete all checklist items before approving.' });
      return;
    }

    startTransition(async () => {
      try {
        if (action === 'approve') {
          await approveArticle(articleId, notes);
          setResult({ type: 'success', message: 'Article approved and published.' });
        } else if (action === 'edits') {
          await requestEdits(articleId, notes);
          setResult({ type: 'success', message: 'Edits requested. Article moved back to drafts.' });
        } else {
          await rejectArticle(articleId, notes);
          setResult({ type: 'success', message: 'Article rejected.' });
        }
        setTimeout(() => router.push('/'), 1500);
      } catch {
        setResult({ type: 'error', message: 'Action failed. Please try again.' });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Checklist */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-bold text-sm mb-2">Editor Checklist</h3>
        <div className="space-y-2">
          {CHECKLIST_ITEMS.map((item, i) => (
            <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
                checked={checked[i]}
                onChange={() => toggleCheck(i)}
              />
              <span className={checked[i] ? 'text-gray-600' : ''}>{item}</span>
            </label>
          ))}
        </div>
        {!allChecked && (
          <p className="text-xs text-amber-600 mt-2">
            {checked.filter(Boolean).length}/{CHECKLIST_ITEMS.length} completed
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white border rounded-lg p-4 space-y-2">
        <h3 className="font-bold text-sm mb-2">Actions</h3>

        {result && (
          <div className={`text-sm p-2 rounded ${result.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.message}
          </div>
        )}

        <button
          onClick={() => handleAction('approve')}
          disabled={isPending || !allChecked}
          className="w-full bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Processing...' : 'Approve & Publish'}
        </button>
        <button
          onClick={() => handleAction('edits')}
          disabled={isPending}
          className="w-full bg-amber-500 text-white px-4 py-2 rounded font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          Request Edits
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isPending}
          className="w-full bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Reject
        </button>
        <textarea
          placeholder="Review notes..."
          className="w-full border rounded p-2 text-sm mt-2"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
}
