"use client";
import { useContext, useEffect, useMemo } from "react";
import PreviewerWantGroup from "@/components/previewerWantGroup";
import { GridContext } from "@/context/myWants/grid";
import clsx from "clsx";
import { colorTagStyles } from "@/utils/color";
import ValueMini from "@/components/value/mini";
import {
  cardKindBorderClass,
  resolveWantGroupKind,
} from "@/components/badgeType/cardKind";

const WantGroupLabelUI = ({ wantGroup = null }) => {
  if (!wantGroup) return null;
  const { setShowNoOptionsAdv } = useContext(GridContext);
  const { name, type, tag, wants, value } = wantGroup;
  const empty = !(wants?.length);
  const kind = resolveWantGroupKind(wantGroup);

  useEffect(() => {
    if (empty) {
      setShowNoOptionsAdv(true);
    }
  }, [wants, setShowNoOptionsAdv, empty]);

  const tagStyle = useMemo(() => {
    return type === "tag" ? colorTagStyles(tag?.color) : null;
  }, [type, tag]);

  return (
    <div
      className={clsx(
        "h-8 w-64 border-b border-r flex items-center justify-between gap-1 pl-2",
        tagStyle ? "bg-white border-gray-300" : cardKindBorderClass(kind, 4),
        { "shadow-[inset_0_0_0_3px_red]": empty }
      )}
      style={tagStyle || undefined}
    >
      <h4 className="cropped_1 text-xs font-bold" title={name}>
        {`${name}${type === "tag" ? ` (${wants.length})` : ""}`}
      </h4>
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
