"use client";
import { useContext, useEffect, useMemo } from "react";
import PreviewerWantGroup from "@/components/previewerWantGroup";
import { GridContext } from "@/context/myWants/grid";
import clsx from "clsx";
import { colorTagStyles } from "@/utils/color";
import ValueMini from "@/components/value/mini";
import Icon from "@/components/icon";
import {
  cardKindBorderClass,
  resolveWantGroupKind,
} from "@/components/badgeType/cardKind";

const WantGroupLabelUI = ({ wantGroup = null }) => {
  const { setShowNoOptionsAdv, tagsVisible, setTagsVisible } =
    useContext(GridContext);
  const { id, name, type, tag, wants, value } = wantGroup || {};
  const expanded = type === "tag" && !!tagsVisible?.[id];
  const empty = !(wants?.length);
  const kind = wantGroup ? resolveWantGroupKind(wantGroup) : null;

  useEffect(() => {
    if (!wantGroup) return;
    if (empty) {
      setShowNoOptionsAdv(true);
    }
  }, [wantGroup, wants, setShowNoOptionsAdv, empty]);

  const tagStyle = useMemo(() => {
    return type === "tag" ? colorTagStyles(tag?.color) : null;
  }, [type, tag]);

  if (!wantGroup) return null;

  return (
    <div
      className={clsx(
        "h-8 w-64 border-b border-r flex items-center justify-between gap-1 pl-2",
        tagStyle ? "bg-white border-gray-300" : cardKindBorderClass(kind, 4),
        { "shadow-[inset_0_0_0_3px_red]": empty }
      )}
      style={tagStyle || undefined}
    >
      <div className="flex items-center gap-1 min-w-0">
        {type === "tag" ? (
          // Expand to list the tagged items, like item groups in the columns.
          <button
            type="button"
            className={clsx(
              "w-5 h-6 text-lg leading-none shrink-0 transition-transform",
              { "rotate-90": expanded }
            )}
            onClick={() =>
              setTagsVisible((old: Record<string, boolean>) => ({
                ...old,
                [id]: !old?.[id],
              }))
            }
            aria-expanded={expanded}
          >
            <Icon type="arrow-right" />
          </button>
        ) : null}
        <h4 className="cropped_1 text-xs font-bold" title={name}>
          {`${name}${type === "tag" ? ` (${wants.length})` : ""}`}
        </h4>
      </div>
      <div className="flex items-center gap-1">
        <ValueMini currentValue={value} />
        <div className="w-6">
          <PreviewerWantGroup
            wantGroup={wantGroup}
            className="border-l border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default WantGroupLabelUI;
