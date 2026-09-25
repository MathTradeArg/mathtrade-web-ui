"use client";
import { useCallback, useContext, useState } from "react";
import clsx from "clsx";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";

/* Controls on a tag row of the wants grid: a one-click duplicate-protection
 * shield and a pencil to edit the tag (name, color, protection). Saved via
 * the tag endpoint (a new tag's want can be empty, which the want endpoint
 * rejects) and applied locally, without reloading the grid. */
const TagRowControls = ({ wantGroup }: { wantGroup: any }) => {
  const { setMyWants, canI } = useContext(PageContext);
  const tag = wantGroup.tag || {};
  const protectedDup = wantGroup.dup_protection !== false;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name || wantGroup.name || "");
  const [color, setColor] = useState(tag.color || "#999999");
  const [dup, setDup] = useState(protectedDup);

  const afterLoad = useCallback(
    (saved: any) => {
      setMyWants((wants: any[]) =>
        wants.map((w) =>
          w.id === wantGroup.id
            ? {
                ...w,
                name: saved?.name ?? w.name,
                dup_protection: saved?.dup_protection ?? w.dup_protection,
                tag: { ...(w.tag || {}), name: saved?.name, color: saved?.color },
              }
            : w
        )
      );
      setEditing(false);
    },
    [wantGroup.id, setMyWants]
  );

  const [saveTag, , saving, error] = useFetch({
    endpoint: "PUT_MYTAGS",
    method: "PUT",
    afterLoad,
  });

  const save = (values: { name: string; color: string; dup_protection: boolean }) =>
    saveTag({ urlParams: [tag.id], params: values });

  if (!tag.id || !canI?.want) return null;

  return (
    <div className="relative flex items-center gap-1">
      <button
        type="button"
        disabled={saving}
        className={clsx("text-sm leading-none", { "opacity-30 grayscale": !protectedDup })}
        title={getI18Ntext(protectedDup ? "tagRow.dup.on" : "tagRow.dup.off")}
        onClick={() =>
          save({ name: tag.name, color: tag.color, dup_protection: !protectedDup })
        }
      >
        🛡
      </button>
      <button
        type="button"
        className="text-xs leading-none"
        title={getI18Ntext("tagRow.edit")}
        onClick={() => {
          setName(tag.name || "");
          setColor(tag.color || "#999999");
          setDup(protectedDup);
          setEditing((v) => !v);
        }}
      >
        <Icon type="edit" />
      </button>
      {editing ? (
        <div className="absolute top-7 left-0 z-50 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-left">
          <p className="font-bold text-sm mb-2">
            <I18N id="tagRow.edit" />
          </p>
          <label className="block text-xs mb-1">
            <I18N id="tagRow.name" />
          </label>
          <input
            className="w-full border border-stroke rounded p-1 text-sm mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="flex items-center gap-2 text-xs mb-2">
            <I18N id="tagRow.color" />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label className="flex items-start gap-2 text-xs mb-1 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={dup}
              onChange={(e) => setDup(e.target.checked)}
            />
            <span className="font-semibold">
              <I18N id="tagRow.dup.switch" />
            </span>
          </label>
          <p className="text-[11px] text-gray-600 mb-3">
            <I18N id="tagRow.dup.help" />
          </p>
          {error ? (
            <p className="text-xs text-red-600 mb-2">
              <I18N id="tagWant.error" />
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving || !name.trim()}
              className="rounded-full bg-primary text-white text-xs px-3 py-1"
              onClick={() => save({ name: name.trim(), color, dup_protection: dup })}
            >
              <I18N id="btn.Save" />
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-300 text-xs px-3 py-1"
              onClick={() => setEditing(false)}
            >
              <I18N id="btn.Cancel" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TagRowControls;
