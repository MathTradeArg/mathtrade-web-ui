import { useContext } from "react";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";
import Calendar from "@/components/calendar";
import WhatIsMT from "@/components/whatIsMT";
import EditionCard from "./editionCard";
import Referral from "@/components/referral";

const HomeContent = () => {
  /* PAGE CONTEXT **********************************************/
  const { mathtrade } = useContext(PageContext);
  /* end PAGE CONTEXT */

  return (
    <div className="md:px-8 px-3 pt-8 pb-5">
      {mathtrade && Object.keys(mathtrade).length > 0 ? (
        <>
          <EditionCard />
          <Referral />
          <section className="mb-6 bg-white p-5 rounded-xl shadow-lg">
            <h2 className="font-bold text-xl mb-4">
              <I18N id="timeline.header" />
            </h2>
            <Calendar />
          </section>
        </>
      ) : null}
      <div className="mb-8 bg-white p-5 rounded-xl shadow-lg">
        <WhatIsMT />
      </div>
    </div>
  );
};

export default HomeContent;
