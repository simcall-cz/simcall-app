import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
