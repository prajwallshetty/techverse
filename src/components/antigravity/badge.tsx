import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const tone = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  medium:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  high: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

export function Badge({
  className,
  intent = "low",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { intent?: keyof typeof tone }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold capitalize",
        tone[intent],
        className,
      )}
      {...props}
    />
  );
}
