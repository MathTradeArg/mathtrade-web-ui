import Thumbnail from "@/components/thumbnail";
import StatusBadge from "@/components/status-badge";
import { ElementContext } from "@/context/element";
import { useContext } from "react";
import clsx from "clsx";
import I18N, { getI18Ntext } from "@/i18n";

const ElementXSUI = ({ isCombo }) => {
  const { element } = useContext(ElementContext);

  const { title, language, extraData } = element;

  const { box_status, component_status, comment } = extraData;

  return (
    <div className={clsx("flex flex-col gap-1", { grow: !isCombo })}>
      <div className="flex items-center gap-2">
        <Thumbnail
          elements={[element]}
          className="w-8 h-8 rounded shrink-0"
        />
        <div data-tooltip={title}>
          <h5
            className={clsx("font-semibold text-body cropped_1", {
              "max-w-[220px]": !isCombo,
              "text-[9px] leading-none max-w-40": isCombo,
            })}
          >
            {title}
          </h5>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 items-center pl-10">
        <StatusBadge
          status={box_status}
          type="box"
          min
          label={getI18Ntext("status.label.box")}
        />
        <StatusBadge
          status={component_status}
          min
          label={getI18Ntext("status.label.components")}
        />
        {language ? (
          <div
            className={clsx(
              "text-caption text-gray-500 bg-colorMain px-1.5 py-0.5 rounded cropped_1",
              {
                "max-w-40": !isCombo,
                "text-[9px] leading-none max-w-20": isCombo,
              }
            )}
          >
            {language}
          </div>
        ) : null}
        {comment && comment?.length > 0 ? (
          <div
            className="text-gray-400 font-bold cursor-default text-[10px] leading-none underline"
            data-tooltip={comment}
          >
            <I18N
              id={`item.xs.element.description${isCombo ? ".min" : ""}`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ElementXSUI;
