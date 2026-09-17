"use client";
import { useContext, useEffect } from "react";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import { PageContext } from "@/context/page";
import { ResultsContextProvider } from "@/context/results";
import { useRedirectIfNavLocked } from "@/components/sidebar/useSidebarNav";
import ProvisionalResultsUI from "./ui";

export default function ProvisionalResultsPage() {
  const { setPageType } = useContext(PageContext);
  const locked = useRedirectIfNavLocked("PROVISIONAL_RESULTS");

  useEffect(() => {
    setPageType("provisional-results");
  }, [setPageType]);

  if (locked) {
    return null;
  }

  return (
    <>
      <PageHeader variant="compact" title="title.ProvisionalResults" />
      <SectionCommon>
        <div className="md:px-8 px-3 py-8">
          <ResultsContextProvider>
            <ProvisionalResultsUI />
          </ResultsContextProvider>
        </div>
      </SectionCommon>
    </>
  );
}
