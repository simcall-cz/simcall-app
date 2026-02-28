import { cn } from "@/lib/utils";

interface IconBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function IconBox({ children, className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "bg-primary-50 text-primary-500 rounded-xl p-3 w-12 h-12 flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}
