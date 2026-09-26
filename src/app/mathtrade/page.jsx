"use client";
import I18N from "@/i18n";
import SectionCommon from "@/components/sections/common";
import PageHeader from "@/components/pageHeader";
import { linksToHelp } from "@/config/linksToHelp";
import { useContext, useEffect } from "react";
import { PageContext } from "@/context/page";
import HomeContent from "./homeContent";

export default function HomePage() {
  /* PAGE CONTEXT **********************************************/
  const { setPageType } = useContext(PageContext);

  useEffect(() => {
    setPageType("home");
  }, [setPageType]);
  /* end PAGE CONTEXT */

  return (
    <>
      <PageHeader variant="welcome" title="home.welcome.title">
        <I18N id="home.welcome.firstTime" />{" "}
        <a
          href={linksToHelp.video}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          <I18N id="home.welcome.video" />
        </a>
        <span className="opacity-60 mx-1">·</span>
        <a
          href={linksToHelp.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          <I18N id="home.welcome.telegram" />
        </a>
      </PageHeader>
      <SectionCommon>
        <HomeContent />
      </SectionCommon>
    </>
  );
}
