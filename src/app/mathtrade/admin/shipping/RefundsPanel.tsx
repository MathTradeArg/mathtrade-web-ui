"use client";
import { useState } from "react";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirmModal";
import CopyValue from "@/components/copyValue";
import ErrorAlert from "@/components/errorAlert";
import XlsButton from "@/components/xlsButton";
import { AdminUserName } from "@/components/adminUserModal";
import I18N, { getI18Ntext } from "@/i18n";
import { DateIntlFormat } from "@/utils/dateUtils";
import { formatAmount } from "@/utils/money";
import useRefunds, { isMissingRefund, type RefundFilter } from "./useRefunds";
import CollapsibleSection from "./CollapsibleSection";
import type { PaymentsSummary, RefundListRow, RefundRow } from "./types";

const fullName = (row: { first_name: string; last_name: string }) =>
  `${row.first_name} ${row.last_name}`.trim();

// I18N renders text containing "<" as HTML: keep member names as text.
const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FILTERS: RefundFilter[] = ["pending", "refunded", "missing"];

const selectClass =
  "border border-line rounded-md p-2 text-sm bg-white w-full sm:w-auto max-w-full min-w-0";

// One line per row for the Excel download (what the team splits by hand).
const excelRows = (rows: RefundListRow[]) =>
  rows.map((row) => ({
    [getI18Ntext("adminPayments.refunds.xls.user")]: row.bgg_user,
    [getI18Ntext("adminPayments.refunds.xls.name")]: fullName(row),
    [getI18Ntext("adminPayments.refunds.xls.amount")]: formatAmount(row.amount),
    [getI18Ntext("adminPayments.refunds.xls.holder")]: isMissingRefund(row)
      ? ""
      : row.holder_name,
    [getI18Ntext("adminPayments.refunds.xls.alias")]: isMissingRefund(row)
      ? ""
      : row.alias,
    [getI18Ntext("adminPayments.refunds.xls.cbu")]: isMissingRefund(row)
      ? ""
      : row.cbu,
    [getI18Ntext("adminPayments.refunds.xls.status")]: getI18Ntext(
      `adminPayments.refunds.status.${row.status}`,
    ),
  }));

const Header = ({ row }: { row: RefundListRow }) => (
  <>
    <p className="font-bold text-base break-words">
      <AdminUserName userId={row.user_id}>{fullName(row)}</AdminUserName>{" "}
      <span className="font-normal text-gray-500">({row.bgg_user})</span>
    </p>
    <p className="break-words">
      {row.email}
      {row.location ? ` · ${row.location}` : ""}
    </p>
  </>
);

// Refunds to participants whose net is negative (registration credit above
// what they owe), inside the admin Pagos tab.
const RefundsPanel = ({
  onChanged,
  counts,
}: {
  onChanged: () => void;
  counts?: PaymentsSummary["refunds"];
}) => {
  const {
    status,
    setStatus,
    search,
    setSearch,
    rows,
    loading,
    error,
    mark,
    undo,
  } = useRefunds(onChanged);
  const [marking, setMarking] = useState<RefundRow | null>(null);
  const [undoing, setUndoing] = useState<RefundRow | null>(null);

  return (
    <CollapsibleSection
      title={<I18N id="adminPayments.refunds.title" />}
      summary={
        counts ? (
          <I18N
            id="adminPayments.refunds.summary"
            values={[
              counts.due_count,
              counts.with_account,
              counts.missing,
              counts.refunded,
            ]}
          />
        ) : null
      }
      defaultOpen
      storageKey="mt_admin_payments_refunds_open"
    >
      <p className="text-xs text-gray-500 mb-2">
        <I18N id="adminPayments.refunds.help" />
      </p>
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-4 w-full min-w-0 max-w-full">
        <select
          className={selectClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as RefundFilter)}
        >
          {FILTERS.map((value) => (
            <option key={value} value={value}>
              {getI18Ntext(`adminPayments.refunds.filter.${value}`)}
            </option>
          ))}
        </select>
        <input
          type="search"
          className="border border-line rounded-md p-2 text-sm bg-white w-full sm:w-64 min-w-0"
          value={search}
          placeholder={getI18Ntext("adminPayments.refunds.searchPlaceholder")}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-sm text-gray-600 shrink-0">
          <I18N id="adminPayments.refunds.count" values={[rows.length]} />
        </p>
        {rows.length > 0 ? (
          <XlsButton
            data={excelRows(rows)}
            filename={`devoluciones-${status}`}
            className="w-full sm:w-auto justify-center"
          />
        ) : null}
      </div>

      <ErrorAlert error={error} />

      {rows.length === 0 && !loading ? (
        <p className="text-gray-500 text-sm">
          <I18N id="adminPayments.refunds.empty" />
        </p>
      ) : null}

      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1">
        {rows.map((row) =>
          isMissingRefund(row) ? (
            <div
              key={`m-${row.membership_id}`}
              className="border border-line rounded-card p-4 mb-3"
            >
              <div className="text-sm min-w-0 max-w-full break-words">
                <Header row={row} />
                <p className="font-semibold">{formatAmount(row.amount)}</p>
                <p className="text-gray-500">
                  <I18N id="adminPayments.refunds.status.missing" />
                </p>
              </div>
            </div>
          ) : (
            <div
              key={row.id}
              className="border border-line rounded-card p-4 mb-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
                <div className="text-sm min-w-0 max-w-full break-words flex-1">
                  <Header row={row} />
                  <p className="font-semibold">
                    {row.status === "refunded" && row.refunded_amount
                      ? formatAmount(row.refunded_amount)
                      : formatAmount(row.amount)}
                  </p>
                  <CopyValue
                    label="payments.refund.holder"
                    value={row.holder_name}
                  />
                  <CopyValue label="payments.refund.alias" value={row.alias} />
                  <CopyValue label="payments.refund.cbu" value={row.cbu} />
                  <p className="text-gray-500">
                    <I18N id={`adminPayments.refunds.status.${row.status}`} />
                    {row.status === "refunded" && row.refunded_at
                      ? ` · ${DateIntlFormat(row.refunded_at)}`
                      : ""}
                    {row.refunded_by ? ` · ${row.refunded_by}` : ""}
                  </p>
                  {!row.still_due ? (
                    <p className="text-xs text-amber-700 mt-1">
                      <I18N id="adminPayments.refunds.notDue" />
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {row.status === "refunded" ? (
                    <Button
                      sm
                      outline
                      type="button"
                      color="danger"
                      onClick={() => setUndoing(row)}
                    >
                      <I18N id="adminPayments.refunds.undo" />
                    </Button>
                  ) : (
                    <Button sm type="button" onClick={() => setMarking(row)}>
                      <I18N id="adminPayments.refunds.mark" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <ConfirmModal
        isOpen={!!marking}
        onCancel={() => setMarking(null)}
        onConfirm={() => {
          if (marking) mark(marking);
          setMarking(null);
        }}
        title="adminPayments.refunds.markConfirm"
        description="adminPayments.refunds.markText"
        descriptionValues={[
          marking ? formatAmount(marking.amount) : "",
          escapeHtml(marking ? fullName(marking) : ""),
        ]}
      />
      <ConfirmModal
        isOpen={!!undoing}
        onCancel={() => setUndoing(null)}
        onConfirm={() => {
          if (undoing) undo(undoing);
          setUndoing(null);
        }}
        title="adminPayments.refunds.undoConfirm"
        description="adminPayments.refunds.undoText"
        descriptionValues={[escapeHtml(undoing ? fullName(undoing) : "")]}
      />
    </CollapsibleSection>
  );
};

export default RefundsPanel;
