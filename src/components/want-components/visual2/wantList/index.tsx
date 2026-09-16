"use client";
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

  return (
    <>
      {!wantsAdded.length ? (
        <h4 className="mb-5 italic text-gray-500">
          <I18N id="notOfferedVisual2" />
        </h4>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {wantsAdded.length
          ? wantsAdded.map((wantGroup) => {
              return (
                <WantGroupVisual2
                  key={wantGroup.id}
                  wantGroup={wantGroup}
                  itemId={itemId}
                />
              );
            })
          : null}

        {wantsToAdd.length && canIwant ? (
          <WantAddTile open={addOpen} onToggle={toggleAddOpen} />
        ) : null}
      </div>
      {addOpen && wantsToAdd.length && canIwant ? (
        <div
          className="bg-white mt-4 sm:p-4 p-3 border border-gray-200 rounded-xl relative z-10"
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
