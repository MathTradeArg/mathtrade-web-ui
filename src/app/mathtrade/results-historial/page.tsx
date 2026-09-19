"use client";
import { useContext, useEffect } from "react";
import { lazy } from "react";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import { PageContext } from "@/context/page";
import Dynamic from "@/components/dynamic";

const ResultsHistorial = lazy(() => import("@/components/results/historial"));

export default function ResultsHistorialPage() {
  const { setPageType } = useContext(PageContext);

  useEffect(() => {
    setPageType("results-historial");
  }, [setPageType]);

  return (
    <>
      <PageHeader variant="compact" title="title.ResultsHistorial" />
      <SectionCommon>
        <Dynamic>
          <ResultsHistorial />
        </Dynamic>
      </SectionCommon>
    </>
  );
}
