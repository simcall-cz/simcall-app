import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 placeholder:text-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
