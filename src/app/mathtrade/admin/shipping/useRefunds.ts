"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/store";
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
  };
};

export default useRefunds;
