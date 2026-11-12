"use server";

import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import type { Status } from "@/lib/supabase/types";
import { getAdminSession } from "./auth";
import { refreshContent } from "./revalidate";
import { getContentType } from "./schema";
import { validateDocument, type FieldErrors } from "./validate";

export type SaveResult =
  | { ok: true; id: string | number; message: string }
  | { ok: false; message: string; errors?: FieldErrors };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** RLS is the real gate; this gives a clear message before a write is even attempted. */
async function adminOrError() {
  const session = await getAdminSession();
  if (session.state !== "admin") return null;
  return serverClient();
}

function friendly(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "Another item already uses that web address. Change it and save again.";
  if (error.code === "23514") return "One of the values is not allowed. Check the dates and links.";
  if (error.code === "42501") return "Your account is not allowed to edit content.";
  return "Saving failed. Try again in a moment.";
}

/** Create (id null) or update a document. Status is set separately so edits never publish by accident. */
export async function saveDocument(typeKey: string, id: string | null, input: unknown): Promise<SaveResult> {
  const type = getContentType(typeKey);
  if (!type) return { ok: false, message: "Unknown content type." };
  const supabase = await adminOrError();
  if (!supabase) return { ok: false, message: "Your session ended. Sign in again." };

  const { data, errors, ok } = validateDocument(type, input);
  if (!ok) return { ok: false, message: "Some fields need attention.", errors };

  if (type.singleton) {
    const { error } = await supabase.from(type.table).update(data).eq("id", 1);
    if (error) return { ok: false, message: friendly(error) };
    refreshContent(type.table);
    return { ok: true, id: 1, message: "Saved. The site is updated." };
  }

  if (id && !UUID.test(id)) return { ok: false, message: "Unknown item." };

  if (id) {
    const { data: row, error } = await supabase.from(type.table).update(data).eq("id", id).select("id, status").single();
    if (error) return { ok: false, message: friendly(error) };
    refreshContent(type.table);
    return {
      ok: true,
      id: row.id,
      message: row.status === "published" ? "Saved. The live page is updated." : "Saved as a draft.",
    };
  }

  // New items go to the end of the list.
  const { data: last } = await supabase
    .from(type.table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: row, error } = await supabase
    .from(type.table)
    .insert({ ...data, status: "draft", sort_order: (last?.sort_order ?? 0) + 10 })
    .select("id")
    .single();
  if (error) return { ok: false, message: friendly(error) };
  refreshContent(type.table);
  return { ok: true, id: row.id, message: "Created as a draft. Publish it when it is ready." };
}

export async function setStatus(typeKey: string, id: string, status: Status): Promise<SaveResult> {
  const type = getContentType(typeKey);
  if (!type || type.singleton || !UUID.test(id) || !["draft", "published", "archived"].includes(status)) {
    return { ok: false, message: "That change is not allowed." };
  }
  const supabase = await adminOrError();
  if (!supabase) return { ok: false, message: "Your session ended. Sign in again." };

  const { error } = await supabase.from(type.table).update({ status }).eq("id", id);
  if (error) return { ok: false, message: friendly(error) };
  refreshContent(type.table);
  const message = {
    published: "Published. It is live on the site.",
    draft: "Moved back to draft. It is hidden from the site.",
    archived: "Archived. It is hidden from the site and can be restored any time.",
  }[status];
  return { ok: true, id, message };
}

/** Saves a new order. ids are listed in the order they should appear. */
export async function reorder(typeKey: string, ids: string[]): Promise<SaveResult> {
  const type = getContentType(typeKey);
  if (!type || type.singleton || !ids.every((id) => UUID.test(id)) || ids.length > 500) {
    return { ok: false, message: "That change is not allowed." };
  }
  const supabase = await adminOrError();
  if (!supabase) return { ok: false, message: "Your session ended. Sign in again." };

  const results = await Promise.all(
    ids.map((id, i) => supabase.from(type.table).update({ sort_order: (i + 1) * 10 }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, message: friendly(failed.error) };
  refreshContent(type.table);
  return { ok: true, id: ids[0] ?? "", message: "Order saved." };
}

export type SignInState = { message: string } | null;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { message: "Enter your email and password." };

  const supabase = await serverClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { message: "That email and password do not match an account." };

  // Same client, so the admins lookup runs with the session that was just created.
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { message: "This account is not set up to edit the site. Ask the site owner to add it." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
