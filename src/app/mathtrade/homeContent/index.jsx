import { useContext } from "react";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";
import Calendar from "@/components/calendar";
import WhatIsMT from "@/components/whatIsMT";
import Status from "./status";
import Glossary from "./glossary";
import Iconshelp from "./iconshelp";
import EditionCard from "./editionCard";
import Referral from "@/components/referral";

const HomeContent = () => {
  /* PAGE CONTEXT **********************************************/
  const { mathtrade } = useContext(PageContext);
  /* end PAGE CONTEXT */

  return (
    <div className="px-8 pt-8 pb-5">
      {mathtrade && Object.keys(mathtrade).length > 0 ? (
        <>
          <EditionCard />
          <div className="mb-6">
            <Referral />
          </div>
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
      <h2 className="text-center font-bold text-2xl py-5">
        <I18N id="quickhelp.title" />
      </h2>
      <div className="mb-4 bg-white p-5 rounded-xl shadow-lg">
        <Glossary />
      </div>
      <div className="lg:flex gap-4">
        <div className="mb-4 bg-white p-5 rounded-xl shadow-lg lg:w-2/3">
          <Status />
        </div>
        <div className="mb-4 bg-white p-5 rounded-xl shadow-lg lg:w-1/3">
          <Iconshelp />
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
