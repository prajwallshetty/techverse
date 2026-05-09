import { Leaf } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/antigravity/card";
import { Button } from "@/components/antigravity/button";
import { env } from "@/lib/env";

export const metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-6" />
          </div>
          <h1 className="text-2xl font-black">Founder access</h1>
          <p className="text-sm leading-6 text-muted">
            Auth.js route handlers are configured. Use the demo credentials or
            replace the provider with your production identity stack.
          </p>
        </CardHeader>
        <CardContent>
          <form action="/api/auth/signin/credentials" method="post" className="space-y-4">
            <label className="block text-sm font-semibold">
              Email
              <input
                className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                defaultValue={env.DEMO_EMAIL}
                name="email"
                type="email"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                defaultValue={env.DEMO_PASSWORD}
                name="password"
                type="password"
              />
            </label>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
