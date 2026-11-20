"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/store";
import { openAuthenticatedFile } from "@/hooks/useFetch/utils";
import type { PaymentReceiptMissingRow, PaymentReceiptRow } from "./types";

export type ReceiptReviewRow = PaymentReceiptRow | PaymentReceiptMissingRow;

// By shape, not by the status filter: right after switching the filter the
// previous list is still shown until the new one loads.
export const isMissingReceipt = (
  row: ReceiptReviewRow
): row is PaymentReceiptMissingRow => !("id" in row);

// Review of the "Mis pagos" receipts of the active edition (admin Pagos tab).
const usePaymentReceipts = (onChanged: () => void) => {
  const mathtradeId = useStore((state) => state.data?.mathtrade?.id) ?? null;
  const [status, setStatus] = useState("pending");
  const [account, setAccount] = useState("");
  const [rejecting, setRejecting] = useState<PaymentReceiptRow | null>(null);

  // Stable reference: useFetch refetches whenever urlParams changes identity.
  const urlParams = useMemo(() => [mathtradeId ?? 0], [mathtradeId]);

  const [loadAccounts, accounts] = useFetch({
    endpoint: "GET_CONTRIBUTION_ACCOUNTS",
    urlParams,
    initialState: [],
  });
  const [loadReceipts, receipts, loading, errorList] = useFetch({
    endpoint: "GET_PAYMENT_RECEIPTS",
    urlParams,
    initialState: [],
  });

  const reload = useCallback(() => {
    if (!mathtradeId) return;
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (account) params.account = account;
    loadReceipts({ params });
  }, [mathtradeId, status, account, loadReceipts]);

  useEffect(() => {
    if (mathtradeId) loadAccounts();
  }, [mathtradeId, loadAccounts]);

  useEffect(() => {
    reload();
  }, [reload]);

  const afterAction = useCallback(() => {
    setRejecting(null);
    reload();
    onChanged();
  }, [reload, onChanged]);

  const [approveApi, , approving, errorApprove] = useFetch({
    endpoint: "POST_PAYMENT_RECEIPT_APPROVE",
    method: "POST",
    urlParams,
    afterLoad: afterAction,
  });
  const [rejectApi, , rejectingLoading, errorReject] = useFetch({
    endpoint: "POST_PAYMENT_RECEIPT_REJECT",
    method: "POST",
    urlParams,
    afterLoad: afterAction,
  });
  const [undoApi, , undoing, errorUndo] = useFetch({
    endpoint: "POST_PAYMENT_RECEIPT_UNDO",
    method: "POST",
    urlParams,
    afterLoad: afterAction,
  });

  const approve = useCallback(
    (row: PaymentReceiptRow) => approveApi({ urlParams: [row.id] }),
    [approveApi]
  );
  const reject = useCallback(
    (row: PaymentReceiptRow, reason: string) =>
      rejectApi({ urlParams: [row.id], params: { reason } }),
    [rejectApi]
  );
  // Callers confirm first (ConfirmModal): this sends right away.
  const undo = useCallback(
    (receiptId: number) => undoApi({ urlParams: [receiptId] }),
    [undoApi]
  );
  const viewReceipt = useCallback(
    (row: PaymentReceiptRow) =>
      openAuthenticatedFile({
        endpoint: "GET_PAYMENT_RECEIPT_FILE",
        urlParams: [mathtradeId, row.id],
      }),
    [mathtradeId]
  );

  return {
    status,
    setStatus,
    account,
    setAccount,
    accounts: accounts || [],
    receipts: (receipts || []) as ReceiptReviewRow[],
    loading: loading || approving || rejectingLoading || undoing,
    error: errorList || errorApprove || errorReject || errorUndo,
    approve,
    reject,
    undo,
    rejecting,
    setRejecting,
    viewReceipt,
  };
};

export default usePaymentReceipts;
