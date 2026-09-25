"use client";
import I18N, { getI18Ntext } from "@/i18n";
import useTagEditor from "./useTagEditor";
import Icon from "@/components/icon";
import clsx from "clsx";
import ErrorAlert from "@/components/errorAlert";

const ItemTagEditor = ({
  tag = null,
  className = "",
  onClose = () => {},
  initialItemIds = [],
}: {
  tag?: any;
  className?: string;
  onClose?: () => void;
  // Items to put in a newly created tag (e.g. the item it was created from).
  initialItemIds?: any[];
}) => {
  const {
    inputRef,
    name,
    setName,
    color,
    setColor,
    loading,
    error,
    onCancel,
    onSubmit,
    onDelete,
  } = useTagEditor(tag, onClose, initialItemIds);

  return (
    <div
      className={clsx(
        "relative border border-gray-200 rounded-[10px] transition-opacity p-2.5 bg-white text-gray-900",
        {
          "opacity-40": loading,
        },
        className
      )}
    >
      <h3 className="text-xs font-semibold text-gray-500 mb-2">
        <I18N id={`itemList.Tags.${tag ? "EditTag" : "NewTag"}`} />
      </h3>
      <div className="flex gap-2">
        <label className="text-xs font-semibold text-gray-500 flex-1">
          <span className="block mb-1">
            <I18N id="myItems.sidebar.form.GroupName" />{" "}
            <span className="text-primary">*</span>
          </span>
          <input
            type="text"
            value={name}
            placeholder={getI18Ntext("myItems.sidebar.form.GroupPlaceholder")}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium w-full focus:outline-none focus:border-primary"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
        </label>
        <label className="text-xs font-semibold text-gray-500">
          <span className="block mb-1">
            <I18N id="myItems.sidebar.form.Color" />{" "}
            <span className="text-primary">*</span>
          </span>
          <input
            type="color"
            name="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
            }}
            className="border border-gray-200 rounded-lg h-9 w-12 p-0.5 focus:outline-none"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2 text-sm mt-2">
        <button
          type="button"
          className="text-primary font-semibold px-2 py-1"
          onClick={onCancel}
          disabled={loading}
        >
          <I18N id="btn.Cancel" />
        </button>
        <button
          type="button"
          className="bg-primary hover:opacity-80 text-white rounded-full px-3 py-1 font-semibold"
          disabled={loading}
          onClick={onSubmit}
        >
          <I18N id="btn.Save" />
        </button>
        {tag ? (
          <button
            type="button"
            className="ml-2 text-lg leading-none text-red-600"
            data-tooltip={getI18Ntext("btn.Delete")}
            data-placement="left"
            disabled={loading}
            onClick={onDelete}
          >
            <Icon type="trash" />
          </button>
        ) : null}
      </div>
      <ErrorAlert error={error} className="mt-3" />
    </div>
  );
};

export default ItemTagEditor;
