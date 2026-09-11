import I18N from "@/i18n";
import Previewer from "@/components/previewer";
import UserBox from "@/components/userBox";
import { useContext } from "react";
import { ItemContext } from "@/context/item";
import clsx from "clsx";
import ValueMini from "@/components/value/mini";
import ElementXS from "./element";

const ItemXSUI = ({
  className = "",
  extraContent = null,
  dark = false,
  hideUser = false,
  hideValue = false,
}) => {
  const { item } = useContext(ItemContext);

  const { isCombo, elements, value } = item;

  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-lg border border-item-700/40 shadow-sm text-black p-2.5",
        {
          "bg-item-200": !isCombo,
          "bg-item-300": isCombo,
        },
        className
      )}
    >
      {extraContent ? <div className="pt-1.5 shrink-0">{extraContent}</div> : null}
      <div className="grow min-w-0 flex flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          {isCombo ? (
            <h3 className="uppercase text-[9px] font-bold text-gray-900 leading-none">
              <I18N id="element-type-badge-0" />
            </h3>
          ) : null}
          {elements.map((element) => {
            return (
              <ElementXS key={element.id} element={element} isCombo={isCombo} />
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!hideUser ? <UserBox toLeft /> : null}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {!hideValue ? <ValueMini currentValue={value} /> : null}
            <Previewer />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemXSUI;
