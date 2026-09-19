"use client";
import { useContext } from "react";
import { useOptions } from "@/store";
import { GotoTopContext } from "@/context/goto-top";
import I18N, { getI18Ntext } from "@/i18n";
import FilterChip from "./chip";

type TypeOption = { value: string | number; text: string };

const TypeChips = ({
  type = "item",
  options = [],
}: {
  type?: "item" | "game";
  options?: TypeOption[];
}) => {
  const filters = useOptions((state) => state[`filters_${type}`]);
  const updateFilters = useOptions((state) => state.updateFilters);
  const { gotoTop } = useContext(GotoTopContext);
  const current = filters?.type !== undefined && filters?.type !== ""
    ? `${filters.type}`
    : "";

  const select = (value: string) => {
    gotoTop();
    updateFilters({ type: value || undefined, page: 1 }, type);
  };

  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      <FilterChip selected={!current} onClick={() => select("")}>
        <I18N id="filter.Type.All" />
      </FilterChip>
      {options.map((option) => {
        const value = `${option.value}`;
        const short =
          value === "3"
            ? getI18Ntext("filter.Type.Other.short")
            : option.text.replace(/\s*\(\d+\)\s*$/, "");
        return (
          <FilterChip
            key={value}
            selected={current === value}
            onClick={() => select(value)}
          >
            {short}
          </FilterChip>
        );
      })}
    </div>
  );
};

export default TypeChips;
