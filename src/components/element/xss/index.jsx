import { ElementContextProvider } from "@/context/element";
import { useContext } from "react";
import { ElementContext } from "@/context/element";
import StatusBadge from "@/components/status-badge";
import Chip from "@/components/chip";
import Thumbnail from "@/components/thumbnail";
import { getI18Ntext } from "@/i18n";

const ElementXSSUI = () => {
  const { element } = useContext(ElementContext);

  const { title, language, extraData } = element;

  const { box_status, component_status } = extraData;

  return (
    <div className="flex items-center gap-x-3 gap-y-2 border border-gray-200 rounded-md">
      <Thumbnail elements={[element]} className="w-10 rounded-l-md" />
      <div className="">
        <div data-tooltip={title}>
          <h3 className="text-xs font-bold cropped_1 mb-1">{title}</h3>
        </div>
        <div className="flex items-center gap-x-2 flex-wrap">
          <StatusBadge
            status={box_status || ""}
            type="box"
            min
            label={getI18Ntext("status.label.box")}
          />
          <StatusBadge
            status={component_status || ""}
            min
            label={getI18Ntext("status.label.components")}
          />
          {language ? <Chip>{language}</Chip> : null}
        </div>
      </div>
    </div>
  );
};

const ElementXSS = ({ element }) => {
  return (
    <ElementContextProvider elementRaw={element}>
      <ElementXSSUI />
    </ElementContextProvider>
  );
};

export default ElementXSS;
