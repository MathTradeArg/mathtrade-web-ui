import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";

const formatTextComp = (text, textLower, valueLower) => {
  const ind = textLower.indexOf(valueLower);

  if (ind < 0) return { a: text, b: "", c: "" };

  const length = valueLower.length;

  const a = text.substring(0, ind);
  const b = text.substring(ind, ind + length);
  const c = text.substring(ind + length);

  return { a, b, c };
};

const useSearchBGG = ({ setSearchResultBGG, inCollection }) => {
  const inputRef = useRef(null);

  const [value, setValue] = useState({ val: "", enableSearch: false });
  const [isFocus, setIsFocus] = useState(false);

  const [list, setList] = useState([]);

  const afterLoad = useCallback(
    (list) => {
      const newList = list
        .map((item) => {
          const name = `${item?.primary_name || ""} (${item?.year || ""})`;
          const nameLower = name.toLowerCase();

          return {
            bgg_id: item.bgg_id,
            name,
            nameComp: formatTextComp(name, nameLower, value.val.toLowerCase()),
            expansion: item.type !== 1,
            indexPosition: nameLower.indexOf(value.val.toLowerCase()),
          };
        })

        .sort((a, b) => {
          return a.indexPosition === b.indexPosition
            ? a.name.length < b.name.length
              ? -1
              : 1
            : a.indexPosition < b.indexPosition
              ? -1
              : 1;
        })
        .slice(0, 15);

      setList(newList);
    },
    [value.val],
  );

  const [getBGGgames, , loading, errorMessage] = useFetch({
    endpoint: "BGG_GET_GAMES",
    afterLoad,
  });

  useEffect(() => {
    let delayDebounceFn = null;
    if (value.val.length >= 2 && value.enableSearch) {
      delayDebounceFn = setTimeout(() => {
        const params = { query: value.val };
        if (inCollection) {
          params.inCollection = true;
        }

        getBGGgames({
          params,
        });
      }, 1000);
    } else {
      setList([]);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [getBGGgames, inCollection, value]);

  //////////////////
  useEffect(() => {
    setSearchResultBGG(null);
    inputRef.current.focus();
  }, [setSearchResultBGG]);

  const onFocus = useCallback(() => {
    setIsFocus(true);
  }, []);
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false);
    }, 150);
  }, []);

  const onSelect = useCallback(
    (elem) => {
      const { bgg_id, name } = elem;
      setSearchResultBGG({ bgg_id, name });
      setValue({
        val: name,
        enableSearch: false,
      });
    },
    [setSearchResultBGG],
  );

  const onClear = useCallback(() => {
    inputRef.current.focus();
    setSearchResultBGG(null);
    setIsFocus(true);
    setValue({
      val: "",
      enableSearch: true,
    });
  }, [setSearchResultBGG]);

  return {
    loading,
    errorMessage,
    inputRef,
    value,
    setValue,
    onFocus,
    onBlur,
    visiblePad: isFocus && list.length,
    list,
    onSelect,
    onClear,
  };
};

export default useSearchBGG;
