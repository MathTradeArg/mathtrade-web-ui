"use client";
import PreviewerItem from "@/components/previewerItem";

/* Info row of an item listed under an expanded tag want in the wants grid.
 * No ticks: the want (and its ticks) is the tag (MAT-136). An item has at
 * most one tag, so each item appears under a single tag. */
const TagItemLabel = ({ row }: { row: any }) => {
  const { item, color } = row;
  return (
    <div
      className="h-7 w-64 border-b border-r border-gray-200 flex items-center justify-between gap-1 pl-6 pr-1"
      style={{ backgroundColor: `${color}25` }}
    >
      <h5 className="cropped_1 text-[11px]" title={item.title}>
        {item.title}
      </h5>
      <div className="w-6 shrink-0">
        <PreviewerItem itemId={item.id} className="" />
      </div>
    </div>
  );
};

export default TagItemLabel;
