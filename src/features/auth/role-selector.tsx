"use client";

import { useState } from "react";
import { selectRoleAction } from "@/lib/auth/actions";
import { UserRole } from "@/types/domain";
import { Tractor, Store, Landmark, Loader2 } from "lucide-react";

export function RoleSelector({ userName }: { userName: string }) {
  const [isLoading, setIsLoading] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    {
      id: "farmer" as UserRole,
      title: "Farmer",
      description: "Book storage, track crop prices, and manage your inventory.",
      icon: Tractor,
      color: "bg-success/10 text-success",
    },
    {
      id: "trader" as UserRole,
      title: "Trader",
      description: "Buy crops from farmers and manage your trading bids.",
      icon: Landmark,
      color: "bg-primary/10 text-primary",
    },
    {
      id: "warehouse_owner" as UserRole,
      title: "Warehouse Owner",
      description: "Manage storage slots, track bookings, and optimize space.",
      icon: Store,
      color: "bg-warning/10 text-warning",
    },
  ];

  async function handleSelect(role: UserRole) {
    setIsLoading(role);
    setError(null);
    const result = await selectRoleAction(role);
    if (result?.error) {
      setError(result.error);
      setIsLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-danger/10 p-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isThisLoading = isLoading === role.id;

          return (
            <button
              key={role.id}
              onClick={() => handleSelect(role.id)}
              disabled={isLoading !== null}
              className={`group flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:border-primary hover:shadow-lg active:scale-[0.98] disabled:opacity-70 ${
                isLoading === role.id ? "ring-2 ring-primary border-primary" : ""
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${role.color}`}>
                {isThisLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">
                    {role.title}
                  </h3>
                  <span className="material-symbols-outlined text-muted text-sm opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">arrow_forward</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
