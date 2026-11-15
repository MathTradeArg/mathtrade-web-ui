import clsx from "clsx";
import type { ReactNode } from "react";
import { cardSurfaceClass } from "@/components/badgeType/cardKind";

const ElementWrapperInside = ({
  children,
  padded = true,
  // When the parent already paints the outer border, skip this one so the
  // tint sits flush to that edge.
  bordered = true,
  // The parent paints the whole card surface (Yo ofrezco plain card), so
  // this wrapper must not add a fill of its own.
  transparent = false,
  className = "",
}: {
  children?: ReactNode;
  padded?: boolean;
  bordered?: boolean;
  transparent?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "rounded-card",
        cardSurfaceClass,
        {
          "bg-surface": !transparent,
          "border border-line": bordered,
          "p-4": padded,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default ElementWrapperInside;
