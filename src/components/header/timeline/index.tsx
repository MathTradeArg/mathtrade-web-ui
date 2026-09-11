"use client";
import { useCallback, useState } from "react";
import HeadContent from "../head-content";
import HeadButton from "../head-button";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import clsx from "clsx";
import TimeLine from "./timeline";

type TimelineButtonProps = {
  // "row" renders an icon + label row, for the sidebar's utility row.
  variant?: "header" | "row";
  placement?: "below" | "right";
  // "dark" for the black sidebar, "light" for the white mobile sheet.
  tone?: "dark" | "light";
};

const TimelineButton = ({
  variant = "header",
  placement = "below",
  tone = "dark",
}: TimelineButtonProps = {}) => {
  const [visibleMobile, setVisibleMobile] = useState(false);

  const toggleMobile = useCallback(() => {
    setVisibleMobile((v) => !v);
  }, []);

  return (
    <div className="relative">
      {variant === "row" ? (
        <button
          className={clsx(
            "flex items-center gap-3 w-full text-left cursor-pointer peer text-sm px-2 py-2 rounded-lg",
            tone === "light"
              ? "text-gray-900 hover:bg-gray-50"
              : "text-white/80 hover:text-white hover:bg-white/5"
          )}
          onClick={toggleMobile}
        >
          <Icon type="calendar" className="text-lg" />
          <I18N id="timeline.header" />
        </button>
      ) : (
        <HeadButton onClick={toggleMobile} icon="calendar" />
      )}

      <HeadContent
        visibleMobile={visibleMobile}
        toggleMobile={toggleMobile}
        placement={placement}
      >
        <TimeLine />
      </HeadContent>
    </div>
  );
};
export default TimelineButton;
