import type { EvalCriticalMoment } from "@/types/dashboard";

interface CriticalMomentProps {
  moment: EvalCriticalMoment;
}

export function CriticalMoment({ moment }: CriticalMomentProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 space-y-1 ${
        moment.passed
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`text-base shrink-0 mt-0.5 ${
            moment.passed ? "text-green-600" : "text-red-600"
          }`}
        >
          {moment.passed ? "✓" : "✗"}
        </span>
        <div className="space-y-0.5">
          <p
            className={`text-sm font-semibold ${
              moment.passed ? "text-green-800" : "text-red-800"
            }`}
          >
            {moment.passed
              ? `Kritický moment splněn: ${moment.label}`
              : `Kritický moment NESPLNĚN: ${moment.label} — skóre omezeno na 60 %`}
          </p>
          {moment.evidence && (
            <p
              className={`text-xs leading-relaxed ${
                moment.passed ? "text-green-700" : "text-red-700"
              }`}
            >
              {moment.evidence}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
