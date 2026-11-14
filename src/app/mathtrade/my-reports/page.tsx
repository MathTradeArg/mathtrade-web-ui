"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/pageHeader";
import Wrapper from "@/components/wrapper";
import Tabs from "@/components/tabs";
import SectionCommon from "@/components/sections/common";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import I18N from "@/i18n";
import { PageContext } from "@/context/page";
import { SegmentButton, SegmentedGroup } from "@/components/segmented";
import { useRedirectIfNavLocked } from "@/components/sidebar/useSidebarNav";
import DeliveryReportModal, {
  type DeliveryReportTarget,
} from "@/components/deliveryReport/DeliveryReportModal";
import { openReport } from "@/components/reportModal/reportModalStore";
import { DELIVERY_REPORT_PARAM } from "@/utils/deliveryReports";
import { mergeMyReports, type MyReportItem, type MyReportStatus } from "@/utils/myReports";
import useMyReports from "./useMyReports";
import MyReportsList from "./ui";

const TABS = ["myReports.tab.made", "myReports.tab.received"];

export default function MyReports() {
  const { setPageType } = useContext(PageContext) as any;
  const locked = useRedirectIfNavLocked("MY_REPORTS");
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState<MyReportStatus>("open");
  const [target, setTarget] = useState<DeliveryReportTarget | null>(null);

  const role = tab === 0 ? "made" : "received";
  const { rows, loading, error, reload } = useMyReports(role);
  const visible = useMemo(() => mergeMyReports(rows, status), [rows, status]);

  useEffect(() => {
    setPageType("myReports");
  }, [setPageType]);

  // Permalink from the email: ?delivery_report=<id> (read once, full page
  // load). ?report=<id> is opened by the layout's report modal.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(DELIVERY_REPORT_PARAM);
    if (raw && /^\d+$/.test(raw.trim())) {
      setTarget({ title: "", reportId: Number(raw.trim()) });
    }
  }, []);

  const onSelect = (row: MyReportItem) => {
    if (row.kind === "item") openReport(row.id);
    else setTarget({ title: row.title, reportId: row.id });
  };

  if (locked) {
    return null;
  }

  return (
    <>
      <PageHeader
        variant="compact"
        title="title.MyReports"
        help={
          <span className="text-sm text-white/90">
            <I18N id="myReports.help" />
          </span>
        }
      />
      <Wrapper className="mb-1">
        <div className="bg-white rounded-t-main shadow-main">
          <Tabs list={TABS} value={tab} onChange={setTab} />
        </div>
      </Wrapper>
      <SectionCommon topNotRounded>
        <div className="min-w-0 relative">
          <div className="mb-3">
            <SegmentedGroup>
              {(["open", "closed"] as MyReportStatus[]).map((s) => (
                <SegmentButton key={s} active={status === s} small onClick={() => setStatus(s)}>
                  <I18N id={`deliveryReport.status.${s}`} />
                </SegmentButton>
              ))}
            </SegmentedGroup>
          </div>
          <ErrorAlert error={error} errorMessage="myReports.error.load" />
          <MyReportsList
            rows={visible}
            role={role}
            status={status}
            loading={loading}
            onSelect={onSelect}
          />
          <LoadingBox loading={loading} transparent />
        </div>
      </SectionCommon>
      <DeliveryReportModal target={target} onClose={() => setTarget(null)} onChanged={reload} />
    </>
  );
}
