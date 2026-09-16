"use client";
import Link from "next/link";
import Icon from "@/components/icon";
import I18N, { getI18Ntext } from "@/i18n";
import clsx from "clsx";
import type { NavEntry } from "@/config/nav";

type LockedInfo = { daysLeft: number };

type NavRowsProps = {
  items: NavEntry[];
  isActive: (path: string) => boolean;
  collapsed: boolean;
  lockedInfo?: Record<string, LockedInfo>;
};

const lockedCaptionId = (daysLeft: number) => {
  if (daysLeft <= 0) {
    return "menu.locked.wants.today";
  }
  if (daysLeft === 1) {
    return "menu.locked.wants.1day";
  }
  return "menu.locked.wants.days";
};

const NavRows = ({ items, isActive, collapsed, lockedInfo = {} }: NavRowsProps) => {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((entry) => {
        const active = isActive(entry.path);
        const locked = lockedInfo[entry.key];
        const title = locked
          ? `${getI18Ntext(entry.titleI18nKey)} — ${getI18Ntext(
              lockedCaptionId(locked.daysLeft),
              [locked.daysLeft]
            )}`
          : collapsed
            ? getI18Ntext(entry.titleI18nKey)
            : undefined;

        return (
          <div key={entry.key}>
            <Link
              href={entry.path}
              title={title}
              className={clsx(
                "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
                collapsed ? "justify-center w-11 h-11 mx-auto" : "px-3 py-2.5",
                locked
                  ? "text-[#6b7280]"
                  : active
                    ? "bg-primary text-white"
                    : "text-[#b7bcc4] hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon type={entry.icon} className="text-lg shrink-0" />
              {!collapsed ? (
                <>
                  <I18N id={entry.titleI18nKey} />
                  {locked ? (
                    <Icon type="key" className="text-xs ml-auto opacity-70" />
                  ) : null}
                </>
              ) : null}
            </Link>
            {locked && !collapsed ? (
              <div className="text-[11px] leading-snug text-[#6b7280] px-3 pb-1 -mt-0.5">
                <I18N id={lockedCaptionId(locked.daysLeft)} values={[locked.daysLeft]} />
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
};

export default NavRows;
