import { useContext } from "react";
import { ItemContext } from "@/context/item";
import { ItemContextProvider } from "@/context/item";
import ElementXSS from "@/components/element/xss";
import Previewer from "@/components/previewer";
import UserBox from "@/components/userBox";

const ItemContent = () => {
  const { item } = useContext(ItemContext);

  const { elements } = item;

  return (
    <>
      <div className="flex flex-col gap-2.5 px-0 py-3">
        {elements.map((element: any, k: number) => {
          return <ElementXSS element={element} key={k} />;
        })}
      </div>
      <div className="flex items-center gap-3 justify-between py-1">
        <UserBox toLeft />
        <Previewer className="w-8 h-8 shrink-0 rounded-xl border border-line bg-white text-ink flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary" />
      </div>
      <div className="pt-3 mb-1"></div>
    </>
  );
};

const ItemNoBGG = ({ itemRaw }: { itemRaw: any }) => {
  return itemRaw ? (
    <ItemContextProvider itemRaw={itemRaw}>
      <ItemContent />
    </ItemContextProvider>
  ) : null;
};

export default ItemNoBGG;
