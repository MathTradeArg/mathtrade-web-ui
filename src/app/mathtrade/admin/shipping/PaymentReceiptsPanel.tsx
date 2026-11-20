"use client";
import { useState } from "react";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirmModal";
import ErrorAlert from "@/components/errorAlert";
import Modal from "@/components/modal";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";
import { formatAmount } from "@/utils/money";
import { AdminUserName } from "@/components/adminUserModal";
import usePaymentReceipts, { isMissingReceipt } from "./usePaymentReceipts";
import CollapsibleSection from "./CollapsibleSection";
import type { PaymentReceiptRow, PaymentsSummary } from "./types";

const fullName = (row: { first_name: string; last_name: string }) =>
  `${row.first_name} ${row.last_name}`.trim();

// I18N renders text containing "<" as HTML: keep member names as text.
const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "";

/* w-full + max-w-full on mobile: native <select> min-width follows the
 * longest option, which otherwise overflows ~390px. */
const selectClass =
  "border border-line rounded-md p-2 text-sm bg-white w-full sm:w-auto max-w-full min-w-0";

const RejectModal = ({
  row,
  onClose,
  onReject,
}: {
  row: PaymentReceiptRow | null;
  onClose: () => void;
  onReject: (row: PaymentReceiptRow, reason: string) => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <Modal size="sm" isOpen={!!row} onClose={onClose}>
      {row ? (
        <div>
          <h3 className="text-card-title mb-2 text-center text-ink">
            <I18N id="adminPayments.receipts.rejectTitle" />
          </h3>
          <p className="text-sm text-gray-600 mb-3 text-center">
            {fullName(row)}
          </p>
          <textarea
            className="w-full border border-line rounded-md p-2 text-sm mb-3"
            rows={3}
            value={reason}
            placeholder={getI18Ntext(
              "adminPayments.receipts.reasonPlaceholder",
            )}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex flex-col items-stretch gap-2">
            <Button
              block
              type="button"
              color="cancel"
              outline
              onClick={onClose}
            >
              <I18N id="btn.Cancel" />
            </Button>
            <Button
              block
              type="button"
              color="danger"
              disabled={!reason.trim()}
              onClick={() => {
                onReject(row, reason.trim());
                setReason("");
              }}
            >
              <I18N id="adminPayments.receipts.reject" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            <I18N id="adminPayments.receipts.rejectHelp" />
          </p>
        </div>
      ) : null}
    </Modal>
  );
};

