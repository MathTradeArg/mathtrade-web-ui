import type { ReactNode } from "react";

const StickyHeader = ({
  children,
}: {
  children?: ReactNode;
  size?: string;
}) => {
  // Keep the list toolbar pinned on desktop, but avoid stealing viewport space on
  // mobile where the entire content scrollport is already the real viewport
  // band above the TabBar.
  return (
    <header className="lg:sticky max-lg:relative top-0 z-sticky bg-canvas">
      {children}
    </header>
  );
};

export default StickyHeader;
