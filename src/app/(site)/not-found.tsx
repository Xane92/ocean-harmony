import type { Metadata } from "next";
import { NotFoundContent } from "@/components/site/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// notFound() thrown inside a public page: the site layout already provides the shell.
export default function NotFound() {
  return <NotFoundContent />;
}
