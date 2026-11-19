"use client";
import { useEffect, useState } from "react";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirmModal";
import ErrorAlert from "@/components/errorAlert";
import I18N from "@/i18n";
import useFetch from "@/hooks/useFetch";
import { DateIntlFormat } from "@/utils/dateUtils";
import { formatAmount } from "../../my-data/ContributionBox";
import type { PaymentsSummary } from "./types";

const inputClass = "border border-line rounded-md p-2 text-sm bg-white w-full sm:w-32";

// Admin "Pagos" tab: price per game, recompute, summary and publishing of
// "Mis pagos". Once published everything is frozen (BE answers 400/409).
const PaymentsControl = () => {
  const [confirming, setConfirming] = useState(false);
  const [price, setPrice] = useState("");
  const [invalidPrice, setInvalidPrice] = useState(false);

  const [reload, data, loading, errorLoad] = useFetch({
    endpoint: "GET_PAYMENTS_ADMIN",
    initialState: null,
    autoLoad: true,
  });
  const summary = data as PaymentsSummary | null;
  const refresh = () => {
    reload();
  };

  const [savePrice, , saving, errorSave] = useFetch({
    endpoint: "PATCH_PAYMENTS_ADMIN",
    method: "PATCH",
    afterLoad: refresh,
  });
  const [recompute, , recomputing, errorRecompute] = useFetch({
    endpoint: "POST_PAYMENTS_RECOMPUTE",
    method: "POST",
    afterLoad: refresh,
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
    if (storedPrice !== undefined) setPrice(String(Number(storedPrice)));
  }, [storedPrice]);

  const published = !!summary?.published_at;
  const busy = saving || recomputing || publishing || unpublishing;

  const onSavePrice = () => {
    const value = Number(price.replace(",", "."));
    if (!price.trim() || !Number.isFinite(value) || value <= 0) {
      setInvalidPrice(true);
      return;
    }
    setInvalidPrice(false);
    savePrice({ params: { price_per_game: value } });
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
              disabled={busy || loading || (!published && summary.members_count === 0)}
              onClick={() => setConfirming(true)}
            >
              <I18N id={published ? "adminPayments.unpublish" : "adminPayments.publish"} />
            </Button>
          </div>
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
                <I18N id="adminPayments.totalSuggested" values={[formatAmount(summary.totals.suggested)]} />
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
        </>
      ) : null}
      <ErrorAlert error={errorSave || errorRecompute || errorPublish || errorUnpublish} />
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
      />
    </div>
  );
};

export default PaymentsControl;
