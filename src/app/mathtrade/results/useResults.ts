import { useContext, useCallback, useState, useEffect, useMemo } from "react";
import { ResultsContext } from "@/context/results";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import {
  toTradeRows,
  applyDeliveryStatus,
  attachLabelCodes,
  type ResultsSummary,
} from "@/utils/resultsSummary";
import { DELIVERY_REPORT_PARAM } from "@/utils/deliveryReports";
import { useStore } from "@/store";
import useEventMode from "@/components/eventModeGate/useEventMode";

const defaultScreenViewResults = 0;

type ResultsUser = { id: number | string; trades?: number; commitment?: boolean };
type DeliveryRow = { id: number; delivered?: boolean; received?: boolean };

const useResults = () => {
  /* SCREEN OPTIONS **********************************************/
  const [screenViewResults, setScreenViewResults] = useState(
    defaultScreenViewResults
  );
  /* end SCREEN OPTIONS **********************************************/

  /* PAGE CONTEXT *****************************************/
  const { updateMathtrade, userId } = useContext(PageContext);
  /* end PAGE CONTEXT *****************************************/

  // Event mode (or not known yet): only the member's own results, from
  // results-summary. users/ and stats are closed; no delivery overlay.
  const { restricted } = useEventMode();

  /* RESULTS CONTEXT *****************************************/
  const {
    currentUser: contextUser,
    setUserList,
    currentUserId,
    setMathTradeResults,
    MathTradeResults,
    showTradeCodes,
  } = useContext(ResultsContext);
  const currentUser = contextUser as ResultsUser | null;

  useEffect(() => {
    // The link in a delivery report email lands on the "received" view,
    // where the report modal reads the same parameter.
    const fromReportLink = new URLSearchParams(window.location.search).has(
      DELIVERY_REPORT_PARAM
    );
    setScreenViewResults(fromReportLink ? 2 : defaultScreenViewResults);
  }, [currentUser]);
  /* end RESULTS CONTEXT *****************************************/

  /* GET USERS *************************************************/
  const afterLoad = useCallback(
    (newUserList: unknown[]) => {
      setUserList(newUserList);
    },
    [setUserList]
  );
  const [, , loadingUsers] = useFetch({
    endpoint: "GET_MATHTRADE_USERS",
    autoLoad: !restricted,
    initialState: [],
    afterLoad,
  });
  // end GET USERS ********************************************

  // UPDATE MathTrade ********************************************
  // The version comes from this fresh response, not the store: a stale store
  // would ask for an old ?v= URL that the CDN keeps for a day.
  const [version, setVersion] = useState<string | null>(null);
  const [meetingDate, setMeetingDate] = useState<string | null>(null);
  const [mathtradeLoaded, setMathtradeLoaded] = useState(false);
  const afterLoadMathTradeData = useCallback(
    (newMathTradeData: { results_published_at?: string | null; meeting_date?: string | null }) => {
      updateMathtrade(newMathTradeData);
      setVersion(newMathTradeData?.results_published_at ?? null);
      setMeetingDate(newMathTradeData?.meeting_date ?? null);
      setMathtradeLoaded(true);
    },
    [updateMathtrade]
  );
  const params = useMemo(() => {
    return restricted ? {} : { stats: true };
  }, [restricted]);
  const [, , loadingMathTradeData] = useFetch({
    endpoint: "GET_MATHTRADE",
    params,
    autoLoad: true,
    afterLoad: afterLoadMathTradeData,
  });
  // end UPDATE MathTradeData ********************************************

  /* RESULTS SUMMARY (whole edition, CDN-cached per version) **************/
  const [summary, setSummary] = useState<ResultsSummary | null>(null);
  const afterLoadSummary = useCallback((data: ResultsSummary) => {
    setSummary(data);
  }, []);
  const [getSummary, , loadingSummary] = useFetch({
    endpoint: "GET_RESULTS_SUMMARY",
    afterLoad: afterLoadSummary,
  });
  useEffect(() => {
    if (!mathtradeLoaded) return;
    getSummary({ params: version ? { v: version } : {} });
  }, [getSummary, mathtradeLoaded, version]);
  /* end RESULTS SUMMARY **************************************************/

  /* DELIVERY OVERLAY *****************************************************/
  // results-summary/ has no delivery status. Once the meeting has started,
  // the uncached results/?user= rows add the delivered/received chips.
  const meetingStarted = useMemo(
    () => Boolean(meetingDate) && new Date(meetingDate as string).getTime() <= Date.now(),
    [meetingDate]
  );
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryRow[] | null>(null);
  const afterLoadDelivery = useCallback(({ results }: { results: DeliveryRow[] }) => {
    setDeliveryStatus(results);
  }, []);
  const [getDelivery, , loadingDelivery] = useFetch({
    endpoint: "GET_MT_RESULTS",
    afterLoad: afterLoadDelivery,
  });

  const hasResults = Boolean(currentUser?.trades && currentUser?.commitment);

  // Event mode: the member's own entry for the list, built from the summary.
  // Only once the summary is in (before that it would say "no trades" for a
  // moment), and keyed on values: the store replaces its objects on every
  // refresh, and a new entry resets the selected view.
  const ownFirstName = useStore((state: any) => state.data?.user?.first_name);
  const ownLastName = useStore((state: any) => state.data?.user?.last_name);
  const ownCommitted = useStore((state: any) => Boolean(state.data?.membership?.is_committed));
  const ownTrades = useMemo(
    () => (restricted && userId && summary ? toTradeRows(summary, userId).length : null),
    [restricted, userId, summary]
  );
  useEffect(() => {
    if (ownTrades === null) return;
    setUserList([
      {
        id: userId,
        first_name: ownFirstName,
        last_name: ownLastName,
        trades: ownTrades,
        commitment: ownCommitted || ownTrades > 0,
      },
    ]);
  }, [ownTrades, userId, ownFirstName, ownLastName, ownCommitted, setUserList]);

  useEffect(() => {
    setDeliveryStatus(null);
    if (meetingStarted && hasResults && !restricted) {
      getDelivery({ params: { user: currentUserId, page_size: 200 } });
    }
  }, [getDelivery, meetingStarted, hasResults, currentUserId, restricted]);
  /* end DELIVERY OVERLAY *************************************************/

  useEffect(() => {
    if (hasResults && summary) {
      const rows = applyDeliveryStatus(toTradeRows(summary, currentUserId), deliveryStatus);
      setMathTradeResults(showTradeCodes ? attachLabelCodes(summary, rows) : rows);
    } else {
      setMathTradeResults(null);
    }
  }, [setMathTradeResults, hasResults, summary, currentUserId, deliveryStatus, showTradeCodes]);

  return {
    MathTradeResults,
    screenViewResults,
    setScreenViewResults,
    loading: loadingUsers || loadingMathTradeData || loadingSummary || loadingDelivery,
  };
};

export default useResults;
