import { ElementContextProvider } from "@/context/element";
import { useContext } from "react";
import { ElementContext } from "@/context/element";
import StatusBadge from "@/components/status-badge";
import LanguagePills from "@/components/chip/languagePills";
import Thumbnail from "@/components/thumbnail";
import { getI18Ntext } from "@/i18n";

const ElementXSSUI = () => {
  const { element } = useContext(ElementContext);

  const { title, language, languageRaw, extraData } = element;

  const { box_status, component_status } = extraData;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-2">
      <Thumbnail elements={[element]} className="w-10 h-10 rounded-lg shrink-0 overflow-hidden" />
      <div className="min-w-0">
        <div data-tooltip={title}>
          <h3 className="text-xs font-semibold text-ink cropped_1 mb-1">{title}</h3>
        </div>
        <div className="flex items-center gap-x-2 flex-wrap min-w-0 max-w-full">
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
          <LanguagePills
            languageRaw={languageRaw}
            language={language}
            maxVisible={1}
          />
        </div>
      </div>
    </div>
  );
};

const ElementXSS = ({ element }: { element: any }) => {
  return (
    <ElementContextProvider elementRaw={element}>
      <ElementXSSUI />
    </ElementContextProvider>
  );
};

export default ElementXSS;
