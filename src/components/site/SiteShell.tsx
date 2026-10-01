import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Skip link, header, main landmark and footer for every public page. Studio renders without it. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link" data-shell-inert>
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} data-shell-inert className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
