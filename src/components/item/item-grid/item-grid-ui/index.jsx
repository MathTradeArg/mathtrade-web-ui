import clsx from "clsx";
import useItemGrid from "./useItemGrid";
import ItemMD from "./md";
import ItemXL from "./xl";

const ItemGridUI = ({ expanded, setExpanded }) => {
  const { itemNode, isExpanded, isCombo, typeNum, onToggleExpanse } =
    useItemGrid(expanded, setExpanded);

  const isExpansion = !isCombo && typeNum === 2;
  const cardKindClass = isCombo
    ? "border-gameCombo bg-gameCombo/5"
    : isExpansion
    ? "border-gameExpansion bg-gameExpansion/5"
    : "border-gameBase bg-gameBase/5";

  return (
    <article
      className={clsx("transition-[padding_0.2s]", {
        "col-span-full  pt-[100px]": isExpanded,
      })}
      ref={itemNode}
    >
      <div
        className={clsx(
          "transition-all relative mx-auto border-2 rounded-lg",
          cardKindClass,
          {
            "w-full h-full shadow-md hover:shadow-[0_3px_16px_rgba(0,0,0,0.25)]":
              !isExpanded,
            "shadow-xl w-full duration-700 max-w-5xl": isExpanded,
          }
        )}
      >
        {!isExpanded ? (
          <ItemMD onToggleExpanse={onToggleExpanse} />
        ) : (
          <ItemXL onToggleExpanse={onToggleExpanse} />
        )}
      </div>
    </article>
  );
};
export default ItemGridUI;
