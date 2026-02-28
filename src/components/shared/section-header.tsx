import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {badge && (
        <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-neutral-500 max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
