import { useLayoutEffect, useState } from "react";
import {
  useFloating,
  useHover,
  useClick,
  useDismiss,
  useInteractions,
  autoUpdate,
  offset,
  flip,
  shift,
  safePolygon,
  size as floatingSize,
} from "@floating-ui/react";

// Shared by every sidebar/header hover panel (Timeline, Notifications, Help,
// Account, Cart): computes the floating position AND the open/close
// interaction state, so leaving the trigger's bounding box no longer closes
// the panel before the pointer can reach its (offset, floated) content —
// safePolygon() bridges that gap. `open` is a NEW, desktop-only state,
// independent of each trigger's existing `visibleMobile`/`toggleMobile`
// (mobile click-to-toggle keeps working exactly as before, untouched).
const useHoverPanel = (placement: "below" | "right" = "below") => {
  const isRight = placement === "right";
  const [isLg, setIsLg] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      // eslint-disable-next-line no-console
      console.log("[DEBUG useHoverPanel] mq change, matches=", mq.matches);
      setIsLg(mq.matches);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // eslint-disable-next-line no-console
  console.log("[DEBUG useHoverPanel] render, isLg=", isLg, "open=", open, "placement=", placement);

  const { refs, floatingStyles, isPositioned, context } = useFloating({
    open: isLg && open,
    onOpenChange: (v, event, reason) => {
      // eslint-disable-next-line no-console
      console.log("[DEBUG useHoverPanel] onOpenChange called with", v, "reason=", reason);
      setOpen(v);
    },
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

  const hover = useHover(context, {
    enabled: isLg,
    handleClose: safePolygon(),
  });
  const click = useClick(context, { enabled: isLg });
  const dismiss = useDismiss(context, { enabled: isLg });

  const { getReferenceProps: rawGetReferenceProps, getFloatingProps } =
    useInteractions([hover, click, dismiss]);

  const getReferenceProps = (userProps?: any) => {
    const props = rawGetReferenceProps(userProps);
    const wrappedOnClick = props.onClick;
    return {
      ...props,
      onClick: (e: any) => {
        // eslint-disable-next-line no-console
        console.log("[DEBUG useHoverPanel] reference onClick fired, isLg=", isLg, "open before=", open);
        wrappedOnClick?.(e);
      },
    };
  };

  return {
    isLg,
    open,
    refs,
    floatingStyles,
    isPositioned,
    getReferenceProps,
    getFloatingProps,
  };
};

export default useHoverPanel;
