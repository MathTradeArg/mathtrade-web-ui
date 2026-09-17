"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import TimelineButton from "@/components/header/timeline";
import NotificationsButton from "@/components/header/notifications";
import HelpButton from "@/components/header/helpButton";

const UtilityRow = ({ collapsed }: { collapsed: boolean }) => {
  const { mathtrade } = useContext(PageContext);
  const hasMathtrade = Boolean(mathtrade && Object.keys(mathtrade).length > 0);

  return (
    <div className="flex flex-col gap-1 mb-2">
      {hasMathtrade ? (
        <TimelineButton variant="row" collapsed={collapsed} placement="right" />
      ) : null}
      <NotificationsButton variant="row" collapsed={collapsed} placement="right" />
      <HelpButton variant="row" collapsed={collapsed} placement="right" />
    </div>
  );
};

export default UtilityRow;
