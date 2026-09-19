"use client";
import { useState } from "react";
import I18N from "@/i18n";
import Icon from "@/components/icon";
import ItemTagEditor from "./item-tag-editor";

const NewItemTag = () => {
  const [visibleEdit, setVisibleEdit] = useState(false);

  return visibleEdit ? (
    <ItemTagEditor
      onClose={() => {
        setVisibleEdit(false);
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
