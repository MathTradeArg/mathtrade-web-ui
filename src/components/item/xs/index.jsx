import { ItemContextProvider } from "@/context/item";
import ItemXSUI from "./ui";

const ItemXS = ({
  itemRaw,
  hideUser,
  hideValue,
  extraContent,
  className,
  excluded,
}) => {
  return (
    <ItemContextProvider itemRaw={itemRaw}>
      <ItemXSUI
        extraContent={extraContent}
        className={className}
        excluded={excluded}
        hideUser={hideUser}
        hideValue={hideValue}
      />
    </ItemContextProvider>
  );
};

export default ItemXS;
