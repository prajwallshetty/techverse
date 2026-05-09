"use client";

import {
  createContext,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ─── Context ─── */
type TabsContextValue = {
  active: string;
  setActive: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue>({
  active: "",
  setActive: () => {},
});

/* ─── Root ─── */
export function Tabs({
  defaultValue,
  children,
  className,
  onValueChange,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}) {
  const [active, setActiveRaw] = useState(defaultValue);

  const setActive = (value: string) => {
    setActiveRaw(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ─── List ─── */
export function TabsList({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex rounded-lg bg-surface-muted p-1 gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Trigger ─── */
export function TabsTrigger({
  value,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all",
        "hover:text-foreground",
        isActive
          ? "bg-surface text-foreground shadow-sm"
          : "text-muted",
        className,
      )}
      onClick={() => setActive(value)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Content ─── */
export function TabsContent({
  value,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string; children: ReactNode }) {
  const { active } = useContext(TabsContext);

  if (active !== value) return null;

  return (
    <div
      role="tabpanel"
      data-state={active === value ? "active" : "inactive"}
      className={cn("mt-4 animate-[fadeIn_0.2s_ease]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
