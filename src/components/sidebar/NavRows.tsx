"use client";
import Icon from "@/components/icon";
import I18N, { getI18Ntext } from "@/i18n";
import clsx from "clsx";
import type { LockedInfo, NavGroup } from "./useSidebarNav";
import NavItem from "./NavItem";
import { fadeLabelClass } from "./fadeLabel";

type NavRowsProps = {
  groups: NavGroup[];
  isActive: (path: string) => boolean;
  collapsed: boolean;
  lockedInfo?: Record<string, LockedInfo>;
};

const NavRows = ({
  groups = [],
  isActive,
  collapsed = false,
  lockedInfo = {},
}: NavRowsProps) => {
  return (
    <nav className="flex flex-col gap-1 w-full">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-0.5">
          <p
            className={clsx(
              "px-2.5 text-[11px] font-semibold text-[#8a92a0] overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out motion-reduce:transition-none",
              collapsed
                ? "max-h-0 opacity-0 mt-0 mb-0"
                : "max-h-8 opacity-100 mt-2.5 mb-1"
            )}
          >
            <I18N id={group.labelI18nKey} />
          </p>
          {group.items.map((entry) => {
            const active = isActive(entry.path);
            const locked = lockedInfo[entry.key];
            const title = locked
              ? `${getI18Ntext(entry.titleI18nKey)} — ${getI18Ntext(
                  locked.captionId,
                  [locked.daysLeft]
                )}`
              : collapsed
                ? getI18Ntext(entry.titleI18nKey)
                : undefined;

            return (
              <div key={entry.key}>
                <NavItem
                  href={entry.path}
                  locked={Boolean(locked)}
                  title={title}
                  className={clsx(
                    "flex items-center rounded-[10px] text-sm font-semibold transition-colors relative h-11 w-full",
                    collapsed ? "justify-center px-0" : "px-2.5",
                    locked
                      ? "text-[#6b7280] cursor-default"
                      : active
                        ? "bg-primary text-white"
                        : "text-[#c9ced4] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="relative shrink-0">
                    <Icon type={entry.icon} className="text-lg" />
                    {locked ? (
                      <Icon
                        type="lock"
                        className={clsx(
                          "absolute -right-1.5 -bottom-0.5 text-[9px] transition-opacity duration-200",
                          collapsed ? "opacity-80" : "opacity-0"
                        )}
                      />
                    ) : null}
                  </span>
                  <span className={fadeLabelClass(!collapsed)}>
                    <I18N id={entry.titleI18nKey} />
                  </span>
                  {locked ? (
                    <Icon
                      type="lock"
                      className={clsx(
                        "text-sm opacity-80 shrink-0 overflow-hidden transition-[opacity,max-width,margin] duration-200 ease-out",
                        collapsed
                          ? "max-w-0 opacity-0 ml-0"
                          : "ml-auto"
                      )}
                    />
                  ) : null}
                </NavItem>
                {locked ? (
                  <div
                    className={clsx(
                      "text-[11px] leading-snug text-[#8a92a0] px-2.5 ml-7 overflow-hidden transition-[max-height,opacity,padding] duration-200 ease-out motion-reduce:transition-none",
                      collapsed
                        ? "max-h-0 opacity-0 pb-0"
                        : "max-h-12 opacity-100 pb-1"
                    )}
                  >
                    <I18N id={locked.captionId} values={[locked.daysLeft]} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
};

export default NavRows;
