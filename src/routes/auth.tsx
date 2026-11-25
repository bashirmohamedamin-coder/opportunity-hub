import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: "signup" | "login" | undefined } => ({ mode: s["mode"] === "signup" ? "signup" : undefined }),
  head: () => ({ meta: [{ title: "Sign in – OpportunityHub" }, { name: "description", content: "Log in or join OpportunityHub." }] }),
  component: Auth,
});
function Auth() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(mode === "signup");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true);
    if (signup) {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: String(f.get("full_name")), account_type: String(f.get("account_type")) } } });
      setBusy(false); if (error) return void toast.error(error.message);
      toast.success("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false); if (error) return void toast.error(error.message);
      navigate({ to: "/dashboard" });
    }
  };
  return (
    <div className="container-page flex justify-center py-16">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold">{signup ? "Join OpportunityHub" : "Welcome back"}</h1>
        {signup && <><Input name="full_name" placeholder="Full name" required maxLength={100} />
          <select name="account_type" className="h-9 w-full rounded-md border bg-background px-3 text-sm" aria-label="Account type">
            <option value="student">Student or Graduate</option><option value="professional">Young Professional</option><option value="organization">Organization or Employer</option></select></>}
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required minLength={8} />
        <Button type="submit" variant="brand" className="w-full" disabled={busy}>{busy ? "Please wait…" : signup ? "Create account" : "Log in"}</Button>
        <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setSignup(!signup)}>{signup ? "Already have an account? Log in" : "New here? Create an account"}</button>
      </form>
    </div>
  );
}
