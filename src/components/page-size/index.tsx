import I18N from "@/i18n";
import { pageSizeOptions, page_size_default } from "@/config/pagination";
import { GotoTopContext } from "@/context/goto-top";
import { useOptions } from "@/store";
import { useContext, useMemo } from "react";

const PageSize = ({ type = "item" }) => {
  const { gotoTop } = useContext(GotoTopContext);

  const filters_item = useOptions((state) => state.filters_item);
  const filters_game = useOptions((state) => state.filters_game);
  const filters_collection = useOptions((state) => state.filters_collection);
  const filters_myoffer = useOptions((state) => state.filters_myoffer);
  const updateFilters = useOptions((state) => state.updateFilters);

  const filters = useMemo(() => {
    switch (type) {
      case "game":
        return { ...filters_game };
      case "collection":
        return { ...filters_collection };
      case "myoffer":
        return { ...filters_myoffer };
      default:
        return { ...filters_item };
    }
  }, [type, filters_item, filters_game, filters_collection, filters_myoffer]);

  return (
    <label className="flex items-center h-9 px-2.5 rounded-xl bg-white border border-line cursor-pointer shrink-0 focus-within:ring-2 focus-within:ring-ink/40 text-[13px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink focus-visible:bg-surface-soft focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 transition-colors">
      <select
        name="page_size"
        className="bg-transparent outline-none cursor-pointer pr-0.5 text-ink-muted hover:text-ink"
        value={filters?.page_size || page_size_default}
        onChange={(e) => {
          const new_page_size = parseInt(e.target.value, 10);
          gotoTop();
          updateFilters(
            {
              page_size: new_page_size,
              page: 1,
            },
            type
          );
        }}
      >
        {pageSizeOptions.map((ps) => (
          <option value={ps} key={ps}>
            {ps}
          </option>
        ))}
      </select>
      <span className="whitespace-nowrap">
        <I18N id="elementsPerPage.short" />
      </span>
    </label>
  );
};

export default PageSize;
