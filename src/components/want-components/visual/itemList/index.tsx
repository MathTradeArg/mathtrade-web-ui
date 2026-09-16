"use client";
import ItemToOffer from "./item";
import useItemList from "./useItemList";
import I18N from "@/i18n";
import { WantAddTile } from "@/components/want-components/mini-card";
import Icon from "@/components/icon";

const ItemList = ({ wantGroup = {}, myItemList = [] }) => {
  const {
    wantGroupId,
    itemsAdded,
    itemsToAdd,
    addOpen,
    toggleAddOpen,
    addPadRef,
    canIwant,
  } = useItemList(wantGroup, myItemList);

  return (
    <>
      {!itemsAdded.length ? (
        <h4 className="mb-5 italic text-gray-500">
          <I18N id="notOfferedVisual" />
        </h4>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {itemsAdded.length
          ? itemsAdded.map((item) => {
              return (
                <ItemToOffer
                  key={item.id}
                  item={item}
                  wantGroupId={wantGroupId}
                />
              );
            })
          : null}

        {itemsToAdd.length && canIwant ? (
          <WantAddTile open={addOpen} onToggle={toggleAddOpen} />
        ) : null}
      </div>
      {addOpen && itemsToAdd.length && canIwant ? (
        <div
          className="bg-white mt-4 sm:p-4 p-3 border border-gray-200 rounded-xl relative z-10"
          ref={addPadRef}
        >
          <div className="flex flex-wrap sm:gap-3 gap-2">
            {itemsToAdd.map((item) => {
              return (
                <ItemToOffer
                  key={item.id}
                  item={item}
                  toAdd
                  wantGroupId={wantGroupId}
                />
              );
            })}
          </div>
          <button
            type="button"
            className="sm:flex hidden absolute bg-gray-800 text-white -top-3 -right-3 w-6 h-6 rounded-full hover:bg-gray-400 transition-colors items-center justify-center"
            onClick={toggleAddOpen}
          >
            <Icon />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ItemList;
