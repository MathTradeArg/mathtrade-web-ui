import clsx from "clsx";
import type { CSSProperties } from "react";
import DiceLoader from "./DiceLoader";
import { useOptions } from "@/store";
import { COLLAPSE_KEY } from "@/components/sidebar/useSidebarNav";

export const PageLoading = ({
  loading,
  withSidebar = false,
}: {
  loading?: boolean;
  withSidebar?: boolean;
}) => {
  const collapsed = useOptions((state) => Boolean(state.options?.[COLLAPSE_KEY]));
  return loading ? (
    <div
      className={clsx("loading-box page", { "with-sidebar": withSidebar })}
      style={
        withSidebar
          ? ({ "--sidebar-w": collapsed ? "76px" : "260px" } as CSSProperties)
          : undefined
      }
    >
      <DiceLoader />
    </div>
  ) : null;
};

type LoadingBoxProps = {
  loading?: boolean;
  className?: string;
  transparent?: boolean;
  min?: boolean;
  center?: boolean;
  zIndex?: number | string | null;
};

export const LoadingBox = ({
  loading,
  className = "",
  transparent = false,
  min = false,
  center = false,
  zIndex = null,
}: LoadingBoxProps) => {
  return loading ? (
    <div
      className={clsx("loading-box", className, { transparent, min, center })}
      style={zIndex ? { zIndex } : undefined}
    >
      <DiceLoader size={min ? 28 : 40} />
    </div>
  ) : null;
};
