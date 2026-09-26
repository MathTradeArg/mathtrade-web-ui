"use client";
import EmptyList from "@/components/emptyList";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import useProvisionalResults from "./useProvisionalResults";
import ProvisionalSummary from "./summary";
import ProvisionalExclude from "./exclude";

const ProvisionalResultsUI = () => {
  const { loading, error, runsCount, summary } = useProvisionalResults();

  if (loading && !runsCount) {
    return (
      <div className="relative min-h-48">
        <LoadingBox loading />
      </div>
    );
  }

  return (
    <div className="relative">
      <ErrorAlert error={error} />
      {!runsCount ? (
        <EmptyList visible icon="status-box" message="provisional.none" />
      ) : (
        <>
          <ProvisionalSummary rows={summary} />
          <LoadingBox loading={loading} transparent />
        </>
      )}
      <ProvisionalExclude />
    </div>
  );
};

export default ProvisionalResultsUI;
