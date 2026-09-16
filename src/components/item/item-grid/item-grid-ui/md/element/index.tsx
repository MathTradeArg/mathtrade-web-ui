import { ElementContextProvider } from "@/context/element";
import ElementWrapperInside from "@/components/element/elementCollection/elementWrapperInside";
import ElementInCombo from "./inCombo";
import ElementComplete from "./complete";
import type { ReactNode } from "react";

type ElementMDProps = {
  element: { id: number | string };
  isCombo?: boolean;
  onToggleExpanse: () => void;
  header?: ReactNode;
};

const ElementMD = ({
  element,
  isCombo = false,
  onToggleExpanse,
  header = null,
}: ElementMDProps) => {
  return (
    <ElementContextProvider elementRaw={element}>
      {isCombo ? (
        <ElementWrapperInside padded={false} className="p-3">
          <ElementInCombo onToggleExpanse={onToggleExpanse} />
        </ElementWrapperInside>
      ) : (
        <ElementComplete onToggleExpanse={onToggleExpanse} header={header} />
      )}
    </ElementContextProvider>
  );
};

export default ElementMD;
