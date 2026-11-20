"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/store";
import { getI18Ntext } from "@/i18n";
import {
  downloadPendingRefundsExcel,
  dueRefundRows,
  listRows,
} from "./pendingRefundsExcel";
import type { RefundListRow, RefundMissingRow, RefundRow } from "./types";

// By shape, not by the status filter: right after switching the filter the
// previous list is still shown until the new one loads.
export const isMissingRefund = (row: RefundListRow): row is RefundMissingRow =>
  row.id === null;

export type RefundFilter = "pending" | "refunded" | "missing";

// Refund list of the active edition (admin Pagos tab). The team splits it by
// hand: mark refunded / undo, and an Excel export.
const useRefunds = (onChanged: () => void) => {
  const mathtradeId = useStore((state) => state.data?.mathtrade?.id) ?? null;
  const [status, setStatus] = useState<RefundFilter>("pending");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Stable reference: useFetch refetches whenever urlParams changes identity.
  const urlParams = useMemo(() => [mathtradeId ?? 0], [mathtradeId]);

  const [loadRefunds, refunds, loading, errorList] = useFetch({
    endpoint: "GET_PAYMENT_REFUNDS",
    urlParams,
    initialState: [],
  });

  const reload = useCallback(() => {
    if (!mathtradeId) return;
    const params: Record<string, string> = { status };
    if (debounced) params.q = debounced;
    loadRefunds({ params });
  }, [mathtradeId, status, debounced, loadRefunds]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Excel of ALL refunds still to make: its own fetches (pending + missing,
  // no q), so the screen's filter and search never shrink it. The endpoint is
  // not paginated; a paginated answer with a next page is refused, never
  // exported as a partial file.
  const [loadDue] = useFetch({ endpoint: "GET_PAYMENT_REFUNDS", urlParams });
  const mathtradeName = useStore((state) => state.data?.mathtrade?.name);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [nothingToExport, setNothingToExport] = useState(false);
  const exportingRef = useRef(false);
  const exportDue = useCallback(async () => {
    if (exportingRef.current) return;
    exportingRef.current = true;
    setExporting(true);
    setExportError(false);
    setNothingToExport(false);
    try {
      const all: unknown[] = [];
      for (const which of ["pending", "missing"]) {
        const data = await loadDue({ params: { status: which } });
        const { rows: part, partial } = listRows(data);
        if (data === undefined || data === null || partial) {
          setExportError(true);
          return;
        }
        all.push(...part);
      }
      const due = dueRefundRows(all);
      if (!due.length) {
        setNothingToExport(true);
        return;
      }
      downloadPendingRefundsExcel(
        due,
        {
          headers: [
            "name",
            "user",
            "email",
            "city",
            "amount",
            "holder",
            "alias",
            "cbu",
            "status",
          ].map((key) => getI18Ntext(`adminPayments.refunds.dueXls.${key}`)),
          statusPending: getI18Ntext("adminPayments.refunds.dueXls.pending"),
          statusMissing: getI18Ntext("adminPayments.refunds.dueXls.missing"),
        },
        mathtradeName,
      );
    } catch {
      setExportError(true);
    } finally {
      exportingRef.current = false;
      setExporting(false);
    }
  }, [loadDue, mathtradeName]);

  const afterAction = useCallback(() => {
    reload();
    onChanged();
  }, [reload, onChanged]);

  const [markApi, , marking, errorMark] = useFetch({
    endpoint: "POST_PAYMENT_REFUND_MARK",
    method: "POST",
    urlParams,
    afterLoad: afterAction,
  });
  const [undoApi, , undoing, errorUndo] = useFetch({
    endpoint: "POST_PAYMENT_REFUND_UNDO",
    method: "POST",
    urlParams,
    afterLoad: afterAction,
  });

  // Callers confirm first (ConfirmModal): these send right away.
  const mark = useCallback((row: RefundRow) => markApi({ urlParams: [row.id] }), [markApi]);
  const undo = useCallback((row: RefundRow) => undoApi({ urlParams: [row.id] }), [undoApi]);

  // The list can be a bare array or {results}: normalize.
  const rows = useMemo(() => {
    const list = Array.isArray(refunds) ? refunds : refunds?.results;
    return (Array.isArray(list) ? list : []) as RefundListRow[];
  }, [refunds]);

  return {
    status,
    setStatus,
    search,
    setSearch,
    rows,
    loading: !!(loading || marking || undoing),
    error: errorList || errorMark || errorUndo,
    mark,
    undo,
    exportDue,
    exporting,
    exportError,
    nothingToExport,
  };
};

export default useRefunds;
