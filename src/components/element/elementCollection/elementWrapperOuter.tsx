import clsx from "clsx";
import type { ReactNode } from "react";

const ElementWrapperOuter = ({
  children,
  tourAnchor,
  card = false,
}: {
  children: ReactNode;
  // The child paints its own card surface: no padding, fill or border here.
  card?: boolean;
  tourAnchor?: string; // data-tour for the guided tutorial (src/tours)
}) => {
  return (
    <div
      className={clsx(
        "mb-6 rounded-card flex flex-col min-w-0 max-w-full w-full",
        card ? null : "p-4"
      )}
      data-tour={tourAnchor}
    >
      {children}
    </div>
  );
};

export default ElementWrapperOuter;
