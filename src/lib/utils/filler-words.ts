const FILLER_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\behm+\b/gi, label: "ehm" },
  { pattern: /\bhmm+\b/gi, label: "hmm" },
  { pattern: /\bééé+\b/gi, label: "ééé" },
  { pattern: /\bjako\b/gi, label: "jako" },
  { pattern: /\bprostě\b/gi, label: "prostě" },
  { pattern: /\bvlastně\b/gi, label: "vlastně" },
  { pattern: /\btakže\b/gi, label: "takže" },
  { pattern: /\bjakože\b/gi, label: "jakože" },
  { pattern: /\bteda\b/gi, label: "teda" },
  { pattern: /\bže jo\b/gi, label: "že jo" },
  { pattern: /\bviď\b/gi, label: "viď" },
];

export interface FillerWordCount {
  word: string;
  count: number;
}

export function countFillerWords(transcript: string): FillerWordCount[] {
  const counts: Record<string, number> = {};

  for (const { pattern, label } of FILLER_PATTERNS) {
    const matches = transcript.match(pattern);
    if (matches) {
      counts[label] = (counts[label] || 0) + matches.length;
    }
  }

  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
