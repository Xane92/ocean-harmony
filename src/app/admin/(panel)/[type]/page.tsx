import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/admin/components/AdminHeading";
import { DocumentEditor } from "@/admin/components/DocumentEditor";
import { DocumentList } from "@/admin/components/DocumentList";
import { listDocuments, loadDocument, loadReferenceOptions } from "@/admin/data";
import { getContentType } from "@/admin/schema";

const singletonPages: Record<string, string> = { home: "/", approach: "/approach" };

export async function generateMetadata({ params }: PageProps<"/admin/[type]">): Promise<Metadata> {
  const { type } = await params;
  return { title: getContentType(type)?.label ?? "Admin" };
}

export default async function TypePage({ params }: PageProps<"/admin/[type]">) {
  const { type: key } = await params;
  const type = getContentType(key);
  if (!type) notFound();

  if (type.singleton) {
    const [doc, options] = await Promise.all([loadDocument(type, 1), loadReferenceOptions(type)]);
    return (
      <>
        <AdminHeading eyebrow="Single page" title={type.label} description={type.description} />
        <DocumentEditor type={type} id={null} initial={doc?.values ?? {}} options={options} viewHref={singletonPages[type.key]} />
      </>
    );
  }

  const rows = await listDocuments(type);
  return (
    <>
      <AdminHeading
        eyebrow={`${rows.length} ${rows.length === 1 ? "item" : "items"}`}
        title={type.label}
        description={type.description}
        action={
          <Link
            href={`/admin/${type.key}/new`}
            className="inline-flex min-h-12 items-center justify-center self-start bg-accent px-5 font-display text-body font-semibold text-on-accent md:self-auto"
          >
            + New {type.singular.toLowerCase()}
          </Link>
        }
      />
      <DocumentList typeKey={type.key} singular={type.singular} rows={rows} />
    </>
  );
}
