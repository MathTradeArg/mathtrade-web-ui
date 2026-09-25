"use client";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/sidebar";
import I18N from "@/i18n";
import Icon from "@/components/icon";
import ItemTagEditor from "./item-tag-editor";

const NewItemTag = () => {
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [initialItemIds, setInitialItemIds] = useState<any[]>([]);
  const { intent, setIntent } = useContext(SidebarContext);

  // "Crear etiqueta…" from an item card opens the filters panel with this
  // editor already open, and the new tag is created with that item in it.
  useEffect(() => {
    if (intent?.type === "newTag") {
      setInitialItemIds(intent.itemId ? [intent.itemId] : []);
      setVisibleEdit(true);
      setIntent(null);
    }
  }, [intent, setIntent]);

  return visibleEdit ? (
    <ItemTagEditor
      initialItemIds={initialItemIds}
      onClose={() => {
        setVisibleEdit(false);
        setInitialItemIds([]);
      }}
      className="mt-2"
    />
  ) : (
    <button
      type="button"
      className="inline-flex items-center gap-1 mt-2 text-primary text-sm font-semibold hover:text-sky-700"
      onClick={() => setVisibleEdit(true)}
    >
      <Icon type="plus" className="text-sm" />
      <I18N id="itemList.Tags.NewTag" />
    </button>
  );
};

export default NewItemTag;
