"use client";
import AccountMenuButton from "@/components/header/account";

const AccountRow = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div className="px-1">
      <AccountMenuButton
        variant={collapsed ? "header" : "row"}
        placement="right"
      />
    </div>
  );
};

export default AccountRow;
