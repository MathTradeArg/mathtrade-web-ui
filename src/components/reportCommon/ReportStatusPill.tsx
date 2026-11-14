import type { ReactNode } from "react";
import I18N from "@/i18n";

// Open (amber) / closed (green) pill of a report.
const ReportStatusPill = ({ open, children }: { open: boolean; children?: ReactNode }) => (
  <span
    className={
      open
        ? "rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-bold"
        : "rounded-full bg-green-100 text-green-900 px-2 py-0.5 text-xs font-bold"
    }
  >
    {children ?? <I18N id={open ? "deliveryReport.status.open" : "deliveryReport.status.closed"} />}
  </span>
);

export default ReportStatusPill;
