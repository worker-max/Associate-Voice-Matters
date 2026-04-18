"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    setLoading(false);
    if (result?.error) {
      setError("We couldn't send the link just now. Try again in a moment.");
      return;
    }
    window.location.href = "/channel/signup?check=email";
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@work-or-personal.com"
        className="w-full rounded-full border border-ivory-card bg-ivory px-5 py-3 text-sm text-slate outline-none transition focus:border-sage focus:shadow-warm"
      />
      {error ? (
        <p className="text-xs text-bloom">{error}</p>
      ) : null}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send my sign-in link <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
