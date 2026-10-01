import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string; slug?: string };

/**
 * Sanity webhook target. Configure the webhook in sanity.io/manage with:
 * URL https://<site>/api/revalidate, trigger on create/update/delete,
 * projection {_type, "slug": slug.current}, and the secret from SANITY_REVALIDATE_SECRET.
 * Refreshes every cached query tagged with the changed document type.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  try {
    // Waits for Content Lake consistency so the refetch sees the new content.
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret, true);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type in payload" }, { status: 400 });
    }

    const tags = [body._type, ...(body.slug ? [`${body._type}:${body.slug}`] : [])];
    for (const tag of tags) revalidateTag(tag, "max");

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (error) {
    console.error("Revalidation webhook failed", error);
    return NextResponse.json({ message: "Could not process webhook" }, { status: 500 });
  }
}
