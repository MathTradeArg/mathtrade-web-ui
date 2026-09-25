import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { PageContext } from "@/context/page";
import { MyWantsContext } from "@/context/myWants/all";
import { GridContext } from "@/context/myWants/grid";
import { useOptions } from "@/store";
import { normalizeString } from "@/utils";
import useFetch from "@/hooks/useFetch";

// My own tags are few; one page covers them (as the other tag consumers do).
// Module-level so useFetch's autoLoad doesn't refetch on every render.
const TAGS_PARAMS = { page_size: 200 };

const idsOf = (list: any[] = []) =>
  list.map((x) => (typeof x === "object" && x !== null ? x.id : x));

const orders: Record<string, number> = {
  game: 0,
  tag: 1,
  item: 2,
};

const useGrid = () => {
  /* PAGE CONTEXT **********************************************/
  const { setPageType, myWants, myGroups_forWants, myItemsInMT_forWants } =
    useContext(PageContext);

  useEffect(() => {
    setPageType("wants-grid");
  }, [setPageType]);
  /* end PAGE CONTEXT */

  /* MYWANTS CONTEXT **********************************************/
  const { isLoadedWants } = useContext(MyWantsContext);
  /* end MYWANTS CONTEXT **********************************************/

  /* GRID CONTEXT **********************************************/
  const { setGroupsVisible, showNoOptionsAdv } = useContext(GridContext);
  /* end GRID CONTEXT **********************************************/

  /* FILTERS */
  const filters = useOptions((state) => state.filters_wants);
  /* end FILTERS */

  /* WANTLIST **********************************************/
  const wantList = useMemo(() => {
    let myWantsFiltered = [...myWants];

    const filtersKeyword = filters?.keyword || null;

    if (filtersKeyword) {
      const filtersKeywordNormalized = normalizeString(filtersKeyword);
      myWantsFiltered = [...myWants].filter((w) => {
        return normalizeString(w.name).indexOf(filtersKeywordNormalized) >= 0;
      });
    }

    const orderRaw = filters?.order || "type";

    const dir = orderRaw.indexOf("-") >= 0 ? -1 : 1;

    const order = orderRaw.replace("-", "");

    switch (order) {
      case "name":
        return myWantsFiltered.sort((a, b) => {
          return a.name < b.name ? -1 * dir : 1 * dir;
        });
      case "value":
        return myWantsFiltered.sort((a, b) => {
          const a_value = a.value === null ? 0 : parseFloat(a.value);
          const b_value = b.value === null ? 0 : parseFloat(b.value);

          if (a_value === b_value) {
            return a.name < b.name ? -1 : 1;
          } else {
            return a_value < b_value ? -1 * dir : 1 * dir;
          }
        });

      case "most_wanted":
        return myWantsFiltered.sort((a, b) => {
          const a_items = a?.items?.length || 0;
          const b_items = b?.items?.length || 0;

          if (a_items === b_items) {
            return a.title < b.title ? -1 : 1;
          } else {
            return a_items < b_items ? -1 * dir : 1 * dir;
          }
        });
      default:
        return myWantsFiltered.sort((a, b) => {
          if (orders[a.type] === orders[b.type]) {
            return a.name < b.name ? -1 * dir : 1 * dir;
          } else {
            return orders[a.type] < orders[b.type] ? -1 * dir : 1 * dir;
          }
        });
    }
  }, [myWants, filters]);

  /* end WANTLIST **********************************************/

  /* TAG SECTIONS (MAT-136) ****************************************/
  // With the default order, rows are grouped under a header per color tag
  // (like item columns are grouped by item group). A want with several tags
  // is repeated in each section, marked with the other tags; the cells of
  // the repeats read and write the same want/item pairs.
  const [, tagsData] = useFetch({
    endpoint: "MYTAGS",
    initialState: { results: [] },
    params: TAGS_PARAMS,
    autoLoad: true,
  });

  const rows = useMemo(() => {
    const tags = [...(tagsData?.results || [])].sort((a: any, b: any) =>
      a.name < b.name ? -1 : 1
    );
    const order = (filters?.order || "type").replace("-", "");
    if (order !== "type" || !tags.length) return wantList;

    const tagItemIds = tags.map((tag: any) => new Set(idsOf(tag.items)));
    const tagsOfWant = (want: any) =>
      tags.filter((tag: any, i: number) =>
        want.type === "tag"
          ? (want.tag?.id ?? want.tag) === tag.id
          : idsOf(want.wants).some((id) => tagItemIds[i].has(id))
      );

    const wantTags = new Map(wantList.map((w: any) => [w.id, tagsOfWant(w)]));
    const result: any[] = [];

    tags.forEach((tag: any) => {
      const inTag = wantList
        .filter((w: any) => wantTags.get(w.id).some((t: any) => t.id === tag.id))
        // The tag's own "everything with this tag" want goes first.
        .sort((a: any, b: any) => (a.type === "tag" ? -1 : b.type === "tag" ? 1 : 0));
      if (!inTag.length) return;
      result.push({ isTagHeader: true, _key: `tag-${tag.id}`, tag, count: inTag.length });
      inTag.forEach((w: any) => {
        result.push({
          ...w,
          _key: `${tag.id}_${w.id}`,
          otherTags: wantTags.get(w.id).filter((t: any) => t.id !== tag.id),
        });
      });
    });

    const untagged = wantList.filter((w: any) => !wantTags.get(w.id).length);
    if (untagged.length) {
      result.push({ isTagHeader: true, _key: "tag-none", tag: null, count: untagged.length });
      result.push(...untagged);
    }
    return result;
  }, [wantList, tagsData, filters]);
  /* end TAG SECTIONS ************************************************/

  const mostOfferedItemsObj = useMemo(() => {
    const order = (filters?.order || "type").replace("-", "");

    if (order === "most_wanted") {
      return myWants.reduce((obj, w) => {
        w.items.forEach((itemId) => {
          if (!obj[itemId]) {
            obj[itemId] = 0;
          }
          obj[itemId] += 1;
        });
        return obj;
      }, {});
    }

    return {};
  }, [myWants, filters]);

  /* MYITEMLIST **********************************************/
  const { myItemList, newGroupsVisible } = useMemo(() => {
    const [groupObj, newGroupsVis] = myGroups_forWants.reduce(
      (arr: [Record<string, any>, Record<string, boolean>], group) => {
        const { id, name, color, item_ids } = group;
        if (item_ids.length) {
          arr[0][id] = { isGroup: true, id, name, color, items: [] };
          arr[1][id] = false;
        }

        return arr;
      },
      [{}, {}]
    );

    const allItemsAlone = [];

    const myItemsInMT = (() => {
      const orderRaw = filters?.order || "type";

      const dir = orderRaw.indexOf("-") >= 0 ? -1 : 1;

      const order = orderRaw.replace("-", "");

      switch (order) {
        case "name":
          return [...myItemsInMT_forWants].sort((a, b) => {
            return a.title < b.title ? -1 * dir : 1 * dir;
          });
        case "value":
          return [...myItemsInMT_forWants].sort((a, b) => {
            const a_value = a.value === null ? 0 : parseFloat(a.value);
            const b_value = b.value === null ? 0 : parseFloat(b.value);

            if (a_value === b_value) {
              return a.title < b.title ? -1 : 1;
            } else {
              return a_value < b_value ? -1 * dir : 1 * dir;
            }
          });
        case "most_wanted":
          return [...myItemsInMT_forWants].sort((a, b) => {
            const a_count = mostOfferedItemsObj[a.id] || 0;
            const b_count = mostOfferedItemsObj[b.id] || 0;

            if (a_count === b_count) {
              return a.title < b.title ? -1 : 1;
            } else {
              return a_count < b_count ? -1 * dir : 1 * dir;
            }
          });
        default:
          return [...myItemsInMT_forWants];
      }
    })();

    myItemsInMT.forEach((itm) => {
      const { group } = itm;

      if (group && groupObj[group.id]) {
        groupObj[group.id].items.push(itm);
      } else {
        allItemsAlone.push(itm);
      }
    });

    const allItemsInGroups = [];

    Object.values(groupObj)
      .filter((g: any) => g.items.length)
      .forEach((group: any) => {
        const { color: colorGroup, items } = group;
        delete group.items;

        allItemsInGroups.push({
          ...group,
          count: items.length,
          items: items.map((itm) => itm.id),
        });

        const color = colorGroup + "25";
        // Grouped items show the group's score: the minimum of its items
        // (MAT-137; same rule as the backend's autocomplete).
        const values = items
          .map((itm) => itm.value)
          .filter((v) => v !== null && v !== undefined)
          .map(Number);
        const groupValue = values.length ? Math.min(...values) : null;

        items.forEach((item) => {
          allItemsInGroups.push({
            ...item,
            color,
            value: groupValue,
          });
        });
      });

    //

    return {
      myItemList: [""].concat(allItemsInGroups.concat(allItemsAlone)),
      newGroupsVisible: newGroupsVis,
    };
  }, [myGroups_forWants, myItemsInMT_forWants, filters, mostOfferedItemsObj]);
  /* end MYITEMLIST **********************************************/

  /* READY TO RENDER **********************************************/
  const [readyToRender, setReadyToRender] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => {
      setReadyToRender(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  });
  /* end READY TO RENDER **********************************************/

  const emptyWants = useMemo(() => {
    return (isLoadedWants && !myWants.length) || false;
  }, [isLoadedWants, myWants]);

  const rootRef = useRef(null);

  useEffect(() => {
    if (setGroupsVisible && newGroupsVisible) {
      setGroupsVisible(newGroupsVisible);
    }
  }, [setGroupsVisible, newGroupsVisible]);

  return {
    emptyWants,
    wantList: rows,
    myItemList,
    readyToRender,
    rootRef,
    showNoOptionsAdv,
  };
};

export default useGrid;
