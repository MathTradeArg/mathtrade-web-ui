"use client";
import clsx from "clsx";
import I18N from "@/i18n";
import EmptyList from "@/components/emptyList";
import ReportStatusPill from "@/components/reportCommon/ReportStatusPill";
import { formatReportDate } from "@/utils/reportDate";
import type { MyReportItem, MyReportStatus } from "@/utils/myReports";

const MyReportsList = ({
  rows,
  role,
  status,
  loading,
  onSelect,
}: {
  rows: MyReportItem[];
  role: "made" | "received";
  status: MyReportStatus;
  loading: boolean;
  onSelect: (row: MyReportItem) => void;
}) => (
  <div className="min-w-0">
    <EmptyList visible={!loading && rows.length === 0} message={`myReports.empty.${role}`} />
    <ul className="flex flex-col gap-2 min-w-0">
      {rows.map((row) => (
        <li key={`${row.kind}-${row.id}`} className="min-w-0">
          <button
            type="button"
            onClick={() => onSelect(row)}
            className={clsx(
              "w-full min-w-0 text-left bg-white border border-gray-200 rounded-lg px-3 py-2.5",
              "flex flex-col gap-1 hover:border-primary transition-colors"
            )}
          >
            <span className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="rounded-full bg-sky-100 text-sky-900 px-2 py-0.5 text-xs font-bold">
                <I18N id={`myReports.kind.${row.kind}`} />
              </span>
              <ReportStatusPill open={status === "open"} />
              <span className="text-xs text-gray-600">{formatReportDate(row.created)}</span>
            </span>
            <span className="min-w-0 break-words font-bold">{row.title}</span>
            <span className="text-xs text-gray-600">
              <I18N id="deliveryReport.commentsCount" values={[row.commentsCount]} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default MyReportsList;
