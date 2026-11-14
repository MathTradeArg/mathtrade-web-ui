import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import type { DeliveryReportRow } from "@/utils/deliveryReports";
import {
  fromDeliveryRow,
  fromItemRow,
  type ItemReportRow,
  type MyReportItem,
} from "@/utils/myReports";

export type MyReportsRole = "made" | "received";

// Item reports (reports/mine/) and delivery reports (delivery-reports/ with
// ?role=) of one tab, both at page_size 200, merged on the client.
const useMyReports = (role: MyReportsRole) => {
  const [getItems, itemsRaw, loadingItems, errorItems] = useFetch({
    endpoint: "GET_MY_REPORTS",
    initialState: null,
  }) as [any, { results?: ItemReportRow[] } | null, boolean, any];

  const [getDeliveries, deliveriesRaw, loadingDeliveries, errorDeliveries] = useFetch({
    endpoint: "GET_DELIVERY_REPORTS",
    initialState: null,
  }) as [any, { results?: DeliveryReportRow[] } | null, boolean, any];

  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount((v) => v + 1), []);

  useEffect(() => {
    getItems({ params: { role, page_size: 200 } });
    getDeliveries({
      params: { role: role === "made" ? "reporter" : "reported", page_size: 200 },
    });
  }, [getItems, getDeliveries, role, reloadCount]);

  const rows: MyReportItem[] = useMemo(
    () => [
      ...(itemsRaw?.results || []).map(fromItemRow),
      // A 403 (not a member) leaves deliveriesRaw empty: no delivery rows.
      ...(deliveriesRaw?.results || []).map(fromDeliveryRow),
    ],
    [itemsRaw, deliveriesRaw]
  );

  // Delivery reports are optional (403 for non-members): only a failure of
  // the item list is an error for the page.
  const error = errorItems;
  const loading = loadingItems || loadingDeliveries;
  return { rows, loading, error, deliveryError: errorDeliveries, reload };
};

export default useMyReports;
