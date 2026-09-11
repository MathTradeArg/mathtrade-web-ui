"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import TimelineButton from "@/components/header/timeline";
import NotificationsButton from "@/components/header/notifications";
import CartButton from "@/components/header/cart";
import HelpButton from "@/components/header/helpButton";

const UtilityRow = ({ collapsed }: { collapsed: boolean }) => {
  const { mathtrade, membership, canI } = useContext(PageContext);
  const hasMathtrade = Boolean(mathtrade && Object.keys(mathtrade).length > 0);

  return (
    <div className="flex flex-col gap-1 mb-2">
      {hasMathtrade ? (
        <TimelineButton variant={collapsed ? "header" : "row"} placement="right" />
      ) : null}
      <NotificationsButton variant={collapsed ? "header" : "row"} placement="right" />
      {hasMathtrade && membership && canI.want ? (
        <CartButton variant={collapsed ? "header" : "row"} placement="right" />
      ) : null}
      <HelpButton variant={collapsed ? "header" : "row"} placement="right" />
    </div>
  );
};

export default UtilityRow;
