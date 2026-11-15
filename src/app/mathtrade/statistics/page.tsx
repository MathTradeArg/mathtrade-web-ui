"use client";
import { lazy } from "react";
import Script from "next/script";
import SectionCommon from "@/components/sections/common";
import PageHeader from "@/components/pageHeader";
import useStats from "./useStats";
import Tabs from "@/components/tabs";
import Dynamic from "@/components/dynamic";

const StatsUI = lazy(() => import("./currentMT"));
const HistorialMT = lazy(() => import("./historial"));

const Header = () => {
  return (
    <>
      <Script src="https://cdn.anychart.com/releases/8.11.0/js/anychart-bundle.min.js" />
      <PageHeader title="title.Stats" variant="minimal" tone="lilac" />
    </>
  );
};

export default function Statistics() {
  const { showAllStats, screenViewStats, setScreenViewStats } = useStats();

  if (!showAllStats) {
    return (
      <>
        <Header />
        <SectionCommon>
          <div className="md:px-8 px-3 py-8">
            <Dynamic>
              <HistorialMT />
            </Dynamic>
          </div>
        </SectionCommon>
      </>
    );
  }

  return (
    <>
      <Header />
      <SectionCommon>
        <div className="px-3 pt-3 md:px-8">
          <Tabs
            flush
            list={["stats.screen.current", "stats.screen.historial"]}
            value={screenViewStats}
            onChange={setScreenViewStats}
          />
        </div>
        <div className="md:px-8 px-3 py-8">
          {screenViewStats === 0 ? (
            <Dynamic>
              <StatsUI />
            </Dynamic>
          ) : (
            <Dynamic>
              <HistorialMT />
            </Dynamic>
          )}
        </div>
      </SectionCommon>
    </>
  );
}
