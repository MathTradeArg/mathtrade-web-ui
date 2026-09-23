"use client";
import Icon from "@/components/icon";
import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

type HeadContentProps = {
  children: ReactNode;
  visibleMobile: boolean;
  toggleMobile: () => void;
  // "below" anchors under the trigger (header buttons); "right" flyouts
  // to the trigger's right (sidebar rows, where "below" would overflow
  // off-screen since the trigger sits near the left edge of the viewport).
  placement?: "below" | "right";
  // Desktop open/close + floating position, computed by the trigger's own
  // useHoverPanel() call and passed down — see useHoverPanel.ts for why
  // this can't be computed inside HeadContent itself (the hover/click/
  // dismiss listeners must attach to the real trigger DOM node, which
  // lives in the caller, not in this component).
  open: boolean;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  isPositioned: boolean;
  floatingProps: Record<string, unknown>;
};

const HeadContent = ({
  children,
  visibleMobile,
  toggleMobile,
  placement = "below",
  open,
  setFloating,
  floatingStyles,
  isPositioned,
  floatingProps,
}: HeadContentProps) => {
  const isRight = placement === "right";

  return (
    <aside
      ref={setFloating}
      style={{
        ...floatingStyles,
        zIndex: 60,
        ...(open && !isPositioned ? { visibility: "hidden" } : {}),
      }}
      className={clsx(
        "max-lg:animate-faderight max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:max-w-full max-lg:h-full max-lg:z-[25000]",
        "lg:z-[60] lg:w-auto lg:max-w-min lg:h-auto lg:flex lg:flex-col lg:overflow-hidden",
        {
          "max-lg:hidden": !visibleMobile,
          "max-lg:block": visibleMobile,
          "lg:invisible lg:pointer-events-none": !open,
          "lg:visible lg:pointer-events-auto": open,
        }
      )}
      {...floatingProps}
    >
      {!isRight ? (
        <div className="absolute top-[-16px] right-2 z-[12]  w-0 h-0 ml-auto  border-8 border-t-transparent  border-l-transparent border-r-transparent border-b-white lg:block hidden" />
      ) : null}
      <button
        className="absolute top-0 right-0 w-10 h-10 text-gray-600 lg:hidden"
        onClick={toggleMobile}
      >
        <Icon />
      </button>
      <div className="scrollbar bg-white min-w-[260px] lg:shadow-lg overflow-y-auto overflow-x-hidden h-full lg:min-h-0 lg:flex-1 lg:max-h-full max-lg:pt-10 lg:pt-0">
        {children}
      </div>
    </aside>
  );
};
export default HeadContent;
