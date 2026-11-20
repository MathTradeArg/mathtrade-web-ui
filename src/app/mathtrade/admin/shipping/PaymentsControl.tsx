"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirmModal";
import ErrorAlert from "@/components/errorAlert";
import I18N from "@/i18n";
import useFetch from "@/hooks/useFetch";
import { DateIntlFormat } from "@/utils/dateUtils";
import {
  formatAmount,
  negateAmount,
  parseCents,
  parsePriceInput,
  priceToInput,
  subtractAmounts,
} from "@/utils/money";
import { publishEmailNotice } from "@/utils/paymentsEmail";
import PaymentReceiptsPanel from "./PaymentReceiptsPanel";
import RefundsPanel from "./RefundsPanel";
import PaymentsPreview from "./PaymentsPreview";
import type { PaymentsSummary } from "./types";

const inputClass = "border border-line rounded-md p-2 text-sm bg-white w-full sm:w-32";

// Share of what lands on the payment accounts that goes to each one (the team
// compares them by eye: no cap, no automatic alert). The whole is the sum of
// the accounts, not the net total: that one also subtracts the refunds, so the
// shares would add up to more than 100%.
const percent = (part: string, whole: number) => {
  if (whole <= 0) return "0%";
  return `${Math.round(((parseCents(part) ?? 0) / whole) * 100)}%`;
};

