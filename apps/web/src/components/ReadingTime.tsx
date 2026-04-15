const WORDS_PER_MINUTE = 230;

export function calculateReadingMinutes(text: string): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

interface Props {
  text: string;
  className?: string;
}

/**
 * Displays estimated reading time based on a standard 230 wpm.
 * Pass the combined article body text.
 */
export function ReadingTime({ text, className = '' }: Props) {
  const minutes = calculateReadingMinutes(text);
  return (
    <span className={className}>
      {minutes} min read
    </span>
  );
}
