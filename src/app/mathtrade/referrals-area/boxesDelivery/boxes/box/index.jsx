import { useContext } from "react";
import { BoxDeliveryContext } from "@/context/boxDelivery";
import BoxView from "./view";
import BoxEditor from "./editor";

const Box = ({ box }) => {
  const { boxIdToEdit } = useContext(BoxDeliveryContext);

  return (
    <article className="bg-white border border-gray-200 md:p-3 p-1 rounded-lg shadow-md relative">
      {!box.id || boxIdToEdit === box.id ? (
        <BoxEditor box={box} />
      ) : (
        <BoxView box={box} />
      )}
    </article>
  );
};
export default Box;
