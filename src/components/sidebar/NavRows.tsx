"use client";
import Link from "next/link";
import Icon from "@/components/icon";
import I18N, { getI18Ntext } from "@/i18n";
import clsx from "clsx";
import type { NavEntry } from "@/config/nav";

type NavRowsProps = {
  items: NavEntry[];
  isActive: (path: string) => boolean;
  collapsed: boolean;
};

const NavRows = ({ items, isActive, collapsed }: NavRowsProps) => {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((entry) => {
        const active = isActive(entry.path);
        return (
          <Link
            key={entry.key}
            href={entry.path}
            title={collapsed ? getI18Ntext(entry.titleI18nKey) : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
              collapsed ? "justify-center w-11 h-11 mx-auto" : "px-3 py-2.5",
              active
                ? "bg-primary text-white"
                : "text-[#b7bcc4] hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon type={entry.icon} className="text-lg shrink-0" />
            {!collapsed ? <I18N id={entry.titleI18nKey} /> : null}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavRows;
