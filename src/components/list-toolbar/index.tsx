"use client";
import type { ReactNode } from "react";
import clsx from "clsx";

const ListToolbar = ({
  leading = null,
  search = null,
  count = null,
  extra = null,
  sort = null,
  trailing = null,
  align = "center",
  className = "",
}: {
  leading?: ReactNode;
  search?: ReactNode;
  count?: ReactNode;
  extra?: ReactNode;
  sort?: ReactNode;
  trailing?: ReactNode;
  align?: "center" | "end";
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "flex gap-2.5 flex-wrap bg-white border-b border-gray-200 px-3 py-2 md:px-4",
        align === "end" ? "items-end" : "items-center",
        className
      )}
    >
      {leading}
      {search ? (
        <div className="w-full min-w-0 sm:w-auto sm:flex-1">{search}</div>
      ) : null}
      {count ? (
        <span
          className={clsx(
            "text-caption font-semibold text-gray-500 whitespace-nowrap",
            align === "end" && "h-8 flex items-center"
          )}
        >
          {count}
        </span>
      ) : null}
      {extra}
      {sort}
      {trailing ? (
        <div
          className={clsx(
            "flex items-center gap-1.5 sm:ml-auto",
            align === "end" && "h-8"
          )}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );
};

export default ListToolbar;
