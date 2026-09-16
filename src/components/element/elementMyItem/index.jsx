import clsx from "clsx";
import ElementWrapperInside from "../elementCollection/elementWrapperInside";
import ElementCollection from "../elementCollection";
import ElementMyItemExtraData from "./extraData";

const ElementMyItem = ({ element, forAddElement, onCancel, header = null }) => {
  return (
    <ElementWrapperInside
      className={clsx(
        // The card carries its own depth now that the item around it is just a
        // spacing container with no background of its own.
        "shadow-md",
        forAddElement ? "border-8 border-item-400" : null
      )}
    >
      <ElementCollection
        element={element}
        insideItem
        header={header}
        // my-offer is a single 860px-wide edit list, not a grid of cards to
        // scan: the cover stays a narrow column beside the data.
        layout="row"
        extraContent={
          <ElementMyItemExtraData
            forAddElement={forAddElement}
            onCancel={onCancel}
          />
        }
      />
    </ElementWrapperInside>
  );
};
export default ElementMyItem;
