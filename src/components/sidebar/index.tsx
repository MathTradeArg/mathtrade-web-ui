"use client";
import Link from "next/link";
import Icon from "@/components/icon";
import clsx from "clsx";
import { PRIVATE_ROUTES } from "@/config/routes";
import useSidebarNav from "./useSidebarNav";
import EventStatusCard from "./EventStatusCard";
import NavRows from "./NavRows";
import UtilityRow from "./UtilityRow";
import AccountRow from "./AccountRow";

const Sidebar = () => {
  const { items, isActive, collapsed, toggleCollapsed, lockedInfo } =
    useSidebarNav();

  return (
    <aside
      className={clsx(
        "hidden lg:flex flex-col h-screen sticky top-0 z-[60] overflow-visible bg-black shrink-0 py-4 relative",
        collapsed ? "w-[76px] items-center px-0" : "w-[260px] px-3"
      )}
    >
      <Link
        href={PRIVATE_ROUTES.HOME.path}
        className={clsx(
          "flex items-center gap-2 mb-4",
          collapsed ? "justify-center" : "px-1"
        )}
      >
        <span className="w-9 h-9 rounded-full bg-logo shrink-0" />
        {!collapsed ? (
          <span className="text-white font-bold text-base">Math Trade</span>
        ) : null}
      </Link>

      <EventStatusCard collapsed={collapsed} />

      <NavRows
        items={items}
        isActive={isActive}
        collapsed={collapsed}
        lockedInfo={lockedInfo}
      />

      <div className="grow" />

      <div
        className={clsx(
          "border-t border-white/10 my-2",
          collapsed ? "w-8 mx-auto" : "mx-1"
        )}
      />

      <UtilityRow collapsed={collapsed} />
      <AccountRow collapsed={collapsed} />

      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 bottom-6 w-6 h-6 rounded-full bg-[#1c1d21] border-2 border-colorMain text-white/60 flex items-center justify-center hover:text-white"
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <Icon
          type={collapsed ? "chevron-right" : "chevron-left"}
          className="text-xs"
        />
      </button>
    </aside>
  );
};

export default Sidebar;
