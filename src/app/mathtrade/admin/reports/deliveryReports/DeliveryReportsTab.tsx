"use client";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import Button from "@/components/button";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import ErrorAlert from "@/components/errorAlert";
import EmptyList from "@/components/emptyList";
import I18N, { getI18Ntext } from "@/i18n";
import useFetch from "@/hooks/useFetch";
import { PRIVATE_ROUTES } from "@/config/routes";
import { normalizeString } from "@/utils/text";
import { formatReportDate } from "@/utils/reportDate";
import DeliveryReportThread from "@/components/deliveryReport/thread";
import {
  DELIVERY_REPORT_PARAM,
  personName,
  type DeliveryReportRow,
} from "@/utils/deliveryReports";

type StatusFilter = "open" | "closed";
const PAGE_SIZE = 50;

const quickButton = (active: boolean) =>
  clsx(
    "rounded-full text-sm font-semibold px-4 py-1.5 border",
    active
      ? "bg-primary text-white border-primary"
      : "bg-white text-primary border-primary hover:bg-primary/10"
  );

const searchText = (row: DeliveryReportRow) =>
  normalizeString(
    [
      row.id,
      row.item_title,
      personName(row.reporter),
      personName(row.reported),
      row.comment,
      ...row.comments.map((c) => c.comment),
    ].join(" ")
  );

// Admins: every delivery report of the edition ("Entregas" tab of
// admin/reports): filter open/closed, search, open the thread, comment, close.
const DeliveryReportsTab = ({ tabs }: { tabs: ReactNode }) => {
  const [status, setStatus] = useState<StatusFilter>("open");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reloadValue, setReloadValue] = useState(0);
  const reload = useCallback(() => setReloadValue((v) => v + 1), []);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [closingId, setClosingId] = useState<number | null>(null);

  const params = useMemo(() => ({ status, page, page_size: PAGE_SIZE }), [status, page]);
  const [listLoaded, setListLoaded] = useState(false);
  const onListLoaded = useCallback(() => setListLoaded(true), []);
  const [, data, loading, error] = useFetch({
    endpoint: "GET_DELIVERY_REPORTS",
    initialState: { results: [], count: 0 },
    params,
    autoLoad: true,
    reloadValue,
    afterLoad: onListLoaded,
  }) as [any, { results?: DeliveryReportRow[]; count?: number } | null, boolean, any];

  const rows: DeliveryReportRow[] = useMemo(() => data?.results || [], [data]);
  const count = data?.count ?? rows.length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const list = useMemo(() => {
    const needle = normalizeString(search.trim());
    return needle ? rows.filter((row) => searchText(row).includes(needle)) : rows;
  }, [rows, search]);

  const [postClose, , closing, errorClose] = useFetch({
    endpoint: "POST_DELIVERY_REPORT_CLOSE",
    method: "POST",
    afterLoad: reload,
  }) as [any, any, boolean, any];

  /* DEEP LINK: ?delivery_report=<id> ********************************/
  const [focusId, setFocusId] = useState<number | null>(null);
  const [pinned, setPinned] = useState<DeliveryReportRow | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [getOne] = useFetch({
    endpoint: "GET_DELIVERY_REPORT",
    afterLoad: (row: DeliveryReportRow) => setPinned(row),
    afterError: () => setNotFound(true),
  }) as [any, any, boolean, any];

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(DELIVERY_REPORT_PARAM);
    if (raw && /^\d+$/.test(raw.trim())) setFocusId(Number(raw.trim()));
  }, []);

  useEffect(() => {
    if (!focusId || !listLoaded || loading) return;
    if (rows.some((row) => row.id === focusId)) {
      setExpanded(focusId);
      setPinned(null);
    } else if (!pinned && !notFound) {
      getOne({ urlParams: [focusId] });
    }
  }, [focusId, listLoaded, loading, rows, pinned, notFound, getOne]);
  /* end DEEP LINK ***************************************************/

  const renderRow = (row: DeliveryReportRow, forceOpen = false) => {
    const isOpen = forceOpen || expanded === row.id;
    return (
      <article
        key={row.id}
        className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
        data-testid={`delivery-report-${row.id}`}
      >
        <button
          type="button"
          className="w-full min-w-0 text-left flex flex-wrap items-baseline justify-between gap-x-3"
          aria-expanded={isOpen}
          onClick={() => setExpanded(isOpen && !forceOpen ? null : row.id)}
        >
          <span className="min-w-0">
            <strong className="break-words">#{row.id} {row.item_title}</strong>
            <span className="block text-xs text-gray-600 break-words">
              <I18N
                id="deliveryReport.parties"
                values={[personName(row.reporter), personName(row.reported)]}
              />
            </span>
          </span>
          <span className="text-xs text-gray-500">
            {formatReportDate(row.created)} · <I18N id="deliveryReport.commentsCount" values={[row.comments.length]} />
          </span>
        </button>
        {isOpen ? (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <DeliveryReportThread
              report={row}
              onChanged={reload}
              onClose={() => {
                setClosingId(row.id);
                postClose({ urlParams: [row.id] });
              }}
              closing={closing && closingId === row.id}
              closeError={closingId === row.id ? errorClose : null}
            />
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <>
      <PageHeader title="adminReports.title" variant="minimal" />
      <SectionCommon loading={loading}>
        <div className="md:px-7 px-3 py-7">
          <div className="mb-4">
            <Button tag="link" href={PRIVATE_ROUTES.ADMIN_PANEL.path} sm outline>
              <I18N id="adminReports.back" />
            </Button>
          </div>
          {tabs}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(["open", "closed"] as StatusFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                className={quickButton(status === key)}
                onClick={() => {
                  setStatus(key);
                  setPage(1);
                  setExpanded(null);
                }}
              >
                <I18N id={key === "open" ? "deliveryReport.status.open" : "deliveryReport.status.closed"} />
              </button>
            ))}
          </div>
          <input
            type="search"
            className="border border-stroke rounded-md p-2 text-sm w-full sm:w-80 mb-4"
            placeholder={getI18Ntext("deliveryReport.admin.search")}
            aria-label={getI18Ntext("deliveryReport.admin.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ErrorAlert error={error} />
          {notFound ? (
            <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              <I18N id="deliveryReport.admin.notFound" values={[focusId ?? ""]} />
            </div>
          ) : null}
          {pinned ? <div className="mb-6">{renderRow(pinned, true)}</div> : null}
          {!loading && !list.length ? (
            <EmptyList visible icon="status-box" message="deliveryReport.admin.none" />
          ) : (
            <div className="flex flex-col gap-4">{list.map((row) => renderRow(row))}</div>
          )}
          {pages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-sm">
              <Button type="button" sm outline disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <I18N id="deliveryReport.admin.prev" />
              </Button>
              <span>{page} / {pages}</span>
              <Button type="button" sm outline disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                <I18N id="deliveryReport.admin.next" />
              </Button>
            </div>
          ) : null}
        </div>
      </SectionCommon>
    </>
  );
};

export default DeliveryReportsTab;
