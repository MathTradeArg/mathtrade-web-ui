import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { nextReportToFetch, type DeliveryReportRow } from "@/utils/deliveryReports";

// One delivery report from the receiver's side: create it from the user's own
// trade (idResult), or load, comment on (via ReplyBox) and close an existing
// one. onChanged tells the list to refresh which games have an open report.
const useDeliveryReport = ({
  idResult = null,
  reportId = null,
  onChanged,
}: {
  idResult?: number | string | null;
  reportId?: number | null;
  onChanged?: () => void;
}) => {
  const [report, setReport] = useState<DeliveryReportRow | null>(null);

  const [load, , loadingReport, errorLoad] = useFetch({
    endpoint: "GET_DELIVERY_REPORT",
    afterLoad: setReport,
  });
  const reload = useCallback(() => {
    if (reportId) load({ urlParams: [reportId] });
  }, [load, reportId]);

  // Once per id: useFetch's `load` changes identity when its callbacks do, and
  // depending on it re-fetched in a loop (the spinner never settled).
  const lastFetched = useRef<number | null>(null);
  useEffect(() => {
    const id = nextReportToFetch(lastFetched.current, reportId);
    if (id === null) return;
    lastFetched.current = id;
    setReport(null);
    load({ urlParams: [id] });
  }, [load, reportId]);

  const [send, , sending, errorCreate] = useFetch({
    endpoint: "POST_DELIVERY_REPORT",
    method: "POST",
    afterLoad: (data: DeliveryReportRow) => {
      setReport(data);
      if (onChanged) onChanged();
    },
  });
  const create = useCallback(
    (comment: string, images: string[]) => {
      if (idResult === null || idResult === undefined) return;
      send({ urlParams: [idResult], params: { comment: comment.trim(), images } });
    },
    [send, idResult]
  );

  const [postClose, , closing, errorClose] = useFetch({
    endpoint: "POST_DELIVERY_REPORT_CLOSE",
    method: "POST",
    afterLoad: (data: DeliveryReportRow) => {
      setReport(data);
      if (onChanged) onChanged();
    },
  });
  const close = useCallback(() => {
    if (report) postClose({ urlParams: [report.id] });
  }, [postClose, report]);

  const changed = useCallback(() => {
    reload();
    if (onChanged) onChanged();
  }, [reload, onChanged]);

  return {
    report,
    create,
    sending,
    errorCreate,
    loadingReport,
    errorLoad,
    close,
    closing,
    errorClose,
    changed,
  };
};

export default useDeliveryReport;
