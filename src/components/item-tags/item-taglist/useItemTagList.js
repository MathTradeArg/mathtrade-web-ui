import { useCallback, useContext, useMemo } from "react";
import useFetch from "@/hooks/useFetch";
import { PageContext } from "@/context/page";
import { ItemContext } from "@/context/item";

const useItemTagList = () => {
  /* PAGE CONTEXT **********************************************/
  const { itemTags, setItemTags, canI } = useContext(PageContext);
  /* end PAGE CONTEXT */

  /* ITEM CONTEXT **********************************************/
  const { item } = useContext(ItemContext);

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

  const afterLoad = useCallback(() => {
    // My own tags are inherently bounded to one user's own entries - request
    // the max page size so they aren't silently truncated at the default (50).
    getTagList({ params: { page_size: 200 } });
  }, [getTagList]);

  const [putTag, , loadingUpdateTag] = useFetch({
    endpoint: "PUT_MYTAGS",
    method: "PUT",
    afterLoad,
  });

  const updateTag = useCallback(
    (id, params) => {
      putTag({
        urlParams: [id],
        params,
      });
    },
    [putTag]
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
  };
};

export default useItemTagList;
