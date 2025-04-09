import * as React from "react";
import { cn } from "@/lib/utils"; // pastikan kamu punya helper cn (optional)

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn("h-2 w-full rounded-full bg-muted", className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-ghibli-green transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