// Review list of the "Mis pagos" receipts, inside the admin Pagos tab.
const PaymentReceiptsPanel = ({
  onChanged,
  counts,
}: {
  onChanged: () => void;
  counts?: PaymentsSummary["receipts"];
}) => {
  const {
    status,
    setStatus,
    account,
    setAccount,
    accounts,
    receipts,
    loading,
    error,
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
  } = usePaymentReceipts(onChanged);
  const [undoing, setUndoing] = useState<PaymentReceiptRow | null>(null);

  return (
    <CollapsibleSection
      title={<I18N id="adminPayments.receipts.title" />}
      summary={
        counts ? (
          <I18N
            id="adminPayments.receipts.summary"
            values={[
              counts.pending,
              counts.approved,
              counts.rejected,
              counts.missing,
            ]}
          />
        ) : null
      }
      actions={
        <div className="flex flex-col items-stretch sm:items-end gap-1">
          <button
            type="button"
            disabled={exporting || counts?.missing === 0}
            title={
              counts?.missing === 0
                ? getI18Ntext("adminPayments.receipts.xls.none")
                : undefined
            }
            onClick={exportMissing}
            className="bg-brand text-brand-ink hover:brightness-95 text-sm px-4 py-2 rounded-md flex items-center justify-center gap-1 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon type="xls" />
            {exporting ? (
              <I18N id="adminPayments.receipts.xls.loading" />
            ) : (
              <I18N id="adminPayments.receipts.xls.btn" />
            )}
          </button>
          {counts?.missing === 0 || nothingToExport ? (
            <p className="text-xs text-gray-500 sm:text-right">
              <I18N id="adminPayments.receipts.xls.none" />
            </p>
          ) : null}
          {errorExport ? (
            <p role="alert" className="text-xs text-danger sm:text-right">
              <I18N id="adminPayments.receipts.xls.error" />
            </p>
          ) : null}
        </div>
      }
      defaultOpen={false}
      storageKey="mt_admin_payments_receipts_open"
    >
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-4 w-full min-w-0 max-w-full">
        <select
          className={selectClass}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["pending", "approved", "rejected", "missing", ""].map((value) => (
            <option key={value} value={value}>
              {getI18Ntext(`adminPayments.receipts.filter.${value || "all"}`)}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        >
          <option value="">
            {getI18Ntext("adminPayments.receipts.filter.allAccounts")}
          </option>
          {accounts.map((a: any) => (
            <option key={a.id} value={a.id}>
              {a.holder_name} ({a.alias})
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 shrink-0">
          <I18N id="adminPayments.receipts.count" values={[receipts.length]} />
        </p>
      </div>

      <ErrorAlert error={error} />

      {receipts.length === 0 && !loading ? (
        <p className="text-gray-500 text-sm">
          <I18N id="adminPayments.receipts.empty" />
        </p>
      ) : null}

      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1">
        {receipts.map((row) =>
          isMissingReceipt(row) ? (
            <div
              key={`m-${row.membership_id}`}
              className="border border-line rounded-card p-4 mb-3"
            >
              <div className="text-sm min-w-0 max-w-full break-words">
                <p className="font-bold text-base break-words">
                  <AdminUserName userId={row.user_id}>
                    {fullName(row)}
                  </AdminUserName>{" "}
                  <span className="font-normal text-gray-500">
                    ({row.bgg_user})
                  </span>
                </p>
                <p className="break-words">
                  {row.email}
                  {row.location ? ` · ${row.location}` : ""}
                </p>
                <p className="break-words">
                  {row.account ? (
                    `→ ${row.account.holder_name} (${row.account.alias})`
                  ) : (
                    <I18N id="adminPayments.receipts.noAccount" />
                  )}
                </p>
                <p className="text-gray-500">
                  <I18N id="adminPayments.receipts.status.missing" />
                </p>
              </div>
            </div>
          ) : (
            <div
              key={row.id}
              className="border border-line rounded-card p-4 mb-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
                <div className="text-sm min-w-0 max-w-full break-words">
                  <p className="font-bold text-base break-words">
                    <AdminUserName userId={row.user_id}>
                      {fullName(row)}
                    </AdminUserName>{" "}
                    <span className="font-normal text-gray-500">
                      ({row.bgg_user})
                    </span>
                  </p>
                  <p className="break-words">
                    {row.email}
                    {row.location ? ` · ${row.location}` : ""}
                  </p>
                  <p className="break-words">
                    {formatAmount(row.amount)} → {row.account.holder_name} (
                    {row.account.alias})
                  </p>
                  <p className="text-gray-500">
                    <I18N id={`adminPayments.receipts.status.${row.status}`} />{" "}
                    · {formatDate(row.submitted_at)}
                    {row.reviewed_by ? ` · ${row.reviewed_by}` : ""}
                  </p>
                  {row.status === "rejected" && row.rejection_reason ? (
                    <p className="text-danger">{row.rejection_reason}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    sm
                    outline
                    type="button"
                    onClick={() => viewReceipt(row)}
                  >
                    <I18N id="adminPayments.receipts.view" />
                  </Button>
                  {row.status === "pending" ? (
                    <>
                      <Button sm type="button" onClick={() => approve(row)}>
                        <I18N id="adminPayments.receipts.approve" />
                      </Button>
                      <Button
                        sm
                        type="button"
                        color="danger"
                        onClick={() => setRejecting(row)}
                      >
                        <I18N id="adminPayments.receipts.reject" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      sm
                      outline
                      type="button"
                      color="danger"
                      onClick={() => setUndoing(row)}
                    >
                      <I18N id="adminPayments.receipts.undo" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <RejectModal
        row={rejecting}
        onClose={() => setRejecting(null)}
        onReject={reject}
      />
      <ConfirmModal
        isOpen={!!undoing}
        onCancel={() => setUndoing(null)}
        onConfirm={() => {
          if (undoing) undo(undoing.id);
          setUndoing(null);
        }}
        title="adminPayments.receipts.undoConfirm"
        description="adminPayments.receipts.undoText"
        descriptionValues={[escapeHtml(undoing ? fullName(undoing) : "")]}
      />
    </CollapsibleSection>
  );
};

export default PaymentReceiptsPanel;