const AccountsTable = ({ summary }: { summary: PaymentsSummary }) => {
  const accounts = summary.accounts || [];
  const activeAccounts = accounts.filter((a) => a.active);
  const accountsTotal = accounts.reduce((sum, a) => sum + (parseCents(a.total) ?? 0), 0);
  // The columns only hold money coming IN. The summary carries the net of all
  // rows (refunds are negative rows there, so already subtracted) and the
  // refunds due: incoming = net + refunds. Refunds go out, they are not
  // assigned to any account, so the final balance only shows in the footer.
  const refundsDue = summary.refunds.due_total;
  const incoming = subtractAmounts(summary.totals.net, negateAmount(refundsDue));
  return (
    <div className="mb-3">
      <h4 className="font-medium text-ink mb-1">
        <I18N id="adminPayments.accounts.title" />
      </h4>
      {activeAccounts.length === 0 ? (
        <p className="text-xs text-red-600 mb-2">
          <I18N id="adminPayments.accounts.noActive" />
        </p>
      ) : null}
      {summary.unassigned > 0 ? (
        <p className="text-xs text-red-600 mb-2">
          <I18N id="adminPayments.accounts.unassigned" values={[summary.unassigned]} />
        </p>
      ) : null}
      {accounts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-1 pr-2 font-normal">
                  <I18N id="adminPayments.accounts.holder" />
                </th>
                <th className="py-1 px-2 font-normal text-right">
                  <I18N id="adminPayments.accounts.people" />
                </th>
                <th className="py-1 px-2 font-normal text-right">
                  <I18N id="adminPayments.accounts.total" />
                </th>
                <th className="py-1 pl-2 font-normal text-right">
                  <I18N id="adminPayments.accounts.share" />
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-stroke align-top">
                  <td className="py-1 pr-2 break-words">
                    {a.holder_name} <span className="text-gray-500">({a.alias})</span>
                    {!a.active ? (
                      <span className="block text-xs text-gray-500">
                        <I18N id="adminPayments.accounts.inactive" />
                      </span>
                    ) : null}
                  </td>
                  <td className="py-1 px-2 text-right">{a.people}</td>
                  <td className="py-1 px-2 text-right whitespace-nowrap">{formatAmount(a.total)}</td>
                  <td className="py-1 pl-2 text-right">{percent(a.total, accountsTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-stroke">
                <td className="py-1 pr-2">
                  <I18N id="adminPayments.accounts.footerIncoming" />
                </td>
                <td className="py-1 px-2" />
                <td className="py-1 px-2 text-right whitespace-nowrap">{formatAmount(incoming)}</td>
                <td className="py-1 pl-2" />
              </tr>
              <tr>
                <td className="py-1 pr-2">
                  <I18N id="adminPayments.accounts.footerRefunds" />
                </td>
                <td className="py-1 px-2" />
                <td className="py-1 px-2 text-right whitespace-nowrap">
                  {formatAmount(negateAmount(refundsDue))}
                </td>
                <td className="py-1 pl-2" />
              </tr>
              <tr className="border-t border-stroke font-semibold">
                <td className="py-1 pr-2">
                  <I18N id="adminPayments.accounts.footerBalance" />
                </td>
                <td className="py-1 px-2" />
                <td className="py-1 px-2 text-right whitespace-nowrap">
                  {formatAmount(summary.totals.net)}
                </td>
                <td className="py-1 pl-2" />
              </tr>
            </tfoot>
          </table>
        </div>
      ) : null}
    </div>
  );
};

// Admin "Pagos" tab: price per game, recompute, summary and publishing of
// "Mis pagos". Once published everything is frozen (BE answers 400/409).
const PaymentsControl = () => {
  const [confirming, setConfirming] = useState(false);
  const [price, setPrice] = useState("");
  const [invalidPrice, setInvalidPrice] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [testSent, setTestSent] = useState(false);

  const [reload, data, loading, errorLoad] = useFetch({
    endpoint: "GET_PAYMENTS_ADMIN",
    initialState: null,
    autoLoad: true,
  });
  const summary = data as PaymentsSummary | null;
  const refresh = useCallback(() => {
    reload();
  }, [reload]);

  const [recompute, , recomputing, errorRecompute] = useFetch({
    endpoint: "POST_PAYMENTS_RECOMPUTE",
    method: "POST",
    afterLoad: refresh,
  });
  // A new price leaves the computed amounts stale: recompute right away.
  const [savePrice, , saving, errorSave] = useFetch({
    endpoint: "PATCH_PAYMENTS_ADMIN",
    method: "PATCH",
    afterLoad: () => {
      recompute();
    },
  });
  // Informative deadline: editable even when published (it changes no amount).
  const [saveDueDate, , savingDueDate, errorDueDate] = useFetch({
    endpoint: "PATCH_PAYMENTS_ADMIN",
    method: "PATCH",
    afterLoad: refresh,
  });
  // Sends the email only to the admin who clicks; works while unpublished.
  const [sendTest, , sendingTest, errorTest] = useFetch({
    endpoint: "POST_PAYMENTS_EMAIL_TEST",
    method: "POST",
    afterLoad: () => setTestSent(true),
  });
  const [publish, , publishing, errorPublish] = useFetch({
    endpoint: "POST_PAYMENTS_PUBLISH",
    method: "POST",
    afterLoad: refresh,
  });
  const [unpublish, , unpublishing, errorUnpublish] = useFetch({
    endpoint: "DELETE_PAYMENTS_PUBLISH",
    method: "DELETE",
    afterLoad: refresh,
  });

  const storedPrice = summary?.price_per_game;
  useEffect(() => {
    if (storedPrice !== undefined) setPrice(priceToInput(storedPrice));
  }, [storedPrice]);

  const storedDueDate = summary?.payments_due_date;
  useEffect(() => {
    if (storedDueDate !== undefined) setDueDate(storedDueDate || "");
  }, [storedDueDate]);

  const published = !!summary?.published_at;
  const busy = saving || recomputing || publishing || unpublishing;
  const emailNotice = publishEmailNotice(summary);

  const onSavePrice = () => {
    const value = parsePriceInput(price);
    if (value === null) {
      setInvalidPrice(true);
      return;
    }
    setInvalidPrice(false);
    savePrice({ params: { price_per_game: value } });
  };

  const onSaveDueDate = () => {
    saveDueDate({ params: { payments_due_date: dueDate || null } });
  };

  const onSendTest = () => {
    if (sendingTest) return;
    setTestSent(false);
    sendTest();
  };

  return (
    <div className="mb-4">
      <h2 className="text-card-title text-ink mb-1">
        <I18N id="adminPayments.title" />
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        <I18N id="adminPayments.help" />
      </p>
      <ErrorAlert error={errorLoad} />
      {summary ? (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-sm font-semibold ${published ? "text-green-700" : "text-gray-600"}`}>
              {published ? (
                <I18N id="adminPayments.published" values={[DateIntlFormat(summary.published_at)]} />
              ) : (
                <I18N id="adminPayments.unpublished" />
              )}
            </span>
            <Button
              type="button"
              sm
              outline={published}
              disabled={
                busy ||
                loading ||
                (!published && (summary.members_count === 0 || summary.stale))
              }
              onClick={() => setConfirming(true)}
            >
              <I18N id={published ? "adminPayments.unpublish" : "adminPayments.publish"} />
            </Button>
          </div>
          {!published && summary.stale ? (
            <p className="text-xs text-red-600 mb-3">
              <I18N id="adminPayments.stale" />
            </p>
          ) : null}
          {summary.stale_credit_count > 0 ? (
            <p className="text-xs text-red-600 mb-3">
              <I18N
                id={published ? "adminPayments.staleAfterPublish" : "adminPayments.staleCredit"}
                values={[summary.stale_credit_count]}
              />
            </p>
          ) : null}
          {published ? (
            <p className="text-xs text-gray-500 mb-3">
              <I18N id="adminPayments.frozen" />
            </p>
          ) : null}
          <div className="flex flex-wrap items-end gap-3 mb-3">
            <label className="text-xs text-gray-500 flex flex-col gap-1 w-full sm:w-auto">
              <I18N id="adminPayments.price" />
              <input
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={price}
                disabled={published}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <Button type="button" sm outline disabled={published || busy} onClick={onSavePrice}>
              <I18N id="adminPayments.savePrice" />
            </Button>
            <Button
              type="button"
              sm
              disabled={published || busy}
              onClick={() => recompute()}
            >
              <I18N id="adminPayments.recompute" />
            </Button>
          </div>
          {published ? (
            <p className="text-xs text-gray-500 mb-3">
              <I18N id="adminPayments.recomputeBlocked" />
            </p>
          ) : null}
          {invalidPrice ? (
            <p className="text-xs text-red-600 mb-2">
              <I18N id="adminPayments.invalidPrice" />
            </p>
          ) : null}
          <div className="flex flex-wrap items-end gap-3 mb-1">
            <label className="text-xs text-gray-500 flex flex-col gap-1 w-full sm:w-auto">
              <I18N id="adminPayments.dueDate" />
              <input
                type="date"
                className={inputClass}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>
            <Button
              type="button"
              sm
              outline
              disabled={savingDueDate || dueDate === (storedDueDate || "")}
              onClick={onSaveDueDate}
            >
              <I18N id="adminPayments.saveDueDate" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            <I18N id="adminPayments.dueDateHelp" />
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <Button type="button" sm outline disabled={sendingTest} onClick={onSendTest}>
              <I18N id="adminPayments.emailTest" />
            </Button>
            {testSent && !sendingTest && !errorTest ? (
              <span className="text-xs text-green-700">
                <I18N id="adminPayments.emailTestSent" />
              </span>
            ) : null}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            <I18N id="adminPayments.emailTestHelp" />
          </p>
          <h3 className="font-semibold text-ink mb-1">
            <I18N id="adminPayments.summary" />
          </h3>
          {summary.computed_at ? (
            <ul className="text-sm text-gray-700 mb-2">
              <li>
                <I18N id="adminPayments.members" values={[summary.members_count]} />
              </li>
              <li>
                <I18N id="adminPayments.partialCount" values={[summary.partial_count]} />
              </li>
              <li>
                <I18N id="adminPayments.totalBase" values={[formatAmount(summary.totals.base)]} />
              </li>
              <li>
                <I18N id="adminPayments.totalShipping" values={[formatAmount(summary.totals.shipping)]} />
              </li>
              <li>
                <I18N id="adminPayments.totalCredit" values={[formatAmount(summary.totals.credit)]} />
              </li>
              <li>
                <I18N id="adminPayments.totalNet" values={[formatAmount(summary.totals.net)]} />
              </li>
              <li>
                <I18N
                  id="adminPayments.refundsCount"
                  values={[
                    summary.refunds.due_count,
                    formatAmount(summary.refunds.due_total),
                    summary.refunds.with_account,
                    summary.refunds.missing,
                    summary.refunds.refunded,
                  ]}
                />
              </li>
              <li>
                <I18N
                  id="adminPayments.receiptsCount"
                  values={[
                    summary.receipts.approved,
                    summary.receipts.pending,
                    summary.receipts.rejected,
                    summary.receipts.missing,
                  ]}
                />
              </li>
              <li className="text-xs text-gray-500">
                <I18N id="adminPayments.computedAt" values={[DateIntlFormat(summary.computed_at)]} />
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-600 mb-2">
              <I18N id="adminPayments.neverComputed" />
            </p>
          )}
          {summary.computed_at ? <AccountsTable summary={summary} /> : null}
        </>
      ) : null}
      <ErrorAlert error={errorSave || errorRecompute || errorUnpublish || errorDueDate} />
      <ErrorAlert error={errorTest} />
      <ErrorAlert
        error={errorPublish}
        errorMessage={errorPublish?.status === 400 ? "adminPayments.publishRefused" : ""}
      />
      <ConfirmModal
        isOpen={confirming}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          if (published) unpublish();
          else publish();
        }}
        title={`adminPayments.${published ? "unconfirmTitle" : "confirmTitle"}`}
        description={`adminPayments.${published ? "unconfirmDescription" : "confirmDescription"}`}
        confirmId={`adminPayments.${published ? "unconfirm" : "confirm"}`}
        variant={published ? "danger" : "primary"}
      >
        {!published && emailNotice.kind !== "none" ? (
          <p className="text-sm text-gray-700 text-balance mt-3">
            {emailNotice.kind === "first" ? (
              <I18N
                id={emailNotice.recipients === 1 ? "adminPayments.emailFirstOne" : "adminPayments.emailFirst"}
                values={[emailNotice.recipients]}
              />
            ) : (
              <I18N id="adminPayments.emailAlready" />
            )}
          </p>
        ) : null}
      </ConfirmModal>
      <PaymentsPreview />
      <PaymentReceiptsPanel onChanged={refresh} counts={summary?.receipts} />
      <RefundsPanel onChanged={refresh} counts={summary?.refunds} />
    </div>
  );
};

export default PaymentsControl;
