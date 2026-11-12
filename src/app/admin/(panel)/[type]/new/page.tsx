import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/admin/components/AdminHeading";
import { DocumentEditor } from "@/admin/components/DocumentEditor";
import { emptyValues, loadReferenceOptions } from "@/admin/data";
import { getContentType } from "@/admin/schema";

export const metadata: Metadata = { title: "New" };

export default async function NewPage({ params }: PageProps<"/admin/[type]/new">) {
  const { type: key } = await params;
  const type = getContentType(key);
  if (!type || type.singleton) notFound();
  const options = await loadReferenceOptions(type);

  return (
    <>
      <AdminHeading
        eyebrow={type.label}
        title={`New ${type.singular.toLowerCase()}`}
        description="It starts as a draft. Nothing appears on the site until you publish."
        back={{ href: `/admin/${type.key}`, label: type.label }}
      />
      <DocumentEditor type={type} id={null} initial={emptyValues(type)} initialStatus="draft" options={options} />
    </>
  );
}
