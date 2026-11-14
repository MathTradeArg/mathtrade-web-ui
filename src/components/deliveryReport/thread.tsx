"use client";
import Button from "@/components/button";
import I18N from "@/i18n";
import ErrorAlert from "@/components/errorAlert";
import { ReplyBox } from "@/components/item/item-my/item-ui/reportThread";
import { personName, type DeliveryReportRow } from "@/utils/deliveryReports";
import { formatReportDate } from "@/utils/reportDate";
import ReportPhotos from "@/components/reportCommon/ReportPhotos";
import ReportCommentCard from "@/components/reportCommon/ReportCommentCard";
import ReportStatusPill from "@/components/reportCommon/ReportStatusPill";

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
      <strong className="min-w-0 break-words">{report.item_title}</strong>
      <ReportStatusPill open={report.status === "open"} />
    </div>
    <p className="text-xs text-gray-600 mb-2 break-words">
      <I18N
        id="deliveryReport.parties"
        values={[personName(report.reporter), personName(report.reported)]}
      />
    </p>
    <ReportCommentCard
      name={personName(report.reporter)}
      date={formatReportDate(report.created)}
      text={report.comment}
      className="bg-gray-50"
    >
      <ReportPhotos urls={report.images} />
    </ReportCommentCard>
    {report.comments.length ? (
      <ul className="flex flex-col gap-2 mt-3">
        {report.comments.map((c) => (
          <li key={c.id}>
            <ReportCommentCard
              name={personName(c.user)}
              date={formatReportDate(c.created)}
              text={c.comment}
              tone="gray"
            />
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
