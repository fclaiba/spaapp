import type { ComponentProps } from "react";

import { cn } from "./utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--color-surface-subtle)]",
        className,
      )}
      {...props}
    />
  );
}
