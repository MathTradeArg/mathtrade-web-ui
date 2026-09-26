"use client";
import clsx from "clsx";
import useWantList from "./useWantList";
import I18N from "@/i18n";
import WantGroupVisual2 from "./wantGroup";
import { WantAddTile } from "@/components/want-components/mini-card";
import Icon from "@/components/icon";

const WantListVisual2 = ({ item = null }) => {
  const {
    itemId,
    wantsAdded,
    wantsToAdd,
    addOpen,
    toggleAddOpen,
    addPadRef,
    canIwant,
  } = useWantList(item);

  const isEmpty = !wantsAdded.length;
  const canAdd = wantsToAdd.length > 0 && canIwant;

  return (
    <>
      <div
        className={clsx(
          "flex flex-wrap gap-3",
          isEmpty && "flex-1 items-stretch min-w-0"
        )}
      >
        {wantsAdded.map((wantGroup) => (
          <WantGroupVisual2
            key={wantGroup.id}
            wantGroup={wantGroup}
            itemId={itemId}
          />
        ))}

        {canAdd ? (
          <WantAddTile
            open={addOpen}
            onToggle={toggleAddOpen}
            size={isEmpty ? "anchor" : "mini"}
            caption={isEmpty ? "notOfferedVisual2" : ""}
            className={isEmpty ? "h-full w-full" : ""}
          />
        ) : isEmpty ? (
          <p className="italic text-gray-500 text-sm max-w-[11rem]">
            <I18N id="notOfferedVisual2" />
          </p>
        ) : null}
      </div>
      {addOpen && wantsToAdd.length > 0 && canIwant ? (
        <div
          className="bg-white mt-4 sm:p-4 p-3 border border-gray-200 rounded-xl relative z-raised"
          ref={addPadRef}
        >
          <div className="flex flex-wrap sm:gap-3 gap-2">
            {wantsToAdd.map((wantGroup) => {
              return (
                <WantGroupVisual2
                  key={wantGroup.id}
                  wantGroup={wantGroup}
                  toAdd
                  itemId={itemId}
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

export default WantListVisual2;
