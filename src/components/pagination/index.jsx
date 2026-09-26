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
          className="w-9 h-9 leading-none text-center border rounded-full border-gray-300 text-gray-600 hover:bg-primary hover:border-primary hover:text-white"
          title={getI18Ntext("pagination.PrevPage")}
          onClick={prevPage}
        >
          <Icon type="arrow-left" className="text-lg" />
        </button>
      ) : null}
      <div className="h-9 px-2.5 rounded-full border border-gray-200 bg-white flex items-center text-caption font-semibold text-gray-900">
        {total > 1 ? (
          <Form
            onSubmit={(d) => {
              gotoTop();
              updateFilters(d, type);
            }}
            formatTypes={{ page: "number" }}
          >
            <input
              className="w-7 bg-transparent text-center outline-none"
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
        <span className="text-gray-500 whitespace-nowrap">{` / ${total}`}</span>
      </div>
      {notShowNextPage ? null : (
        <button
          type="button"
          className="w-9 h-9 leading-none text-center rounded-full bg-primary text-white hover:bg-sky-700"
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
