import { useCallback, useContext } from "react";
import { PageContext } from "@/context/page";
import { MyWantsContext } from "@/context/myWants/all";

const useItem = (item = null, wantGroupId = null) => {
  const { id } = item || {};
  const { canI } = useContext(PageContext);
  const { setChanges } = useContext(MyWantsContext);

  const onToggle = useCallback(
    (valueToChange) => {
      setChanges((oldChanges) => {
        const oldChangesCopy = { ...oldChanges };
        oldChangesCopy[`${wantGroupId}_${id}`] = valueToChange;
        return oldChangesCopy;
      });
    },
    [setChanges, wantGroupId, id]
  );

  return { onToggle, canIwant: canI.want };
};

export default useItem;
