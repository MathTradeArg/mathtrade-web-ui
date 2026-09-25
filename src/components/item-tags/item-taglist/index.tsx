"use client";
import { colorTagStyles } from "@/utils/color";
import useItemTagList from "./useItemTagList";
import Icon from "@/components/icon";
import AddTag from "./addTag";

const ItemTagList = () => {
  const {
    isOwned,
    isSameBGGId,
    itemId,
    tagCollection,
    updateTag,
    loadingUpdateTag,
    loadingTags,
    canIEdit,
  } = useItemTagList();

  return isOwned || isSameBGGId ? null : (
    <div className="flex flex-wrap items-center gap-1.5">
      {tagCollection.current.map((tag) => {
        const { id, color, name, items } = tag;

        return (
          <div
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
            style={colorTagStyles(color)}
            key={id}
          >
            <span className="whitespace-nowrap">{name}</span>
            {canIEdit ? (
              <button
                type="button"
                className="opacity-80 hover:opacity-100"
                onClick={() => {
                  if (!loadingUpdateTag && !loadingTags) {
                    updateTag(id, {
                      bgg_id: "",
                      protected_dup: true,
                      items: items.filter((itmId) => itmId !== itemId),
                      color,
                      name,
                    });
                  }
                }}
              >
                <Icon
                  type={loadingUpdateTag || loadingTags ? "loading" : "close"}
                  className="text-[11px]"
                />
              </button>
            ) : null}
          </div>
        );
      })}
      {/* An item has at most one tag: once tagged, no "+ Agregar etiqueta". */}
      {canIEdit && !tagCollection.current.length ? (
        <AddTag
          updateTag={updateTag}
          options={tagCollection.options}
          itemId={itemId}
          loading={loadingUpdateTag || loadingTags}
        />
      ) : null}
    </div>
  );
};
export default ItemTagList;
