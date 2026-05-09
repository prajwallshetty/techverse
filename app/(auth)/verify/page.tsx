import { verifyEmailAction } from "@/lib/auth/actions";
import { AuthCard } from "@/components/auth/auth-card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface VerifyPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams;
  
  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-5">
        <AuthCard title="Invalid Link">
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-danger" />
            <p className="mt-4 text-muted">No verification token provided.</p>
            <Link href="/signin" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
              Go to Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AuthCard>
      </main>
    );
  }

  const result = await verifyEmailAction(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5">
      <AuthCard title={result.success ? "Verified!" : "Verification Failed"}>
        <div className="text-center">
          {result.success ? (
            <>
              <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
              <p className="mt-4 text-muted">{result.success}</p>
              <Link href="/signin" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                Sign In Now <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-16 w-16 text-danger" />
              <p className="mt-4 text-muted">{result.error}</p>
              <Link href="/signup" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-surface-muted">
                Try Registering Again
              </Link>
            </>
          )}
        </div>
      </AuthCard>
    </main>
  );
}
