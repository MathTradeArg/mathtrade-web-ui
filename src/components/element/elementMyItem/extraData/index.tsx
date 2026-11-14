import { useCallback, useState, lazy } from "react";
import ExtraDataView from "./view";
import RemoveElement from "./removeElement";
import Dynamic from "@/components/dynamic";

const ExtraDataEditor = lazy(() => import("./editor"));

const ElementMyItemExtraData = ({
  forAddElement = false,
  onCancel = undefined,
}: {
  forAddElement?: boolean;
  onCancel?: () => void;
}) => {
  // EDITING MODE *************************************/
  const [editingMode, setEditingMode] = useState(forAddElement);
  const toggleEditingMode = useCallback(() => {
    setEditingMode((v) => !v);
  }, []);
  // end EDITING MODE *************************************/

  return (
    <>
      <div className="border border-line p-3 rounded-lg bg-white/60 relative">
        {editingMode ? (
          <Dynamic h={600}>
            <ExtraDataEditor
              toggleEditingMode={toggleEditingMode}
              onCancel={onCancel}
              forAddElement={forAddElement}
            />
          </Dynamic>
        ) : (
          <ExtraDataView toggleEditingMode={toggleEditingMode} />
        )}
      </div>
      <RemoveElement />
    </>
  );
};
export default ElementMyItemExtraData;
