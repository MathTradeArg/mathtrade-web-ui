"use client";
import useItemToWant from "./useItemToWant";
import VisualSection2 from "@/components/want-components/visual2";
import EmptyList from "@/components/emptyList";
import CommitHeaderVisual from "@/components/want-components/commit/headers/header-visual";
import CommitFooter from "@/components/want-components/commit/footer";
import { PRIVATE_ROUTES } from "@/config/routes";

const ItemToWant = ({ changeScreenViewOffer = () => {} }) => {
  const { isLoadedWants, myList, readyToRender } = useItemToWant();

  return readyToRender ? (
    <div className="md:px-8 px-3">
      <CommitHeaderVisual />
      <EmptyList
        visible={isLoadedWants && !(myList?.length || 0)}
        message="MyWants.EmptyList"
        icon="heart"
        ctaText="MyWants.EmptyList.cta"
        ctaHref={PRIVATE_ROUTES.OFFER.path}
      />
      {myList.map((item) => {
        return <VisualSection2 key={item.id} item={item} />;
      })}
      <CommitFooter
        acceptNum="2"
        changeScreenViewOffer={changeScreenViewOffer}
      />
    </div>
  ) : null;
};

export default ItemToWant;
