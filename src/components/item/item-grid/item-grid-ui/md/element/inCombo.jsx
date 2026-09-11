import Thumbnail from "@/components/thumbnail";
import Icon from "@/components/icon";
import { getI18Ntext } from "@/i18n";
import StatusBadge from "@/components/status-badge";
import { ElementContext } from "@/context/element";
import { useContext } from "react";

const ElementInCombo = ({ onToggleExpanse }) => {
  const { element } = useContext(ElementContext);

  const { title, language, extraData } = element;

  const { box_status, component_status } = extraData;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16 shrink-0">
        <Thumbnail elements={[element]} className="rounded-lg w-full h-full" />
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-lg grid place-content-center backdrop-blur-sm cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
          onClick={onToggleExpanse}
        >
          <Icon type="plus" className="text-lg text-white" />
        </div>
      </div>

      <div className="min-w-0">
        <h3
          data-tooltip={getI18Ntext("Enlarge")}
          className="text-body font-bold cursor-pointer hover:opacity-70 leading-tight line-clamp-1"
          onClick={onToggleExpanse}
        >
          {title}
        </h3>
        <div className="flex flex-wrap gap-1 items-center mt-1">
          <StatusBadge status={box_status} type="box" min />
          <StatusBadge status={component_status} min />
        </div>
        {language ? (
          <div className="text-caption text-gray-500 truncate mt-0.5">
            {language}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ElementInCombo;
