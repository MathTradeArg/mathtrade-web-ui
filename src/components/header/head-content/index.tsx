"use client";
import Icon from "@/components/icon";
import clsx from "clsx";
import { useCallback, useLayoutEffect, useState, type ReactNode } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size as floatingSize,
} from "@floating-ui/react";

type HeadContentProps = {
  children: ReactNode;
  visibleMobile: boolean;
  toggleMobile: () => void;
  // "below" anchors under the trigger (header buttons); "right" flyouts
  // to the trigger's right (sidebar rows, where "below" would overflow
  // off-screen since the trigger sits near the left edge of the viewport).
  placement?: "below" | "right";
};

const HeadContent = ({
  children,
  visibleMobile,
  toggleMobile,
  placement = "below",
}: HeadContentProps) => {
  const isRight = placement === "right";
  const [isLg, setIsLg] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLg(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { refs, floatingStyles, isPositioned } = useFloating({
    open: isLg,
    strategy: "fixed",
    placement: isRight ? "right-end" : "bottom-end",
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      floatingSize({
        padding: 8,
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(160, availableHeight)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const setFloatingRef = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
      if (node?.parentElement) {
        refs.setReference(node.parentElement);
      }
    },
    [refs]
  );

  return (
    <aside
      ref={setFloatingRef}
      style={
        isLg
          ? {
              ...floatingStyles,
              zIndex: 60,
              ...(isPositioned ? {} : { visibility: "hidden" }),
            }
          : undefined
      }
      className={clsx(
        "max-lg:animate-faderight max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:max-w-full max-lg:h-full max-lg:z-[25000]",
        "lg:z-[60] lg:w-auto lg:max-w-min lg:h-auto lg:flex lg:flex-col lg:overflow-hidden",
        "lg:invisible lg:pointer-events-none lg:peer-hover:visible lg:hover:visible lg:peer-hover:pointer-events-auto lg:hover:pointer-events-auto",
        {
          "max-lg:hidden": !visibleMobile,
          "max-lg:block": visibleMobile,
        }
      )}
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
