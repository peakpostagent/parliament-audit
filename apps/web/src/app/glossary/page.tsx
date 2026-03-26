import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossary — Parliament Pulse',
  description: 'Plain-English definitions of Canadian parliamentary terms.',
};

const GLOSSARY_TERMS = [
  { term: 'Recorded Division', definition: 'A formal vote in Parliament where each member\'s individual vote (Yea, Nay, or Paired) is recorded by name. This is what Parliament Pulse tracks.' },
  { term: 'First Reading', definition: 'The introduction of a bill in Parliament. This is usually a formality — there is no debate or vote at first reading.' },
  { term: 'Second Reading', definition: 'The first major debate on a bill. MPs debate the general principles of the bill. If it passes second reading, it goes to committee for detailed study.' },
  { term: 'Committee Stage', definition: 'A parliamentary committee studies the bill in detail, hears witnesses, and may propose amendments. The committee then reports the bill back to the House.' },
  { term: 'Report Stage', definition: 'After committee study, the full House considers any amendments proposed by the committee or by individual MPs. Multiple votes may occur at report stage.' },
  { term: 'Third Reading', definition: 'The final vote on a bill in one chamber. If it passes, the bill is sent to the other chamber (Senate or House). Third reading votes are among the most significant.' },
  { term: 'Royal Assent', definition: 'The final step. After both the House and Senate pass a bill in identical form, the Governor General grants Royal Assent, and the bill becomes law.' },
  { term: 'Amendment', definition: 'A proposed change to the text of a bill or motion. Amendments must be voted on separately before the main question.' },
  { term: 'Time Allocation', definition: 'A government motion that limits the amount of time for debate on a bill or motion. Often controversial, as opposition parties may view it as cutting off debate.' },
  { term: 'Closure', definition: 'A procedural motion that ends debate and forces an immediate vote. Similar to time allocation but more abrupt.' },
  { term: 'Supply / Appropriation', definition: 'Votes that authorize government spending. Supply votes are traditionally considered matters of confidence — if the government loses one, it may trigger an election.' },
  { term: 'Ways and Means', definition: 'A motion that authorizes the government to introduce tax legislation. Must be passed before a tax bill can be introduced.' },
  { term: 'Confidence Vote', definition: 'A vote where the government\'s ability to continue governing is at stake. Losing a confidence vote typically triggers an election or a change of government.' },
  { term: 'Paired', definition: 'When two MPs from opposing sides agree not to vote, cancelling each other out. This allows MPs to miss a vote without affecting the outcome.' },
  { term: 'Private Member\'s Bill', definition: 'A bill introduced by an MP who is not a cabinet minister. These bills have limited debate time and a lower chance of becoming law, but some do pass.' },
  { term: 'Concurrence Motion', definition: 'A motion asking the House to agree with (concur in) a committee report or an action taken by the Senate.' },
  { term: 'Hansard', definition: 'The official transcript of everything said in Parliament. Named after the British printer Thomas Hansard.' },
  { term: 'Journals', definition: 'The official record of decisions and proceedings of the House of Commons (similar to meeting minutes).' },
  { term: 'Sitting', definition: 'A single day\'s session of Parliament. Multiple votes can occur in a single sitting.' },
  { term: 'Session', definition: 'The period from the opening of Parliament (usually with a Throne Speech) until prorogation or dissolution. A parliament can have multiple sessions.' },
  { term: 'Parliament', definition: 'The period from one general election to the next dissolution. We are currently in the 45th Parliament of Canada.' },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Parliamentary Glossary</h1>
      <p className="text-gray-600 mb-8">
        Plain-English definitions of the parliamentary terms you'll see on Parliament Pulse.
      </p>

      <div className="space-y-4">
        {GLOSSARY_TERMS.map((item) => (
          <div key={item.term} className="border-b pb-4" id={item.term.toLowerCase().replace(/\s+/g, '-')}>
            <dt className="font-bold text-lg">{item.term}</dt>
            <dd className="text-gray-700 mt-1">{item.definition}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
