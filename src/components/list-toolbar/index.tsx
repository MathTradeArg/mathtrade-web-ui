"use client";
import clsx from "clsx";

const ListToolbar = ({
  leading = null,
  search = null,
  count = null,
  extra = null,
  sort = null,
  trailing = null,
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-2.5 flex-wrap bg-white border-b border-gray-200 px-3 py-2 md:px-4",
        className
      )}
    >
      {leading}
      {search ? (
        <div className="w-full min-w-0 sm:w-auto sm:flex-1">{search}</div>
      ) : null}
      {count ? (
        <span className="text-caption font-semibold text-gray-500 whitespace-nowrap">
          {count}
        </span>
      ) : null}
      {extra}
      {sort}
      {trailing ? (
        <div className="flex items-center gap-1.5 sm:ml-auto">{trailing}</div>
      ) : null}
    </div>
  );
};

export default ListToolbar;
