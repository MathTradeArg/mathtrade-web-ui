"use client";
import { useContext } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import clsx from "clsx";
import { PageContext } from "@/context/page";
import TimelineButton from "@/components/header/timeline";
import NotificationsButton from "@/components/header/notifications";
import HelpButton from "@/components/header/helpButton";
import AccountMenuButton from "@/components/header/account";
import type { NavEntry } from "@/config/nav";

type MoreSheetProps = {
  open: boolean;
  onClose: () => void;
  restItems: NavEntry[];
  isActive: (path: string) => boolean;
};

const MoreSheet = ({ open, onClose, restItems, isActive }: MoreSheetProps) => {
  const { mathtrade } = useContext(PageContext);
  const hasMathtrade = Boolean(mathtrade && Object.keys(mathtrade).length > 0);

  return (
    <div
      className={clsx(
        "lg:hidden fixed inset-0 z-[9998]",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div
        onClick={onClose}
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={clsx(
          "absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl pb-[calc(14px+env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.3)] transition-transform",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="w-9 h-1 rounded-full bg-gray-300 mx-auto mt-3 mb-1" />
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide px-4 pt-2 pb-1">
          <I18N id="menu.More" />
        </div>

        {restItems.map((entry) => {
          const active = isActive(entry.path);
          return (
            <Link
              key={entry.key}
              href={entry.path}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-4 px-4 py-3 text-[15px] font-medium",
                active ? "text-primary" : "text-gray-900"
              )}
            >
              <Icon type={entry.icon} className="text-lg" />
              <I18N id={entry.titleI18nKey} />
            </Link>
          );
        })}

        <div className="h-px bg-gray-100 my-1 mx-4" />

        {hasMathtrade ? (
          <SheetRow>
            <TimelineButton variant="row" tone="light" />
          </SheetRow>
        ) : null}
        <SheetRow>
          <NotificationsButton variant="row" tone="light" />
        </SheetRow>
        <SheetRow>
          <HelpButton variant="row" tone="light" />
        </SheetRow>
        <SheetRow>
          <AccountMenuButton variant="row" tone="light" />
        </SheetRow>
      </div>
    </div>
  );
};

const SheetRow = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-2">{children}</div>;
};

export default MoreSheet;
