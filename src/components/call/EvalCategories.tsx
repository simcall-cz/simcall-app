import type { EvalCategory } from "@/types/dashboard";

const CATEGORY_ORDER = [
  "rapport",
  "discovery",
  "expertise",
  "objections",
  "communication",
  "closing",
] as const;

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7
      ? "bg-green-500"
      : score >= 5
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 7
      ? "bg-green-100 text-green-700"
      : score >= 5
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}/10
    </span>
  );
}

interface EvalCategoriesProps {
  categories: Record<string, EvalCategory>;
}

export function EvalCategories({ categories }: EvalCategoriesProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-neutral-800">Hodnotící kategorie</h4>
      <div className="space-y-3">
        {CATEGORY_ORDER.map((key) => {
          const cat = categories[key];
          if (!cat) return null;

          return (
            <div key={key} className="border border-neutral-100 rounded-lg p-3 space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm font-medium text-neutral-800 truncate">
                    {cat.label}
                  </span>
                  <span className="text-xs text-neutral-400 shrink-0">
                    ({cat.weight}%)
                  </span>
                </div>
                <ScoreBadge score={cat.score} />
              </div>

              {/* Progress bar */}
              <ScoreBar score={cat.score} />

              {/* Checkpoints */}
              {cat.checkpoints.length > 0 && (
                <ul className="space-y-1 pt-1">
                  {cat.checkpoints.map((cp, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      {cp.passed ? (
                        <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                      ) : (
                        <span className="text-red-500 shrink-0 mt-0.5">✗</span>
                      )}
                      <span
                        className={
                          cp.passed ? "text-neutral-600" : "text-neutral-500"
                        }
                      >
                        {cp.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Critical errors (expertise only) */}
              {cat.critical_errors && cat.critical_errors.length > 0 && (
                <div className="pt-1 space-y-1">
                  {cat.critical_errors.map((err, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 rounded px-2 py-1"
                    >
                      <span className="shrink-0 font-bold">!</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Note */}
              {cat.note && (
                <p className="text-xs text-neutral-400 leading-relaxed">{cat.note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
