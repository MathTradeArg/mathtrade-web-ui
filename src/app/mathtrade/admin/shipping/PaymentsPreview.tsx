"use client";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import ErrorAlert from "@/components/errorAlert";
import I18N, { getI18Ntext } from "@/i18n";
import useFetch from "@/hooks/useFetch";
import { formatAmount } from "@/utils/money";
import MyPayments from "@/app/mathtrade/results/myPayments";
import type { MyPayments as MyPaymentsData } from "@/app/mathtrade/results/myPayments/types";
import type { PaymentsMemberRow } from "./types";

const SEARCH_DELAY_MS = 300;

// Admin: what each participant would see in "Mis pagos", before publishing.
// Renders the participant's own component, read-only, with the BE preview body.
const PaymentsPreview = () => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState<PaymentsMemberRow | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Stable identity: useFetch refetches whenever params changes identity.
  const params = useMemo(() => ({ search: debounced, limit: 20 }), [debounced]);
  const [, membersData, loadingMembers, errorMembers] = useFetch({
    endpoint: "GET_PAYMENTS_MEMBERS",
    initialState: { results: [] },
    params,
    autoLoad: true,
  });
  const rows: PaymentsMemberRow[] = membersData?.results || [];

  const [loadPreview, previewData, loadingPreview, errorPreview] = useFetch({
    endpoint: "GET_PAYMENTS_PREVIEW",
    initialState: null,
  });

  const select = (row: PaymentsMemberRow) => {
    setSelected(row);
    loadPreview({ params: { member: row.user_id } });
  };

  return (
    <section className="mb-6">
      <h3 className="font-semibold text-ink mb-1">
        <I18N id="adminPayments.preview.heading" />
      </h3>
      <p className="text-xs text-gray-500 mb-2">
        <I18N id="adminPayments.preview.help" />
      </p>
      <label className="text-xs text-gray-500 flex flex-col gap-1 mb-2 sm:max-w-sm">
        <I18N id="adminPayments.preview.search" />
        <input
          type="search"
          className="border border-line rounded-md p-2 text-sm bg-white w-full"
          value={search}
          placeholder={getI18Ntext("adminPayments.preview.searchPlaceholder")}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <ErrorAlert error={errorMembers} />
      {rows.length === 0 && !loadingMembers ? (
        <p className="text-sm text-gray-600 mb-2">
          <I18N id="adminPayments.preview.none" />
        </p>
      ) : (
        <ul className="border border-stroke rounded-md divide-y divide-stroke max-h-64 overflow-y-auto mb-3">
          {rows.map((row) => (
            <li key={row.user_id}>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  selected?.user_id === row.user_id ? "bg-gray-100" : ""
                }`}
                onClick={() => select(row)}
              >
                <span className="font-medium">{row.full_name}</span>{" "}
                <span className="text-gray-500">@{row.username}</span>
                <span className="block text-xs text-gray-500">
                  {row.games_count > 0
                    ? getI18Ntext("adminPayments.preview.row", [
                        row.games_count,
                        formatAmount(row.total_to_transfer),
                        getI18Ntext(
                          `adminPayments.preview.receipt.${row.receipt_status || "missing"}`
                        ),
                      ])
                    : getI18Ntext("adminPayments.preview.noGames")}
                  {row.location ? ` · ${row.location}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <ErrorAlert error={errorPreview} />
      {selected ? (
        <div className="border-2 border-dashed border-amber-400 rounded-md">
          <div className="bg-amber-50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">
              {getI18Ntext("adminPayments.preview.title", [selected.username])}
            </p>
            <Button type="button" sm outline onClick={() => setSelected(null)}>
              <I18N id="adminPayments.preview.close" />
            </Button>
          </div>
          <p className="text-xs text-gray-600 px-3 pt-2">
            <I18N id="adminPayments.preview.readOnlyNote" />
          </p>
          {loadingPreview ? (
            <p className="text-sm text-gray-600 px-3 py-4">
              <I18N id="adminPayments.preview.loading" />
            </p>
          ) : (
            <MyPayments data={previewData as MyPaymentsData | null} readOnly />
          )}
        </div>
      ) : null}
    </section>
  );
};

export default PaymentsPreview;
