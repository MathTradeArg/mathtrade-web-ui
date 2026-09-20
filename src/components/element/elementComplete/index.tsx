import { ElementContextProvider } from "@/context/element";
import ElementCompleteUI from "./ui";

const ElementComplete = ({ element = null }: { element?: any }) => {
  return (
    <ElementContextProvider elementRaw={element}>
      <ElementCompleteUI />
    </ElementContextProvider>
  );
};

export default ElementComplete;
