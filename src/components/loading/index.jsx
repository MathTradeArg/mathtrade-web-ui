import clsx from "clsx";
import HandSVG from "./handSVG";
import { useOptions } from "@/store";
import { COLLAPSE_KEY } from "@/components/sidebar/useSidebarNav";

const _ = [1, 2, 3, 4];

const LoadingGraph = ({ min }) => {
  return (
    <div className={clsx("loading-graph", { min })}>
      <div className="loading-graph_inner">
        {_.map((num) => {
          return (
            <div className={`loading-g loading-g-${num}`} key={num}>
              <div className="loading-g-in">
                <div className="ball">
                  <div className="ball-inner" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {_.map((num) => {
        return (
          <div className={`hand hand-${num}`} key={num}>
            <HandSVG />
          </div>
        );
      })}
    </div>
  );
};

// Page-level loading: fixed over the content area, starting where the
// sidebar ends (desktop; on mobile the sidebar is a bottom tab bar).
export const PageLoading = ({ loading }) => {
  const collapsed = useOptions((state) => Boolean(state.options?.[COLLAPSE_KEY]));
  return loading ? (
    <div
      className="loading-box page"
      style={{ "--sidebar-w": collapsed ? "76px" : "260px" }}
    >
      <LoadingGraph />
    </div>
  ) : null;
};

export const LoadingBox = ({
  loading,
  className = "",
  transparent = false,
  min = false,
  center = false,
  zIndex = null,
}) => {
  return loading ? (
    <div
      className={clsx("loading-box", className, { transparent, min, center })}
      style={zIndex ? { zIndex } : null}
    >
      <LoadingGraph min={min} />
    </div>
  ) : null;
};
