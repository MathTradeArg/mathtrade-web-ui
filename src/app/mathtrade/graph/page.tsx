"use client";
import GraphViewer from "@/components/interactiveGraph/graphViewer";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import { useRedirectIfNavLocked } from "@/components/sidebar/useSidebarNav";

export default function InteractiveGraphPage() {
  const locked = useRedirectIfNavLocked("RESULTS");

  if (locked) {
    return null;
  }

  return (
    <>
      <PageHeader
        variant="compact"
        title="title.interactiveGraph"
        helpId="page.graph"
      />
      <SectionCommon>
        <div className="min-h-96 relative p-5">
          <GraphViewer />
        </div>
      </SectionCommon>
    </>
  );
}
