"use client";
import Icon from "../icon";
import { getI18Ntext } from "@/i18n";
import { useContext } from "react";
import { ItemContext } from "@/context/item";
import { PageContext } from "@/context/page";
import clsx from "clsx";

const Previewer = ({
  itemId = null,
  notooltip = false,
  className = "w-7 h-7",
  customMathtradeId = null,
}) => {
  const { item } = useContext(ItemContext);
  const { setItemPreviewId, setShowModalPreview, setCustomMathtradeId } =
    useContext(PageContext);

  return (
    <>
      <button
        type="button"
        className={clsx("hover:text-white hover:bg-primary", className)}
        onClick={() => {
          const id = itemId || item?.id;
          if (id) {
            setItemPreviewId(id);
            setCustomMathtradeId(customMathtradeId || null);
            setShowModalPreview(true);
          }
        }}
      >
        <span
          data-tooltip={notooltip ? null : getI18Ntext("Previewer.Preview")}
          data-placement={notooltip ? undefined : "left"}
          title={notooltip ? getI18Ntext("Previewer.Preview") : null}
        >
          <Icon type="eye" />
        </span>
      </button>
    </>
  );
};
export default Previewer;
