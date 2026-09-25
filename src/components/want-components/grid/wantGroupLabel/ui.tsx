"use client";
import { useContext, useEffect, useMemo } from "react";
import PreviewerWantGroup from "@/components/previewerWantGroup";
import { GridContext } from "@/context/myWants/grid";
import clsx from "clsx";
import { colorTagStyles } from "@/utils/color";
import ValueMini from "@/components/value/mini";
import { getI18Ntext } from "@/i18n";
import {
  cardKindBorderClass,
  resolveWantGroupKind,
} from "@/components/badgeType/cardKind";

const WantGroupLabelUI = ({ wantGroup = null }) => {
  const { setShowNoOptionsAdv } = useContext(GridContext);
  const { name, type, tag, wants, value, otherTags } = wantGroup || {};
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
        <h4 className="cropped_1 text-xs font-bold" title={name}>
          {`${name}${type === "tag" ? ` (${wants.length})` : ""}`}
        </h4>
        {otherTags?.length ? (
          // Also in other tag sections: tiny dots, names on hover (MAT-136).
          <span
            className="flex items-center gap-[2px] shrink-0"
            title={`${getI18Ntext("grid.alsoIn")}: ${otherTags
              .map((t: any) => t.name)
              .join(", ")}`}
          >
            {otherTags.map((t: any) => (
              <span
                key={t.id}
                className="w-1.5 h-1.5 rounded-full border border-gray-400"
                style={{ backgroundColor: t.color || "#fff" }}
              />
            ))}
          </span>
        ) : null}
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
