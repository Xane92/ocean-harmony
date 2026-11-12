import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/admin/auth";
import { LoginForm } from "@/admin/components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session.state === "admin") redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-10 px-(--gutter) py-16">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">
          <span className="text-accent">00</span> / Ocean Harmony admin
        </p>
        <h1 className="font-display text-h1 font-medium text-ink">
          Sign <span className="font-serif font-normal italic">in</span>
        </h1>
        <p className="text-body text-muted">Edit stories, places, StoryMaps, opportunities and everything else on the site.</p>
      </div>
      {session.state === "not-admin" && (
        <p role="alert" className="border-l-2 border-ink pl-4 text-body text-ink">
          {session.email} is signed in but cannot edit the site. Ask the site owner to add this account.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
