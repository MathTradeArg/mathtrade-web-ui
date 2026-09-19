"use client";
import clsx from "clsx";
import AccountMenuButton from "@/components/header/account";

const AccountRow = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div className={clsx("w-full", collapsed ? "px-0" : "px-1")}>
      <AccountMenuButton
        variant="row"
        collapsed={collapsed}
        placement="right"
      />
    </div>
  );
};

export default AccountRow;
