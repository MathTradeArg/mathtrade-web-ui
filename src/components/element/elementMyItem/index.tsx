"use client";
import clsx from "clsx";
import ElementWrapperInside from "../elementCollection/elementWrapperInside";
import ElementCollection from "../elementCollection";
import ElementMyItemExtraData from "./extraData";
import type { ReactNode } from "react";

const ElementMyItem = ({
  element = null,
  forAddElement = false,
  onCancel = undefined,
  header = null,
}: {
  element?: any;
  forAddElement?: boolean;
  onCancel?: () => void;
  header?: ReactNode;
}) => {
  return (
    <ElementWrapperInside
      className={clsx(
        "shadow-md",
        forAddElement ? "border-4 border-dashed border-want" : null
      )}
    >
      <ElementCollection
        element={element}
        insideItem
        header={header}
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
