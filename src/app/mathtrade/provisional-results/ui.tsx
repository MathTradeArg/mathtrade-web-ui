"use client";
import EmptyList from "@/components/emptyList";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import useProvisionalResults from "./useProvisionalResults";
import ProvisionalSummary from "./summary";
import ProvisionalRuns from "./runs";
import ProvisionalExclude from "./exclude";

const ProvisionalResultsUI = () => {
  const { loading, error, runs, summary } = useProvisionalResults();

  if (loading && !runs.length) {
    return (
      <div className="relative min-h-48">
        <LoadingBox loading />
      </div>
    );
  }

  return (
    <div className="relative">
      <ErrorAlert error={error} />
      {!runs.length ? (
        <EmptyList visible icon="status-box" message="provisional.none" />
      ) : (
        <>
          <ProvisionalSummary rows={summary} />
          <ProvisionalRuns runs={runs} />
          <LoadingBox loading={loading} transparent />
        </>
      )}
      <ProvisionalExclude />
    </div>
  );
};

export default ProvisionalResultsUI;
