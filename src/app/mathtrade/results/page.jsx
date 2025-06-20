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
import Image from "next/image";
import tenor from "@/img/tenor.gif";

const ResultsUI = lazy(() => import("./ui"));
const UserTable = lazy(() => import("@/components/results/userTable"));
const GraphViewer = lazy(() =>
  import("@/components/interactiveGraph/graphViewer")
);

export default function Results() {
  /* PAGE CONTEXT **********************************************/
  const { setPageType, canI } = useContext(PageContext);

  useEffect(() => {
    setPageType("results");
  }, [setPageType]);
  /* end PAGE CONTEXT */

  const [tabView, setTabView] = useState(0);

  const tablist = useMemo(() => {
    const list = ["results.tab.results", "results.tab.users"];
    if (canI.results) {
      list.push("results.tab.chains");
    }
    return list;
  }, [canI.results]);

  return (
    <>
      <PageHeader
        title="title.Results"
        name="results"
        description={
          <>
            <p className="mb-4">
              <I18N id="results.text1" />
            </p>
            <p>
              <I18N id="results.text2" />
            </p>
          </>
        }
        bgImg="2"
      />
      <Wrapper className="mb-1">
        <div className="bg-colorMain rounded-t-main shadow-main">
          <Tabs list={tablist} value={tabView} onChange={setTabView} />
        </div>
      </Wrapper>
      <SectionCommon topNotRounded>
        {tabView === 0 ? (
          <div className="">
            {canI.results ? (
              <ResultsContextProvider>
                <div className="md:px-8 px-3 py-8">
                  <Dynamic>
                    <ResultsUI />
                  </Dynamic>
                </div>
              </ResultsContextProvider>
            ) : (
              <div className="md:px-8 px-3 py-8">
                <p className="text-center text-balance text-2xl py-5">
                  <I18N id="results.NotResultsYet.help" />
                </p>
                <div className="flex justify-center">
                  <Image src={tenor} alt="THIS IS FINE" priority />
                </div>
              </div>
            )}
          </div>
        ) : tabView === 1 ? (
          <div className="md:px-8 px-3 py-8">
            <Dynamic>
              <UserTable />
            </Dynamic>
          </div>
        ) : (
          <div className="min-h-96 relative p-6">
            <Dynamic>
              <GraphViewer years={["2025"]} />
            </Dynamic>
          </div>
        )}
      </SectionCommon>
    </>
  );
}
