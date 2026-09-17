"use client";
import PageHeader from "@/components/pageHeader";
import I18N from "@/i18n";
import { ResultsContextProvider } from "@/context/results";
import { useContext, useEffect, useState, lazy, useMemo } from "react";
import { PageContext } from "@/context/page";
import Tabs from "@/components/tabs";
import Dynamic from "@/components/dynamic";
import Wrapper from "@/components/wrapper";
import SectionCommon from "@/components/sections/common";
import { useRedirectIfNavLocked } from "@/components/sidebar/useSidebarNav";

const ResultsUI = lazy(() => import("./ui"));
const GraphViewer = lazy(() =>
  import("@/components/interactiveGraph/graphViewer")
);
const ResultsHistorial = lazy(() => import("@/components/results/historial"));

export default function Results() {
  const { setPageType, canI } = useContext(PageContext);
  const locked = useRedirectIfNavLocked("RESULTS");
  const showCurrent = Boolean(canI?.results);

  useEffect(() => {
    setPageType("results");
  }, [setPageType]);

  const [tabView, setTabView] = useState(0);

  const tablist = useMemo(() => {
    if (!showCurrent) {
      return ["results.tab.results"];
    }
    return [
      "results.tab.results",
      "results.tab.chains",
      "results.tab.historial",
    ];
  }, [showCurrent]);

  if (locked) {
    return null;
  }

  return (
    <>
      <PageHeader
        variant="compact"
        title="title.Results"
        helpId="page.results"
        alert={
          showCurrent ? null : <I18N id="results.NotResultsYet.historial" />
        }
        alertTone="warning"
      />
      <Wrapper className="mb-1">
        <div className="bg-white rounded-t-main shadow-main">
          <Tabs
            list={tablist}
            value={tabView}
            onChange={setTabView}
          />
        </div>
      </Wrapper>
      <SectionCommon topNotRounded>
        {tabView === 0 ? (
          showCurrent ? (
            <ResultsContextProvider>
              <Dynamic>
                <ResultsUI />
              </Dynamic>
            </ResultsContextProvider>
          ) : (
            <div className="min-h-96 relative">
              <Dynamic>
                <ResultsHistorial />
              </Dynamic>
            </div>
          )
        ) : tabView === 1 ? (
          <div className="min-h-96 relative p-6">
            <Dynamic>
              <GraphViewer years={["2025"]} />
            </Dynamic>
          </div>
        ) : (
          <div className="min-h-96 relative p-6">
            <Dynamic>
              <ResultsHistorial />
            </Dynamic>
          </div>
        )}
      </SectionCommon>
    </>
  );
}
