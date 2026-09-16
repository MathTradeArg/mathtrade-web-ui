"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import clsx from "clsx";
import useSidebarNav from "../useSidebarNav";
import MoreSheet from "./MoreSheet";

const TabBar = () => {
  const { items, isActive, lockedInfo } = useSidebarNav();
  const [sheetOpen, setSheetOpen] = useState(false);

  const primary = items.filter((entry) => entry.mobilePrimary);
  const rest = items.filter((entry) => !entry.mobilePrimary);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-[9999] bg-black flex shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
        {primary.map((entry) => {
          const active = isActive(entry.path);
          const locked = lockedInfo[entry.key];
          return (
            <Link
              key={entry.key}
              href={entry.path}
              className={clsx(
                "relative flex-1 flex flex-col items-center gap-0.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-[10px] font-semibold",
                locked ? "text-[#6b7280]" : active ? "text-primary" : "text-[#b7bcc4]"
              )}
            >
              <Icon type={entry.icon} className="text-lg" />
              {locked ? (
                <Icon
                  type="key"
                  className="absolute top-1 right-[calc(50%-16px)] text-[9px] text-[#6b7280]"
                />
              ) : null}
              <I18N id={entry.titleI18nKey} />
            </Link>
          );
        })}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex-1 flex flex-col items-center gap-0.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-[10px] font-semibold text-[#b7bcc4]"
        >
          <Icon type="more" className="text-lg" />
          <I18N id="menu.More" />
        </button>
      </nav>

      <MoreSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        restItems={rest}
        isActive={isActive}
      />
    </>
  );
};

export default TabBar;
