import { useContext, useEffect, useMemo, useState } from "react";
import { PageContext } from "@/context/page";
import { MyWantsContext } from "@/context/myWants/all";
import { useOptions } from "@/store";
import { normalizeString } from "@/utils";

const useItemToWant = () => {
  const { setPageType, myItemsInMT_forWants } = useContext(PageContext);

  useEffect(() => {
    setPageType("wants-visual");
  }, [setPageType]);

  const { isLoadedWants, matchValues } = useContext(MyWantsContext);
  const filters = useOptions((state) => state.filters_wants);

  const myList = useMemo(() => {
    let myItemsFiltered = [...(myItemsInMT_forWants || [])];
    const filtersKeyword = filters?.keyword || null;

    if (filtersKeyword) {
      const filtersKeywordNormalized = normalizeString(filtersKeyword);
      myItemsFiltered = [...myItemsInMT_forWants].filter((item) => {
        return (
          normalizeString(item.title).indexOf(filtersKeywordNormalized) >= 0
        );
      });
    }

    const orderRaw = filters?.order || "type";
    const dir = orderRaw.indexOf("-") >= 0 ? -1 : 1;
    const order = orderRaw.replace("-", "");

    switch (order) {
      case "name":
        return myItemsFiltered.sort((a, b) => {
          return a.title < b.title ? -1 * dir : 1 * dir;
        });
      case "value":
        return myItemsFiltered.sort((a, b) => {
          const a_value = a.value === null ? 0 : parseFloat(a.value);
          const b_value = b.value === null ? 0 : parseFloat(b.value);

          if (a_value === b_value) {
            return a.title < b.title ? -1 : 1;
          } else {
            return a_value < b_value ? -1 * dir : 1 * dir;
          }
        });

      case "most_wanted": {
        const matches = Object.keys(matchValues || {}).map(
          (k) => k.split("_")[1]
        );
        return myItemsFiltered.sort((a, b) => {
          const a_count = matches.filter((v) => v === `${a.id}`).length;
          const b_count = matches.filter((v) => v === `${b.id}`).length;

          if (a_count === b_count) {
            return a.title < b.title ? -1 : 1;
          } else {
            return a_count < b_count ? -1 * dir : 1 * dir;
          }
        });
      }
      default:
        return myItemsFiltered;
    }
  }, [myItemsInMT_forWants, filters, matchValues]);

  const [readyToRender, setReadyToRender] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setReadyToRender(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  });

  return { isLoadedWants, myList, readyToRender };
};

export default useItemToWant;
