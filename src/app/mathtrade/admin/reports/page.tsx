"use client";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import ErrorAlert from "@/components/errorAlert";
import EmptyList from "@/components/emptyList";
import ConfirmModal from "@/components/confirmModal";
import I18N from "@/i18n";
import useFetch from "@/hooks/useFetch";
import { PRIVATE_ROUTES } from "@/config/routes";

type Person = { id: number; first_name: string; last_name: string } | null;

type ReportRow = {
  id: number;
  user: Person;
  reported_user: Person;
  item_title: string | null;
  assigned_trade_code: string | number | null;
  box_number: number | null;
  box_origin_name: string | null;
  box_destination_name: string | null;
  found_in_box_number: number | null;
  comment: string;
  created: string;
  resolved_at: string | null;
};

const FILTERS = [
  { key: "open", label: "adminReports.filter.open", resolved: "0" },
  { key: "resolved", label: "adminReports.filter.resolved", resolved: "1" },
  { key: "all", label: "adminReports.filter.all", resolved: undefined },
];

const fullName = (person: Person) =>
  person ? `${person.first_name} ${person.last_name}`.trim() : "-";

// Admins only (route "onlyForAdmin"): the edition's item, user and box
// reports, the same ones volunteers see in the logistics app.
const AdminReportsPage = () => {
  const [filter, setFilter] = useState("open");
  const [reloadValue, setReloadValue] = useState(0);
  const reload = useCallback(() => setReloadValue((v) => v + 1), []);

  const params = useMemo(() => {
    const resolved = FILTERS.find((f) => f.key === filter)?.resolved;
    return { event: "1", ...(resolved ? { resolved } : {}) };
  }, [filter]);

  const [, rows, loading, error] = useFetch({
    endpoint: "ADMIN_GET_REPORTS",
    initialState: [],
    params,
    autoLoad: true,
    reloadValue,
  });
  const list: ReportRow[] = Array.isArray(rows) ? rows : rows?.results || [];

  const [resolveReport, , resolving, errorResolve] = useFetch({
    endpoint: "ADMIN_RESOLVE_REPORT",
    method: "POST",
    afterLoad: reload,
  });
  const [deleteReport, , deleting, errorDelete] = useFetch({
    endpoint: "ADMIN_DELETE_REPORT",
    method: "DELETE",
    afterLoad: reload,
  });
  const [toDelete, setToDelete] = useState<number | null>(null);

  return (
    <>
      <PageHeader title="adminReports.title" variant="minimal" />
      <SectionCommon loading={loading || resolving || deleting}>
        <div className="md:px-7 px-3 py-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link href={PRIVATE_ROUTES.ADMIN_PANEL.path} className="text-primary underline">
              <I18N id="adminReports.back" />
            </Link>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={
                    filter === f.key
                      ? "rounded-full bg-primary text-white text-xs font-semibold px-3 py-1.5"
                      : "rounded-full bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 hover:bg-gray-200"
                  }
                >
                  <I18N id={f.label} />
                </button>
              ))}
            </div>
          </div>
          <ErrorAlert error={error || errorResolve || errorDelete} />
          {!loading && !list.length ? (
            <EmptyList visible icon="status-box" message="adminReports.none" />
          ) : null}
          {list.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4"><I18N id="adminReports.col.date" /></th>
                    <th className="py-2 pr-4"><I18N id="adminReports.col.by" /></th>
                    <th className="py-2 pr-4"><I18N id="adminReports.col.what" /></th>
                    <th className="py-2 pr-4"><I18N id="adminReports.col.comment" /></th>
                    <th className="py-2 pr-4"><I18N id="adminReports.col.state" /></th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 align-top">
                      <td className="py-2 pr-4 whitespace-nowrap">{row.created}</td>
                      <td className="py-2 pr-4">{fullName(row.user)}</td>
                      <td className="py-2 pr-4 min-w-[12rem]">
                        {row.item_title ? (
                          <div>
                            <span className="text-gray-500"><I18N id="adminReports.item" />: </span>
                            {row.assigned_trade_code ? `${row.assigned_trade_code} - ` : ""}
                            {row.item_title}
                          </div>
                        ) : null}
                        {row.reported_user ? (
                          <div>
                            <span className="text-gray-500"><I18N id="adminReports.user" />: </span>
                            {fullName(row.reported_user)}
                          </div>
                        ) : null}
                        {row.box_number ? (
                          <div className="text-xs text-gray-600">
                            <I18N
                              id="adminReports.box"
                              values={[row.box_number, row.box_origin_name || "-", row.box_destination_name || "-"]}
                            />
                          </div>
                        ) : null}
                        {row.found_in_box_number ? (
                          <div className="text-xs text-green-700">
                            <I18N id="adminReports.foundIn" values={[row.found_in_box_number]} />
                          </div>
                        ) : null}
                      </td>
                      <td className="py-2 pr-4 min-w-[14rem] max-w-md text-gray-700 whitespace-pre-line">
                        {row.comment || "-"}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {row.resolved_at ? (
                          <span className="text-green-700">
                            <I18N id="adminReports.resolvedAt" values={[row.resolved_at]} />
                          </span>
                        ) : (
                          <span className="text-danger font-semibold">
                            <I18N id="adminReports.open" />
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right whitespace-nowrap">
                        {!row.resolved_at ? (
                          <button
                            type="button"
                            onClick={() => resolveReport({ urlParams: [row.id] })}
                            className="rounded-full bg-primary text-white text-xs font-semibold px-3 py-1.5 hover:opacity-90 mr-2"
                          >
                            <I18N id="adminReports.resolve" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setToDelete(row.id)}
                          className="text-xs text-red-600 underline"
                        >
                          <I18N id="adminReports.delete" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <ConfirmModal
            isOpen={toDelete !== null}
            onCancel={() => setToDelete(null)}
            onConfirm={() => {
              const id = toDelete;
              setToDelete(null);
              if (id !== null) deleteReport({ urlParams: [id] });
            }}
            title="adminReports.deleteTitle"
            description="adminReports.deleteText"
          />
        </div>
      </SectionCommon>
    </>
  );
};

export default AdminReportsPage;
