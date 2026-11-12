"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "../actions";
import { inputClass } from "./FieldShell";

export function LoginForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5">
        <span className="font-display text-body font-semibold text-ink">Email</span>
        <input name="email" type="email" autoComplete="username" required className={inputClass} aria-describedby={state ? "login-error" : undefined} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-display text-body font-semibold text-ink">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      <p id="login-error" role="status" aria-live="polite" className="text-body text-ink">
        {state?.message}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center bg-accent px-6 font-display text-body font-semibold text-on-accent disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
