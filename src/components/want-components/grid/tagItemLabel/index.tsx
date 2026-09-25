"use client";
import clsx from "clsx";
import I18N, { getI18Ntext } from "@/i18n";
import PreviewerItem from "@/components/previewerItem";

/* Info row of an item under an expanded tag in the wants grid. No ticks: the
 * want (and its ticks) is the tag. Shows whether the item is actually wanted
 * (added with "Lo quiero") or only tagged. */
const TagItemLabel = ({ row }: { row: any }) => {
  const { item, color, wanted } = row;
  return (
    <div
      className={clsx(
        "h-7 w-64 border-b border-r border-gray-200 flex items-center justify-between gap-1 pl-6 pr-1",
        { "opacity-60": !wanted }
      )}
      style={{ backgroundColor: wanted ? `${color}25` : "#f3f4f6" }}
      title={getI18Ntext(wanted ? "grid.tagItem.wanted" : "grid.tagItem.notWanted")}
    >
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-[11px] w-3 shrink-0 text-center">
          {wanted ? "✓" : ""}
        </span>
        <h5 className="cropped_1 text-[11px]">{item.title}</h5>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!wanted ? (
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            <I18N id="grid.tagItem.notWantedShort" />
          </span>
        ) : null}
        <div className="w-6">
          <PreviewerItem itemId={item.id} className="" />
        </div>
      </div>
    </div>
  );
};

export default TagItemLabel;
