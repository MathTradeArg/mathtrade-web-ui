"use client";
import Value from "@/components/value";
import useItemTagHeader from "./useItemTagHeader";
import WantButton from "@/components/want-button";
import Icon from "@/components/icon";
import { getI18Ntext } from "@/i18n";
import ItemTagEditor from "../item-tag-editor";
import { colorTagStyles } from "@/utils/color";

const ItemTagHeaderUI = () => {
  const {
    showingBans,
    tag,
    count,
    visibleEdit,
    setVisibleEdit,
    onChangeValue,
    canIEdit,
  } = useItemTagHeader();

  return showingBans || !tag ? null : (
    <div className="px-3 md:px-4 py-2 border-b border-gray-200 bg-white flex flex-wrap items-center gap-3">
      <span
        className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold"
        style={colorTagStyles(tag.color)}
      >
        {tag.name}
        {count ? ` · ${count}` : ""}
      </span>
      <Value type="tag" onChange={onChangeValue} />
      {tag?.items?.length > 0 ? <WantButton contextSize="md" /> : null}
      {canIEdit ? (
        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
          onClick={() => setVisibleEdit((v) => !v)}
          aria-label={getI18Ntext("itemList.Tags.Edit")}
        >
          <Icon type="edit" />
        </button>
      ) : null}
      {visibleEdit ? (
        <div className="w-full max-w-[280px]">
          <ItemTagEditor
            tag={tag}
            onClose={() => {
              setVisibleEdit(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ItemTagHeaderUI;
