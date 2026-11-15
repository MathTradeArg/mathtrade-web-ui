import { useContext } from "react";
import { GotoTopContext } from "@/context/goto-top";
import { Form } from "../form";
import Icon from "../icon";
import { getI18Ntext } from "@/i18n";
import usePagination from "./usePagination";

const Pagination = ({ type = "item", count }) => {
  const { gotoTop } = useContext(GotoTopContext);

  const {
    page,
    onChange,
    onBlur,
    total,
    prevPage,
    nextPage,
    showPrevPage,
    notShowNextPage,
    updateFilters,
  } = usePagination(type, count, gotoTop);

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {showPrevPage ? (
        <button
          type="button"
          className="w-10 h-10 leading-none text-center rounded-xl bg-white border border-line text-[13px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink focus-visible:bg-surface-soft focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 transition-colors"
          title={getI18Ntext("pagination.PrevPage")}
          onClick={prevPage}
        >
          <Icon type="arrow-left" className="text-lg" />
        </button>
      ) : null}
      <div className="h-10 px-2.5 rounded-xl bg-white border border-line flex items-center text-[13px] font-medium text-ink-muted focus-within:bg-surface-soft focus-within:ring-2 focus-within:ring-ink/40">
        {total > 1 ? (
          <Form
            onSubmit={(d) => {
              gotoTop();
              updateFilters(d, type);
            }}
            formatTypes={{ page: "number" }}
          >
            <input
              className="w-7 bg-transparent text-center text-ink outline-none"
              type="number"
              name="page"
              value={page}
              onChange={onChange}
              onBlur={onBlur}
              min={1}
              max={total}
            />
          </Form>
        ) : (
          <span>1</span>
        )}
        <span className="whitespace-nowrap">{` / ${total}`}</span>
      </div>
      {notShowNextPage ? null : (
        <button
          type="button"
          className="w-10 h-10 leading-none text-center rounded-xl bg-white border border-line text-[13px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink focus-visible:bg-surface-soft focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 transition-colors"
          title={getI18Ntext("pagination.NextPage")}
          onClick={nextPage}
        >
          <Icon type="arrow-right" className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default Pagination;
