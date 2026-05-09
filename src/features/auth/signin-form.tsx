"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Mail,
  Lock,
  Phone,
  KeyRound,
  Loader2,
  Warehouse,
  TrendingUp,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import { Button } from "@/components/antigravity/button";
import { Input } from "@/components/antigravity/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/antigravity/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/antigravity/tabs";

import { ROLE_DASHBOARD } from "@/types/domain";
import type { UserRole } from "@/types/domain";

type OtpStep = "phone" | "otp";

const roleConfig = {
  farmer: {
    icon: Sprout,
    label: "Farmer",
    description: "Sign in with your registered phone number",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  warehouse_owner: {
    icon: Warehouse,
    label: "Warehouse",
    description: "Access your warehouse management portal",
    color: "text-blue-600 dark:text-blue-400",
  },
  trader: {
    icon: TrendingUp,
    label: "Trader",
    description: "Monitor markets and manage trades",
    color: "text-amber-600 dark:text-amber-400",
  },
  admin: {
    icon: ShieldCheck,
    label: "Admin",
    description: "Platform administration and oversight",
    color: "text-violet-600 dark:text-violet-400",
  },
} as const;

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Shared state
  const [activeRole, setActiveRole] = useState<string>("farmer");
  const [error, setError] = useState<string | null>(null);

  // Email/password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  const [otpSending, setOtpSending] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setError(null);
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setOtpStep("phone");
    setDevOtp(null);
  };

  /* ─── OTP Flow ─── */
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setError(null);
    setOtpSending(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to send OTP.");
        return;
      }

      setOtpStep("otp");
      if (data.otp) setDevOtp(data.otp); // Dev mode only
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleOtpSignIn = () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await signIn("phone-otp", {
          phone,
          otp,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid or expired OTP. Please try again.");
          return;
        }

        router.push(ROLE_DASHBOARD.farmer);
        router.refresh();
      } catch {
        setError("Sign in failed. Please try again.");
      }
    });
  };

  /* ─── Email/Password Flow ─── */
  const handleCredentialsSignIn = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          role: activeRole,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password.");
          return;
        }

        const dashboard =
          ROLE_DASHBOARD[activeRole as UserRole] ?? "/dashboard";
        router.push(dashboard);
        router.refresh();
      } catch {
        setError("Sign in failed. Please try again.");
      }
    });
  };

  const currentRole = roleConfig[activeRole as keyof typeof roleConfig];
  const RoleIcon = currentRole.icon;

  return (
    <Card className="w-full max-w-md backdrop-blur">
      {/* Header */}
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Leaf className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">AgriHold AI</h1>
            <p className="text-xs text-muted">
              Agricultural intelligence platform
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Role Tabs */}
        <Tabs defaultValue="farmer" onValueChange={handleRoleChange}>
          <TabsList>
            {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map(
              (key) => {
                const config = roleConfig[key];
                const Icon = config.icon;
                return (
                  <TabsTrigger key={key} value={key}>
                    <span className="flex flex-col items-center gap-1">
                      <Icon className="size-3.5" />
                      <span>{config.label}</span>
                    </span>
                  </TabsTrigger>
                );
              },
            )}
          </TabsList>

          {/* Role description */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2.5">
            <RoleIcon className={`size-4 shrink-0 ${currentRole.color}`} />
            <p className="text-xs text-muted">{currentRole.description}</p>
          </div>

          {/* ── Farmer OTP Tab ── */}
          <TabsContent value="farmer">
            {otpStep === "phone" ? (
              <div className="space-y-4">
                <Input
                  id="farmer-phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  icon={<Phone className="size-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={error && activeRole === "farmer" ? error : undefined}
                />
                <Button
                  className="w-full"
                  type="button"
                  disabled={otpSending}
                  onClick={handleSendOtp}
                >
                  {otpSending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      <Phone className="size-4" />
                      Send OTP
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-800 dark:bg-emerald-950">
                  <p className="text-xs text-emerald-800 dark:text-emerald-200">
                    OTP sent to <span className="font-bold">{phone}</span>
                    {devOtp && (
                      <span className="ml-1 font-mono text-emerald-600 dark:text-emerald-400">
                        (Dev: {devOtp})
                      </span>
                    )}
                  </p>
                </div>
                <Input
                  id="farmer-otp"
                  label="One-Time Password"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  icon={<KeyRound className="size-4" />}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  error={error && activeRole === "farmer" ? error : undefined}
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    className="flex-1"
                    onClick={() => {
                      setOtpStep("phone");
                      setOtp("");
                      setDevOtp(null);
                      setError(null);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    type="button"
                    disabled={isPending}
                    onClick={handleOtpSignIn}
                  >
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Verify & Sign in"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Warehouse Owner Tab ── */}
          <TabsContent value="warehouse_owner">
            <EmailPasswordForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={
                error && activeRole === "warehouse_owner" ? error : null
              }
              isPending={isPending}
              onSubmit={handleCredentialsSignIn}
              idPrefix="warehouse"
            />
          </TabsContent>

          {/* ── Trader Tab ── */}
          <TabsContent value="trader">
            <EmailPasswordForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error && activeRole === "trader" ? error : null}
              isPending={isPending}
              onSubmit={handleCredentialsSignIn}
              idPrefix="trader"
            />
          </TabsContent>

          {/* ── Admin Tab ── */}
          <TabsContent value="admin">
            <EmailPasswordForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error && activeRole === "admin" ? error : null}
              isPending={isPending}
              onSubmit={handleCredentialsSignIn}
              idPrefix="admin"
            />
          </TabsContent>
        </Tabs>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-800 dark:bg-red-950">
            <p className="text-xs font-medium text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Shared Email + Password Form ─── */
function EmailPasswordForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isPending,
  onSubmit,
  idPrefix,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  isPending: boolean;
  onSubmit: () => void;
  idPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <Input
        id={`${idPrefix}-email`}
        label="Email"
        type="email"
        placeholder="you@agrihold.ai"
        icon={<Mail className="size-4" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
      />
      <Input
        id={`${idPrefix}-password`}
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock className="size-4" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        className="w-full"
        type="button"
        disabled={isPending}
        onClick={onSubmit}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <Lock className="size-4" />
            Sign in
          </>
        )}
      </Button>
    </div>
  );
}
