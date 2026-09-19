import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageContext } from "@/context/page";
import { MyWantsContext } from "@/context/myWants/all";
import { WantVisualSectionContext } from "@/context/wantVisualSection";
import { getRightValue } from "@/components/want-components/utils";

const useWantList = (item = null) => {
  const itemId = item?.id;
  const { canI, myWants } = useContext(PageContext);
  const { matchValues, changes } = useContext(MyWantsContext);
  const { setForceShow } = useContext(WantVisualSectionContext);

  const [addOpen, setAddOpen] = useState(false);

  const toggleAddOpen = useCallback(() => {
    setAddOpen((v) => !v);
  }, []);

  useEffect(() => {
    setForceShow(addOpen);
  }, [setForceShow, addOpen]);

  const addPadRef = useRef(null);

  useEffect(() => {
    let timer = null;
    if (addOpen) {
      timer = setTimeout(() => {
        addPadRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [addOpen]);

  const { wantsAdded, wantsToAdd } = useMemo(() => {
    const wantsAdded = [];
    const wantsToAdd = [];

    (myWants || []).forEach((wg) => {
      const value = getRightValue(matchValues, changes, `${wg.id}_${itemId}`);
      if (value) {
        wantsAdded.push(wg);
      } else if (canI.want) {
        wantsToAdd.push(wg);
      }
    });

    if (!wantsToAdd.length) {
      setAddOpen(false);
    }

    return { wantsAdded, wantsToAdd };
  }, [myWants, itemId, canI, matchValues, changes]);

  return {
    itemId,
    wantsAdded,
    wantsToAdd,
    addOpen,
    toggleAddOpen,
    addPadRef,
    canIwant: canI.want,
  };
};

export default useWantList;
