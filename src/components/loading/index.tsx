import clsx from "clsx";
import type { CSSProperties } from "react";
import DiceLoader from "./DiceLoader";
import { useOptions } from "@/store";
import { COLLAPSE_KEY } from "@/components/sidebar/useSidebarNav";

// Page-level loading: fixed over the content area, starting where the
// sidebar ends (desktop; on mobile the sidebar is a bottom tab bar).
export const PageLoading = ({ loading }: { loading?: boolean }) => {
  const collapsed = useOptions((state) => Boolean(state.options?.[COLLAPSE_KEY]));
  return loading ? (
    <div
      className="loading-box page"
      style={{ "--sidebar-w": collapsed ? "76px" : "260px" } as CSSProperties}
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
