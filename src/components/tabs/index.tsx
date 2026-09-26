import I18N from "@/i18n";
import clsx from "clsx";
import { SegmentButton, SegmentedGroup } from "@/components/segmented";

const Tabs = ({
  list = [],
  onChange = (_k?: number) => {},
  highlighted = -1,
  value = 0,
  min = false,
  className = "",
  toLeft = false,
}) => {
  return (
    <div
      className={clsx(
        "flex py-2",
        { "justify-center": !toLeft },
        className
      )}
    >
      <SegmentedGroup>
        {list?.map((name, k) => {
          return (
            <SegmentButton
              key={name}
              active={k === value}
              small={min}
              onClick={() => {
                if (onChange && k !== value) onChange(k);
              }}
            >
              <I18N id={name} />
              {highlighted === k ? (
                <span className="absolute -top-1.5 -right-1 bg-red-600 text-white leading-none font-bold uppercase text-[8px] px-1 py-[2px] rounded">
                  Nuevo
                </span>
              ) : null}
            </SegmentButton>
          );
        })}
      </SegmentedGroup>
    </div>
  );
};

export default Tabs;
