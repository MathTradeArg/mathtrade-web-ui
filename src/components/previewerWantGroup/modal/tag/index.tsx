import Value from "@/components/value";
import useTag from "./useTag";
import ItemList from "./itemList";
import SuccessAlert from "@/components/successAlert";
import ErrorAlert from "@/components/errorAlert";
import InnerButton from "@/components/button/inner-button";
import Icon from "@/components/icon";
import clsx from "clsx";
import I18N from "@/i18n";
import { LoadingBox } from "@/components/loading";

const TagPreview = ({ wantGroup }) => {
  const {
    title,
    colorStyle,
    items,
    itemIds,
    value,
    //
    dup_protection,
    setDup_protection,
    itemIdsSelected,
    setItemIdsSelected,
    //
    putWant,
    notSelectedGame,
    showSuccessAlert,
    loading,
    error,
    //
    onChangeValue,
    //
    canIwant,
  } = useTag(wantGroup);

  return (
    <div className="pt-3">
      <div style={colorStyle}>
        <div className="py-3 px-5 flex items-center gap-4 border-b border-white/20">
          <div className="font-bold">
            <div className="text-xl">{`${title} (${items.length})`}</div>
          </div>
          <div>
            <Value
              size="tag"
              type="none"
              itemIds={itemIds}
              currentValue={value}
              onChange={onChangeValue}
            />
          </div>
        </div>
        <div className="py-3 px-5">
          <div className="p-3 bg-white text-gray-950 rounded-md">
            <ItemList
              items={items}
              dup_protection={dup_protection}
              setDup_protection={setDup_protection}
              itemIdsSelected={itemIdsSelected}
              setItemIdsSelected={setItemIdsSelected}
            />
          </div>
        </div>
      </div>

      {notSelectedGame ? (
        <div className="text-center pt-3 text-red-600">
          <I18N id="want.notSelectedGame" />
        </div>
      ) : null}
      {canIwant ? (
        <div className="text-center pt-5">
          {showSuccessAlert ? <SuccessAlert text="want.updated" /> : null}
          <ErrorAlert error={error} />
          <button
            className={clsx(
              "inline-flex items-center justify-center font-bold text-white bg-want px-5 py-2.5 rounded-full outline-none transition-opacity",
              loading ? "opacity-40" : "hover:opacity-90"
            )}
            disabled={loading}
            onClick={putWant}
          >
            <InnerButton>
              <Icon type={loading ? "loading" : "heart"} className="text-base" />
              <I18N id="btn.Want.updateWant" />
            </InnerButton>
          </button>
        </div>
      ) : null}
      <LoadingBox loading={loading} />
    </div>
  );
};

export default TagPreview;
