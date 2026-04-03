// 0. Zvuková výplňová slova (always filler)
// Hesitation sounds — always parasitic, no contextual ambiguity.
const SOUND_FILLERS: FillerPattern[] = [
  { pattern: /\behm+\b/gi, label: "ehm" },
  { pattern: /\bhmm+\b/gi, label: "hmm" },
  { pattern: /\bééé+\b/gi, label: "ééé" },
];

// 1. Zástupná a zjemňující slova (always filler in spoken context)
// Placeholder/softening words — extremely common in both business and casual speech.
const PLACEHOLDER_FILLERS: FillerPattern[] = [
  { pattern: /\bjako\b/gi, label: "jako" },
  { pattern: /\bprostě\b/gi, label: "prostě" },
  { pattern: /\bvlastně\b/gi, label: "vlastně" },
  { pattern: /\btakže\b/gi, label: "takže" },
  { pattern: /\bjakože\b/gi, label: "jakože" },
  { pattern: /\bteda\b/gi, label: "teda" },
  { pattern: /\bjakoby\b/gi, label: "jakoby" },
  { pattern: /\bv\s+podstatě\b/gi, label: "v podstatě" },
  { pattern: /\bprakticky\b/gi, label: "prakticky" },
  { pattern: /\bde\s+facto\b/gi, label: "de facto" },
  { pattern: /\bzkrátka\b/gi, label: "zkrátka" },
  { pattern: /\bjaksi\b/gi, label: "jaksi" },
];

// 2. Kontaktová a tázací slova (filler as tag questions / agreement-seeking)
// Speaker subconsciously demands attention or agreement.
const TAG_QUESTION_FILLERS: FillerPattern[] = [
  { pattern: /\bže\s+jo\b/gi, label: "že jo" },
  { pattern: /\bviď\b/gi, label: "viď" },
  { pattern: /\bhele\b/gi, label: "hele" },
  { pattern: /\bvíš\s+co\b/gi, label: "víš co" },
  { pattern: /\bvíte\s+co\b/gi, label: "víte co" },
  { pattern: /\bchápeš\b/gi, label: "chápeš" },
  { pattern: /\brozumíš\b/gi, label: "rozumíš" },
  { pattern: /\bže\s+ano\b/gi, label: "že ano" },
  { pattern: /\bže\s+ne\b/gi, label: "že ne" },
];

// 3. Zesilovače a hodnotící slova — CONTEXTUAL
// Intensifiers that lost meaning through overuse. Only filler as standalone
// reactions at sentence start (e.g. "Jasně." or "Určitě,"), NOT mid-sentence
// (e.g. "Jasně vidím problém").
// Heuristic: must appear at sentence/line start AND be followed by punctuation or end.
const INTENSIFIER_FILLERS: FillerPattern[] = [
  { pattern: /(?:^|[.!?]\s*)úplně(?=\s*[.,!?\n]|\s*$)/gim, label: "úplně" },
  { pattern: /(?:^|[.!?]\s*)normálně(?=\s*[.,!?\n]|\s*$)/gim, label: "normálně" },
  { pattern: /(?:^|[.!?]\s*)určitě(?=\s*[.,!?\n]|\s*$)/gim, label: "určitě" },
  { pattern: /(?:^|[.!?]\s*)jasně(?=\s*[.,!?\n]|\s*$)/gim, label: "jasně" },
  { pattern: /(?:^|[.!?]\s*)přesně(?:\s+tak)?(?=\s*[.,!?\n]|\s*$)/gim, label: "přesně" },
  { pattern: /(?:^|[.!?]\s*)absolutně(?=\s*[.,!?\n]|\s*$)/gim, label: "absolutně" },
];

// 4. Hovorové a nespisovné vrstvy (always filler in professional context)
// Colloquial expressions — always parasitic in a training call.
// "vole" uses negative lookbehind to avoid double-counting with "ty vole".
const COLLOQUIAL_FILLERS: FillerPattern[] = [
  { pattern: /\bty\s+jo\b/gi, label: "ty jo" },
  { pattern: /\bty\s+vole\b/gi, label: "ty vole" },
  { pattern: /(?<!ty\s)\bvole\b/gi, label: "vole" },
];

// 5. Časové výplně a spojky na začátku vět — CONTEXTUAL
// Conjunctions/transitions overused at sentence start without fulfilling
// their grammatical function. Only filler at sentence/line start.
const TEMPORAL_FILLERS: FillerPattern[] = [
  { pattern: /(?:^|[.!?]\s*)jinak\b/gim, label: "jinak" },
  { pattern: /(?:^|[.!?]\s*)nicméně\b/gim, label: "nicméně" },
];

interface FillerPattern {
  pattern: RegExp;
  label: string;
}

const FILLER_PATTERNS: FillerPattern[] = [
  ...SOUND_FILLERS,
  ...PLACEHOLDER_FILLERS,
  ...TAG_QUESTION_FILLERS,
  ...INTENSIFIER_FILLERS,
  ...COLLOQUIAL_FILLERS,
  ...TEMPORAL_FILLERS,
];

export interface FillerWordCount {
  word: string;
  count: number;
}

export function countFillerWords(transcript: string): FillerWordCount[] {
  const counts: Record<string, number> = {};

  for (const { pattern, label } of FILLER_PATTERNS) {
    // Reset lastIndex for stateful regex (flags include g)
    pattern.lastIndex = 0;
    const matches = transcript.match(pattern);
    if (matches) {
      counts[label] = (counts[label] || 0) + matches.length;
    }
  }

  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
