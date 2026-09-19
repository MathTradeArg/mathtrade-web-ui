import { useState, useContext, useMemo, useEffect, useCallback } from "react";
import { noBGGgame } from "@/config/no-bgggame";
import useFetch from "@/hooks/useFetch";
import { extractBGGdataFromElement } from "@/utils/bgg";
import { getI18Ntext } from "@/i18n";
import { PageContext } from "@/context/page";

const useStepSearchBGG = ({ newBGGinfo, setnewBGGinfo }) => {
  const [searchType, setSearchType] = useState(0);

  /* PAGE CONTEXT **********************************************/
  const { myCollectionBGGids } = useContext(PageContext);
  /* end PAGE CONTEXT *********************************************/

  const alreadyHaveThisBGGid = useMemo(() => {
    const bggId = newBGGinfo.element.bgg_id;

    if (bggId === noBGGgame.element.bgg_id) {
      return false;
    }

    return myCollectionBGGids.indexOf(bggId) >= 0;
  }, [myCollectionBGGids, newBGGinfo]);

  //////////////////////////

  const [searchResultBGG, setSearchResultBGG] = useState(null);

  const [elementToShow, setElementToShow] = useState(null);

  const afterLoad = useCallback(
    (bggData) => {
      const o = {
        ...bggData,
        element: {
          ...bggData.element,
          ...searchResultBGG,
        },
      };

      if (searchResultBGG.bgg_version_id && bggData.versions.length) {
        const v = bggData.versions.find((version) => {
          return version.value === searchResultBGG.bgg_version_id;
        });

        if (v) {
          o.element.thumbnail = v.thumbnail || o.element.thumbnail;
          o.element.language = v.language || "";
          o.element.publisher = v.publisher || "";
          o.element.year = v.year || "";
        }
      }
      setElementToShow({
        thumbnail: o.element.thumbnail,
        title: o.element.name,
        type: getI18Ntext(`element-type-badge-${o.game.type}`),
        game: o.game,
        titleLink: `https://boardgamegeek.com/boardgame/${o.game.bgg_id}/`,
      });
      setnewBGGinfo(o);
    },
    [searchResultBGG, setnewBGGinfo],
  );

  const [getBGGelement, , loading] = useFetch({
    endpoint: "BGG_GET_GAME",
    initialState: {
      game: null,
      thumbnail: "",
      versions: [],
    },
    format: extractBGGdataFromElement,
    afterLoad,
  });

  useEffect(() => {
    if (searchResultBGG) {
      //
      getBGGelement({ urlParams: [searchResultBGG.bgg_id] });
    } else {
      setElementToShow(null);
    }
  }, [getBGGelement, searchResultBGG]);

  return {
    searchType,
    setSearchType,
    alreadyHaveThisBGGid,
    setSearchResultBGG,
    loading,
    elementToShow,
  };
};

export default useStepSearchBGG;
