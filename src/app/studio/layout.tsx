import type { Metadata } from "next";

// Studio renders without the site header, footer or skip link. Never indexed.
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return children;
}
