import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { isBggExpansionType } from "@/utils/text";

const formatTextComp = (text = "", textLower = "", valueLower = "") => {
  const ind = textLower.indexOf(valueLower);

  if (ind < 0) return { a: text, b: "", c: "" };

  const length = valueLower.length;

  const a = text.substring(0, ind);
  const b = text.substring(ind, ind + length);
  const c = text.substring(ind + length);

  return { a, b, c };
};

const useSearchBGG = ({
  setSearchResultBGG = (_result?: any) => {},
  inCollection = false,
}: {
  setSearchResultBGG?: (result: any) => void;
  inCollection?: boolean;
} = {}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState({ val: "", enableSearch: false });
  const [isFocus, setIsFocus] = useState(false);

  const [list, setList] = useState<any[]>([]);
  const [preparing, setPreparing] = useState(false);
  const lastParamsRef = useRef<any>(null);

  const afterLoad = useCallback(
    (list: any[] = []) => {
      if (!Array.isArray(list)) {
        setPreparing(true);
        return;
      }
      setPreparing(false);

      const newList = (list || [])
        .map((item: any = {}) => {
          const name = `${item?.primary_name || ""} (${item?.year || ""})`;
          const nameLower = name.toLowerCase();
          const versionId = item.version_id || item.version || null;

          return {
            bgg_id: item.bgg_id,
            name,
            nameComp: formatTextComp(name, nameLower, value.val.toLowerCase()),
            expansion: isBggExpansionType(item.type),
            version_id: versionId,
            indexPosition: nameLower.indexOf(value.val.toLowerCase()),
          };
        })

        .sort((a: any, b: any) => {
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
    [value.val]
  );

  const [getBGGgames, , loading, errorMessage] = useFetch({
    endpoint: "BGG_GET_GAMES",
    afterLoad,
  });

  useEffect(() => {
    let delayDebounceFn: ReturnType<typeof setTimeout> | null = null;
    if (value.val.length >= 2 && value.enableSearch) {
      delayDebounceFn = setTimeout(() => {
        const params: { query: string; inCollection?: boolean } = {
          query: value.val,
        };
        if (inCollection) {
          params.inCollection = true;
        }

        setPreparing(false);
        lastParamsRef.current = params;
        getBGGgames({
          params,
        });
      }, 1000);
    } else {
      setList([]);
    }
    return () => {
      if (delayDebounceFn) clearTimeout(delayDebounceFn);
    };
  }, [getBGGgames, inCollection, value]);

  useEffect(() => {
    setSearchResultBGG(null);
    inputRef.current?.focus();
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
    (elem: any = {}) => {
      const { bgg_id, name, version_id } = elem;
      setSearchResultBGG({
        bgg_id,
        name,
        bgg_version_id: version_id ? `${version_id}` : undefined,
      });
      setValue({
        val: name,
        enableSearch: false,
      });
    },
    [setSearchResultBGG]
  );

  const onClear = useCallback(() => {
    inputRef.current?.focus();
    setSearchResultBGG(null);
    setIsFocus(true);
    setValue({
      val: "",
      enableSearch: true,
    });
  }, [setSearchResultBGG]);

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      getBGGgames({ params: lastParamsRef.current });
    }
  }, [getBGGgames]);

  return {
    loading,
    errorMessage,
    inputRef,
    value,
    setValue,
    onFocus,
    onBlur,
    visiblePad: isFocus && list.length && !preparing,
    list,
    onSelect,
    onClear,
    preparing,
    retry,
  };
};

export default useSearchBGG;
