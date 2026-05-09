import { BarChart3, Leaf, LineChart, Map, ShieldCheck, Sprout } from "lucide-react";

import { LinkButton } from "@/components/antigravity/button";

const nav = [
  { label: "Command", icon: BarChart3 },
  { label: "Holdings", icon: Map },
  { label: "Crop AI", icon: Sprout },
  { label: "Markets", icon: LineChart },
  { label: "Compliance", icon: ShieldCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-surface px-5 py-6 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">AgriHold</p>
            <h1 className="text-xl font-bold">AI Ops</h1>
          </div>
        </div>
        <nav className="mt-10 space-y-1">
          {nav.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Agricultural intelligence platform</p>
              <h2 className="text-xl font-bold">AgriHold AI</h2>
            </div>
            <LinkButton href="/signin" variant="secondary">
              Founder access
            </LinkButton>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
