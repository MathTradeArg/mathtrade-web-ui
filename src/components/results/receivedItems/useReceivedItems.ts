import { useContext, useCallback, useState, useEffect, useMemo } from "react";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import {
  DELIVERY_REPORT_PARAM,
  openReportsByItem,
  type DeliveryReportRow,
} from "@/utils/deliveryReports";
import type { DeliveryReportTarget } from "./deliveryReport/DeliveryReportModal";

const useReceivedItems = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [itemData, setItemData] = useState<any>(null);

  const toggleModal = useCallback(() => {
    setModalOpen((v) => !v);
  }, []);

  const [reloadData, set_reloadData] = useState(0);

  const setReloadData = useCallback(() => {
    set_reloadData((v) => v + 1);
  }, []);

  /* PAGE CONTEXT *****************************************/
  const { membership } = useContext(PageContext) as any;
  /* end PAGE CONTEXT *****************************************/

  // GET RESULTS ********************************************
  const [getMathTradeResults, resultsRaw, loading, error] = useFetch({
    endpoint: "GET_MT_RESULTS",
    initialState: { results: [] },
  }) as [any, any, boolean, any];

  useEffect(() => {
    if (membership && membership.user_id) {
      // Own trades are inherently bounded to one user's own entries - request
      // the max page size so they aren't silently truncated at the default (50).
      getMathTradeResults({
        params: { user: membership.user_id, page_size: 200 },
      });
    }
  }, [getMathTradeResults, membership, reloadData]);
  // end GET RESULTS ********************************************

  // DELIVERY REPORTS ********************************************
  // The user's own reports (as reporter or reported); the open ones are
  // matched to the received games by item_id. TradeSerializer is not touched.
  const [getReports, reportsRaw] = useFetch({
    endpoint: "GET_DELIVERY_REPORTS",
    initialState: { results: [] },
  }) as [any, { results?: DeliveryReportRow[] } | null, boolean, any];

  const [reportsReload, setReportsReload] = useState(0);
  const reloadReports = useCallback(() => setReportsReload((v) => v + 1), []);

  useEffect(() => {
    if (membership && membership.user_id) {
      getReports({ params: { page_size: 200 } });
    }
  }, [getReports, membership, reportsReload]);

  const openReports = useMemo(
    () => openReportsByItem(reportsRaw?.results),
    [reportsRaw]
  );
  // end DELIVERY REPORTS ********************************************

  const results = useMemo(() => {
    return (resultsRaw?.results || []).map((result: any) => {
      const { received, item_from, id: idResult } = result;

      return {
        received,
        item_from,
        idResult,
        deliveryReport: item_from?.id != null ? openReports[item_from.id] || null : null,
      };
    });
  }, [resultsRaw, openReports]);

  const onOpenReceived = useCallback((itemData: any) => {
    setItemData(itemData);
    setModalOpen(true);
  }, []);

  /* REPORT MODAL ***********************************************/
  const [reportTarget, setReportTarget] = useState<DeliveryReportTarget | null>(null);
  const openReport = useCallback((target: DeliveryReportTarget) => setReportTarget(target), []);
  const closeReport = useCallback(() => setReportTarget(null), []);

  // Permalink from the email: ?delivery_report=<id> opens that thread. A full
  // page load, so read the URL once (see reportModal/useReportFromUrl).
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(DELIVERY_REPORT_PARAM);
    if (raw && /^\d+$/.test(raw.trim())) {
      setReportTarget({ title: "", reportId: Number(raw.trim()) });
    }
  }, []);
  /* end REPORT MODAL *******************************************/

  return {
    results,
    loading,
    error,
    modalOpen,
    toggleModal,
    onOpenReceived,
    itemData,
    setItemData,
    setReloadData,
    reportTarget,
    openReport,
    closeReport,
    reloadReports,
  };
};

export default useReceivedItems;
