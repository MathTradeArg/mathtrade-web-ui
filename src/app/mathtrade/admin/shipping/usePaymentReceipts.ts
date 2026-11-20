"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/store";
import { openAuthenticatedFile } from "@/hooks/useFetch/utils";
import { getI18Ntext } from "@/i18n";
import { downloadMissingExcel, missingRows } from "./missingReceiptsExcel";
import type { PaymentReceiptMissingRow, PaymentReceiptRow } from "./types";

export type ReceiptReviewRow = PaymentReceiptRow | PaymentReceiptMissingRow;

// By shape, not by the status filter: right after switching the filter the
// previous list is still shown until the new one loads.
export const isMissingReceipt = (
  row: ReceiptReviewRow,
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

  // Excel of everyone without a receipt: its own fetch with only
  // status=missing, so the screen's status/account filters never shrink it.
  // The endpoint is not paginated, so this is the whole list.
  const [loadMissing, , exporting, errorExport] = useFetch({
    endpoint: "GET_PAYMENT_RECEIPTS",
    urlParams,
  });
  const [nothingToExport, setNothingToExport] = useState(false);
  const mathtradeName = useStore((state) => state.data?.mathtrade?.name);
  const exportMissing = useCallback(async () => {
    setNothingToExport(false);
    const data = await loadMissing({ params: { status: "missing" } });
    if (data === undefined) return; // failed: errorExport is set
    const rows = missingRows(data);
    if (!rows.length) {
      setNothingToExport(true);
      return;
    }
    downloadMissingExcel(
      rows,
      {
        headers: [
          "name",
          "user",
          "email",
          "city",
          "amount",
          "account",
          "status",
        ].map((key) => getI18Ntext(`adminPayments.receipts.xls.${key}`)),
        status: getI18Ntext("adminPayments.receipts.xls.statusValue"),
      },
      mathtradeName,
    );
  }, [loadMissing, mathtradeName]);

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
    [approveApi],
  );
  const reject = useCallback(
    (row: PaymentReceiptRow, reason: string) =>
      rejectApi({ urlParams: [row.id], params: { reason } }),
    [rejectApi],
  );
  // Callers confirm first (ConfirmModal): this sends right away.
  const undo = useCallback(
    (receiptId: number) => undoApi({ urlParams: [receiptId] }),
    [undoApi],
  );
  const viewReceipt = useCallback(
    (row: PaymentReceiptRow) =>
      openAuthenticatedFile({
        endpoint: "GET_PAYMENT_RECEIPT_FILE",
        urlParams: [mathtradeId, row.id],
      }),
    [mathtradeId],
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
    exportMissing,
    exporting,
    errorExport,
    nothingToExport,
  };
};

export default usePaymentReceipts;
