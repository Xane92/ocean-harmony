import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/admin/components/AdminHeading";
import { DocumentEditor } from "@/admin/components/DocumentEditor";
import { loadDocument, loadReferenceOptions } from "@/admin/data";
import { getContentType } from "@/admin/schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata: Metadata = { title: "Edit" };

export default async function EditPage({ params }: PageProps<"/admin/[type]/[id]">) {
  const { type: key, id } = await params;
  const type = getContentType(key);
  if (!type || type.singleton || !UUID.test(id)) notFound();

  const [doc, options] = await Promise.all([loadDocument(type, id), loadReferenceOptions(type)]);
  if (!doc) notFound();
  const title = String(doc.values[type.titleField] ?? "") || `Untitled ${type.singular.toLowerCase()}`;

  return (
    <>
      <AdminHeading eyebrow={type.singular} title={title} back={{ href: `/admin/${type.key}`, label: type.label }} />
      {/* key resets local form state when switching between items */}
      <DocumentEditor key={id} type={type} id={id} initial={doc.values} initialStatus={doc.status} options={options} />
    </>
  );
}
