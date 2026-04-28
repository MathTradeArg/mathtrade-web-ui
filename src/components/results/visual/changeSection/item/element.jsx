import { useContext } from "react";
import { ResultsContext } from "@/context/results";
import { ElementContext, ElementContextProvider } from "@/context/element";
import Thumbnail from "@/components/thumbnail";
import Previewer from "@/components/previewer";

const ELementUI = () => {
  const { element } = useContext(ElementContext);
  const { title } = element;

  const { customMathtradeId } = useContext(ResultsContext);

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <div className=" relative">
        <Thumbnail
          elements={[element]}
          className="rounded-tl-lg rounded-tr-lg sm:w-32 w-16"
        />

        <div className="absolute bg-primary text-white sm:bottom-1 bottom-0 sm:right-1 right-0 rounded-full">
          <Previewer customMathtradeId={customMathtradeId} />
        </div>
      </div>
      <div className="text-center p-1 sm:w-32 w-16">
        <h4
          className="text-[10px] leading-3 font-bold cropped cursor-default"
          title={title}
        >
          {title}
        </h4>
      </div>
    </div>
  );
};

const Element = ({ element }) => {
  return (
    <ElementContextProvider elementRaw={element}>
      <ELementUI />
    </ElementContextProvider>
  );
};

export default Element;
