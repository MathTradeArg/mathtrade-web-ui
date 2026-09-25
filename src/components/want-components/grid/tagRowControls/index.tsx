"use client";
import { useCallback, useContext, useState } from "react";
import clsx from "clsx";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";
import Modal from "@/components/modal";

/* Controls on a tag row of the wants grid: a labelled duplicate-protection
 * toggle and a pencil that opens the tag editor in a modal (above the grid).
 * Saved via the tag endpoint (a new tag's want can be empty, which the want
 * endpoint rejects) and applied locally, without reloading the grid. */
const TagRowControls = ({ wantGroup }: { wantGroup: any }) => {
  const { setMyWants, canI } = useContext(PageContext);
  const tag = wantGroup.tag || {};
  // The want's name mirrors the tag's name (kept in sync by the backend).
  const tagName = tag.name || wantGroup.name || "";
  const protectedDup = wantGroup.dup_protection !== false;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tagName);
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
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        disabled={saving}
        className={clsx(
          "text-[10px] font-semibold rounded-full px-1.5 py-[1px] whitespace-nowrap border",
          protectedDup
            ? "border-green-600 text-green-700 bg-white"
            : "border-orange-500 text-orange-700 bg-white"
        )}
        title={getI18Ntext(protectedDup ? "tagRow.dup.on" : "tagRow.dup.off")}
        onClick={() =>
          save({ name: tagName, color: tag.color, dup_protection: !protectedDup })
        }
      >
        <I18N id={protectedDup ? "tagRow.dup.onShort" : "tagRow.dup.offShort"} />
      </button>
      {error && !editing ? (
        <span className="text-[10px] text-red-600" title={getI18Ntext("tagWant.error")}>
          !
        </span>
      ) : null}
      <button
        type="button"
        className="text-xs leading-none"
        title={getI18Ntext("tagRow.edit")}
        onClick={() => {
          setName(tagName);
          setColor(tag.color || "#999999");
          setDup(protectedDup);
          setEditing(true);
        }}
      >
        <Icon type="edit" />
      </button>
      <Modal size="sm" isOpen={editing} onClose={() => setEditing(false)}>
        <div className="text-left">
          <h3 className="font-bold text-lg mb-3">
            <I18N id="tagRow.edit" />
          </h3>
          <label className="block text-sm mb-1">
            <I18N id="tagRow.name" />
          </label>
          <input
            className="w-full border border-stroke rounded p-2 text-sm mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm mb-3">
            <I18N id="tagRow.color" />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label className="flex items-start gap-2 text-sm mb-1 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={dup}
              onChange={(e) => setDup(e.target.checked)}
            />
            <span className="font-semibold">
              <I18N id="tagRow.dup.switch" />
            </span>
          </label>
          <p className="text-xs text-gray-600 mb-4">
            <I18N id="tagRow.dup.help" />
          </p>
          {error ? (
            <p className="text-sm text-red-600 mb-3">
              <I18N id="tagWant.error" />
            </p>
          ) : null}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="rounded-full border border-gray-300 text-sm px-4 py-1"
              onClick={() => setEditing(false)}
            >
              <I18N id="btn.Cancel" />
            </button>
            <button
              type="button"
              disabled={saving || !name.trim()}
              className="rounded-full bg-primary text-white text-sm px-4 py-1"
              onClick={() => save({ name: name.trim(), color, dup_protection: dup })}
            >
              <I18N id="btn.Save" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TagRowControls;
