"use client";
import { lazy } from "react";
import PageHeader from "@/components/pageHeader";
import Tabs from "@/components/tabs";
import BanUsersModal from "@/components/ban/users/modal";
//import HelpContext from "@/components/help-context";
import useOffer from "./useOffer";
import Dynamic from "@/components/dynamic";
import Wrapper from "@/components/wrapper";

const GamesView = lazy(() => import("./games"));
const ItemsView = lazy(() => import("./items"));

const OfferPage = () => {
  const { screenOfferView, setScreenOfferView } = useOffer();

  return (
    <>
      <PageHeader
        variant="compact"
        title="title.OfferGames"
        helpId="page.offer"
      />
      <Wrapper className="mb-1">
        <div className="bg-colorMain rounded-t-main shadow-main">
          <Tabs
            list={["offer.screen.games", "offer.screen.items"]}
            value={screenOfferView}
            onChange={setScreenOfferView}
          />
        </div>
      </Wrapper>

      {screenOfferView === 0 ? (
        <>
          {/* <div className="w-fit mx-auto">
            <HelpContext id="advanceMeaning.items" />
          </div> */}
          <Dynamic h={600}>
            <GamesView />
          </Dynamic>
        </>
      ) : (
        <Dynamic h={600}>
          <ItemsView />
        </Dynamic>
      )}
      <BanUsersModal />
    </>
  );
};

export default OfferPage;
