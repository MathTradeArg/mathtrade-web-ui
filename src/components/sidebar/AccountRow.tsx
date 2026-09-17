"use client";
import AccountMenuButton from "@/components/header/account";

const AccountRow = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div className="px-1">
      <AccountMenuButton
        variant="row"
        collapsed={collapsed}
        placement="right"
      />
    </div>
  );
};

export default AccountRow;
