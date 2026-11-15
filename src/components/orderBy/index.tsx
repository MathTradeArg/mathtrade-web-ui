import { getI18Ntext } from "@/i18n";
import useOrderBy from "./useOrderBy";
import Icon from "../icon";

type OrderOption = {
  text: string;
  value: string;
  // The field's natural order runs the other way (BGG rank: #1 is the
  // best), so the arrow and label show the opposite of the API direction.
  inverted?: boolean;
};

const OrderBy = ({
  type = "item",
  options = [] as OrderOption[],
}) => {
  const { idOrderBy, data, onChangeOrderBy, toggleDesc } = useOrderBy(type);
  const selected = data.value || options[0]?.value || "";
  const inverted = options.find((opt) => opt.value === selected)?.inverted;
  const shownDesc = inverted ? !data.desc : data.desc;
  const directionLabel = getI18Ntext(
    shownDesc ? "orderBy.Descent" : "orderBy.Ascent"
  );
  const directionShort = getI18Ntext(
    shownDesc ? "orderBy.Descent.mobile" : "orderBy.Ascent.mobile"
  );

  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="relative rounded-xl bg-white border border-line hover:border-ink/30 focus-within:ring-2 focus-within:ring-ink/40">
        <select
          name="order"
          className="appearance-none bg-transparent text-[13px] font-medium text-ink-muted hover:text-ink h-10 pl-2.5 pr-7 outline-none cursor-pointer"
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
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted"
        />
      </div>
      <button
        type="button"
        className="h-10 min-w-10 px-2.5 rounded-xl bg-white border border-line flex items-center justify-center gap-1 text-[13px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink focus-visible:bg-surface-soft focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 transition-colors"
        onClick={toggleDesc}
        title={`${directionLabel}. ${getI18Ntext("orderBy.Direction.help")}`}
        aria-label={directionLabel}
        aria-pressed={!!shownDesc}
      >
        <Icon
          type={shownDesc ? "arrow-down" : "arrow-up"}
          className="text-sm shrink-0"
        />
        <span className="text-[13px] leading-none hidden sm:inline">
          {directionLabel}
        </span>
        <span className="text-[13px] leading-none sm:hidden">
          {directionShort}
        </span>
      </button>
    </div>
  );
};

export default OrderBy;
