"use client";
import { useContext, useMemo } from "react";
import { useOptions } from "@/store";
import { PageContext } from "@/context/page";
import { colorTagStyles } from "@/utils/color";
import { getI18Ntext } from "@/i18n";

const useTagSelector = () => {
  const filters_item = useOptions((state) => state.filters_item);
  const { itemTags, canI } = useContext(PageContext);

  const tagList = useMemo(() => {
    return (itemTags || []).map((tag) => {
      return {
        id: tag.id,
        text: tag.name,
        color: tag.color,
        colorStyles: colorTagStyles(tag.color),
        count: tag.items?.length || 0,
      };
    });
  }, [itemTags]);

  const tagSelected = useMemo(() => {
    if (!filters_item?.tag || !tagList?.length || !filters_item?.tag.length) {
      return "";
    }
    return (
      tagList.find((tag) => `${tag.id}` === `${filters_item.tag[0]}`)?.id || ""
    );
  }, [filters_item, tagList]);

  const tagOptions = useMemo(
    () => [
      { value: "", text: getI18Ntext("tag.noTag") },
      ...tagList.map((tag) => ({
        value: `${tag.id}`,
        text: tag.count ? `${tag.text} (${tag.count})` : tag.text,
        color: tag.color,
        colorStyles: tag.colorStyles,
      })),
    ],
    [tagList]
  );

  return {
    tagOptions,
    data: { tag: tagSelected ? `${tagSelected}` : "" },
    canIEdit: canI.offer || canI.want,
  };
};

export default useTagSelector;
