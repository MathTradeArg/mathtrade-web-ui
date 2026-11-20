"use client";
import { useContext, useEffect, useState } from "react";
import { lazy } from "react";
import PageHeader from "@/components/pageHeader";
import { ResultsContextProvider } from "@/context/results";
import { PageContext } from "@/context/page";
import Tabs from "@/components/tabs";
import Dynamic from "@/components/dynamic";
import SectionCommon from "@/components/sections/common";
import { useRedirectIfNavLocked } from "@/components/sidebar/useSidebarNav";
import useFetch from "@/hooks/useFetch";
import useMyPayments from "./myPayments/useMyPayments";
import { hasPaymentsTab } from "./myPayments/paymentOutcome";
import type { MyShippingLabelsData } from "@/components/results/myShippingLabels";

const ResultsUI = lazy(() => import("./ui"));
const GraphViewer = lazy(() =>
  import("@/components/interactiveGraph/graphViewer")
);
const MyShippingLabels = lazy(() => import("@/components/results/myShippingLabels"));
const MyPayments = lazy(() => import("./myPayments"));

const TAB_LABELS = {
  results: "results.tab.results",
  chains: "results.tab.chains",
  labels: "results.tab.labels",
  payments: "results.tab.payments",
} as const;
type TabKey = keyof typeof TAB_LABELS;

export default function Results() {
  const { setPageType } = useContext(PageContext);
  const locked = useRedirectIfNavLocked("RESULTS");
  const [tab, setTab] = useState<TabKey>("results");

  // Labels of the items the member sends: the tab shows up once the admins
  // published them (unpublished is a 200 with no items).
  const [, labelsData] = useFetch({
    endpoint: "GET_MY_SHIPPING_LABELS",
    initialState: null,
    autoLoad: true,
  });
  const labels = labelsData as MyShippingLabelsData | null;
  const hasLabels = !!labels?.items?.length;

  // "Mis pagos" shows up once the admins published the payments.
  const { data: payments, reload: reloadPayments } = useMyPayments();
  // With games to pay, or with registration credit (a refund may be due).
  const hasPayments = hasPaymentsTab(payments);

  const tabKeys: TabKey[] = [
    "results",
    "chains",
    ...(hasLabels ? (["labels"] as const) : []),
    ...(hasPayments ? (["payments"] as const) : []),
  ];
  const tabs = tabKeys.map((k) => TAB_LABELS[k]);
  const current: TabKey = tabKeys.includes(tab) ? tab : "results";

  useEffect(() => {
    setPageType("results");
  }, [setPageType]);

  if (locked) {
    return null;
  }

  return (
    <>
      <PageHeader
        variant="compact"
        tone="lilac"
        title="title.Results"
        helpId="page.results"
      />
      <SectionCommon>
        <div className="px-3 pt-3 md:px-8">
          <Tabs
            flush
            list={tabs}
            value={tabKeys.indexOf(current)}
            onChange={(index: number) => setTab(tabKeys[index] ?? "results")}
          />
        </div>
        {current === "results" ? (
          <ResultsContextProvider showTradeCodes={!!labels?.published}>
            <Dynamic>
              <ResultsUI />
            </Dynamic>
          </ResultsContextProvider>
        ) : current === "labels" ? (
          <Dynamic>
            <MyShippingLabels data={labels} />
          </Dynamic>
        ) : current === "payments" ? (
          <Dynamic>
            <MyPayments data={payments} onChanged={reloadPayments} />
          </Dynamic>
        ) : (
          <div className="min-h-96 relative">
            <Dynamic>
              <GraphViewer />
            </Dynamic>
          </div>
        )}
      </SectionCommon>
    </>
  );
}
