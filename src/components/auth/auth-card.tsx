import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div className={cn(
      "w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface/80 p-8 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500",
      className
    )}>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-muted">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
