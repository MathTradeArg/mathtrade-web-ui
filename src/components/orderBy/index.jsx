import { getI18Ntext } from "@/i18n";
import useOrderBy from "./useOrderBy";
import Icon from "../icon";

const OrderBy = ({ type = "item", options = [] }) => {
  const { idOrderBy, data, onChangeOrderBy, toggleDesc } = useOrderBy(type);
  const selected = data.value || options[0]?.value || "";

  return (
    <div className="flex items-center h-[34px] rounded-full border border-gray-200 overflow-hidden bg-white shrink-0">
      <div className="relative">
        <select
          name="order"
          className="appearance-none bg-transparent text-caption font-semibold text-gray-900 h-[34px] pl-3 pr-7 outline-none cursor-pointer"
          value={selected}
          onChange={onChangeOrderBy}
          id={`orderby-${idOrderBy}`}
          aria-label={getI18Ntext("orderBy.Title")}
        >
          {options.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
        <Icon
          type="chevron-down"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500"
        />
      </div>
      <button
        type="button"
        className="w-[34px] h-[34px] border-l border-gray-200 bg-gray-100 text-gray-800 flex items-center justify-center hover:bg-gray-200"
        onClick={toggleDesc}
        title={getI18Ntext(data.desc ? "orderBy.Descent" : "orderBy.Ascent")}
        aria-label={getI18Ntext(data.desc ? "orderBy.Descent" : "orderBy.Ascent")}
      >
        <Icon type={data.desc ? "arrow-down" : "arrow-up"} className="text-base" />
      </button>
    </div>
  );
};

export default OrderBy;
