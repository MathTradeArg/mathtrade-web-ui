import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { PageContext } from "@/context/page";
import { ItemContext } from "@/context/item";

const useItemTagList = () => {
  /* PAGE CONTEXT **********************************************/
  const { itemTags, setItemTags, setMyWants, canI, setMustConfirm } =
    useContext(PageContext);
  /* end PAGE CONTEXT */

  /* ITEM CONTEXT **********************************************/
  const { item, wantedViaTag, wantGroup, tagWant } = useContext(ItemContext);
  // Which notice to show after a tag change: "untagged" | "moved" | "" (none).
  const [notice, setNotice] = useState("");

  const { id: itemId, isOwned, isSameBGGId } = item;
  /* end ITEM CONTEXT */

  const afterLoadItemTags = useCallback(
    ({ results }) => {
      const tags = results.map((tag, i) => {
        return {
          ...tag,
          id: `${tag?.id || i}`,
          itemsComplete: tag.items,
          items: tag.items.map(({ id }) => id),
        };
      });
      setItemTags(tags);
    },
    [setItemTags]
  );

  const [getTagList, , loadingTags] = useFetch({
    endpoint: "MYTAGS",
    initialState: { results: [] },
    afterLoad: afterLoadItemTags,
  });

  // Untagging an item that was wanted through its tag keeps it wanted as its
  // own want (backend). Reload wants (one call) so the item doesn't look
  // unwanted, which could lead to wanting it again as a duplicate.
  const [loadMyWants] = useFetch({
    endpoint: "MYWANTS",
    initialState: { results: [] },
    afterLoad: useCallback(
      ({ results }) => {
        if (results) setMyWants(results);
      },
      [setMyWants]
    ),
  });
  // A ref, not state: it is set right before the PUT and read in its
  // afterLoad, which would otherwise see a stale value.
  const pendingNotice = useRef(false);

  const afterLoad = useCallback(() => {
    // My own tags are inherently bounded to one user's own entries - request
    // the max page size so they aren't silently truncated at the default (50).
    getTagList({ params: { page_size: 200 } });
    // Tagging an item wanted on its own moves it into the tag's want
    // (backend): same reload, and the member has to commit again.
    if (pendingNotice.current) {
      if (pendingNotice.current === "moved") setMustConfirm(true);
      setNotice(pendingNotice.current);
      pendingNotice.current = false;
      loadMyWants({ params: { page_size: 200 } });
    }
  }, [getTagList, loadMyWants, setMustConfirm]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(
      () => setNotice(""),
      notice === "moved" ? 20000 : 8000
    );
    return () => clearTimeout(timer);
  }, [notice]);

  const [putTag, , loadingUpdateTag] = useFetch({
    endpoint: "PUT_MYTAGS",
    method: "PUT",
    afterLoad,
  });

  const updateTag = useCallback(
    (id, params, { removingThisItem = false } = {}) => {
      if (removingThisItem && wantedViaTag) pendingNotice.current = "untagged";
      const tagging = (params?.items || []).some((i) => `${i}` === `${itemId}`);
      if (!removingThisItem && tagging && wantGroup) {
        pendingNotice.current = "moved";
      }
      putTag({
        urlParams: [id],
        params,
      });
    },
    [putTag, wantedViaTag, wantGroup, itemId]
  );

  const tagCollection = useMemo(() => {
    const current = [];
    const options = [];

    if (itemId && itemTags.length) {
      itemTags.forEach((t) => {
        if (t.items.map((tId) => `${tId}`).indexOf(`${itemId}`) >= 0) {
          current.push(t);
        } else {
          options.push(t);
        }
      });
    }
    return { current, options };
  }, [itemId, itemTags]);

  return {
    isOwned,
    isSameBGGId,
    itemId,
    tagCollection,
    updateTag,
    loadingUpdateTag,
    loadingTags,
    canIEdit: canI.want || canI.offer,
    notice,
    tagWant,
  };
};

export default useItemTagList;
