"use client";
import Button from "@/components/button";
import I18N from "@/i18n";
import ErrorAlert from "@/components/errorAlert";
import { ReplyBox } from "@/components/item/item-my/item-ui/reportThread";
import { personName, type DeliveryReportRow } from "@/utils/deliveryReports";

// Photos of a delivery report: thumbnails that open the full photo.
export const ReportPhotos = ({ images }: { images: string[] }) =>
  images.length ? (
    <div className="flex flex-wrap gap-2 mt-2">
      {images.map((url) => (
        <a key={url} href={url} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="w-20 h-20 object-cover rounded border border-gray-200 hover:opacity-80"
          />
        </a>
      ))}
    </div>
  ) : null;

// One delivery report: who reported whom, the first message with its photos,
// the thread, a reply box while it is open, and "Cerrar reporte" for the
// reporter and admins (the server says which in can_comment / can_close).
const DeliveryReportThread = ({
  report,
  onChanged,
  onClose,
  closing = false,
  closeError = null,
}: {
  report: DeliveryReportRow;
  onChanged: () => void;
  onClose: () => void;
  closing?: boolean;
  closeError?: any;
}) => (
  <div className="text-sm">
    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
      <strong>{report.item_title}</strong>
      <span
        className={
          report.status === "open"
            ? "rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-bold"
            : "rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-bold"
        }
      >
        <I18N id={report.status === "open" ? "deliveryReport.status.open" : "deliveryReport.status.closed"} />
      </span>
    </div>
    <p className="text-xs text-gray-600 mb-2">
      <I18N
        id="deliveryReport.parties"
        values={[personName(report.reporter), personName(report.reported)]}
      />
    </p>
    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="flex flex-wrap justify-between gap-x-2 text-xs">
        <strong>{personName(report.reporter)}</strong>
        <span className="opacity-75">{report.created}</span>
      </div>
      <p className="mt-0.5 whitespace-pre-line break-words">{report.comment}</p>
      <ReportPhotos images={report.images} />
    </div>
    {report.comments.length ? (
      <ul className="flex flex-col gap-2 mt-3">
        {report.comments.map((c) => (
          <li key={c.id} className="rounded-md border border-gray-200 bg-white px-3 py-2">
            <div className="flex flex-wrap justify-between gap-x-2 text-xs">
              <strong>{personName(c.user)}</strong>
              <span className="opacity-75">{c.created}</span>
            </div>
            <p className="mt-0.5 whitespace-pre-line break-words">{c.comment}</p>
          </li>
        ))}
      </ul>
    ) : null}
    {report.can_comment ? (
      <ReplyBox
        reportId={report.id}
        onSent={onChanged}
        endpoint="POST_DELIVERY_REPORT_COMMENT"
      />
    ) : (
      <p className="mt-3 text-xs text-gray-500">
        <I18N id="deliveryReport.closedNote" />
      </p>
    )}
    {report.can_close ? (
      <div className="mt-3 flex flex-col items-end gap-2">
        <ErrorAlert error={closeError} errorMessage="deliveryReport.error.close" />
        <Button type="button" sm outline disabled={closing} onClick={onClose}>
          <I18N id="deliveryReport.close" />
        </Button>
      </div>
    ) : null}
  </div>
);

export default DeliveryReportThread;
