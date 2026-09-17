"use client";
import { lazy } from "react";
import clsx from "clsx";
import { ResultsContextProvider } from "@/context/results";
import Dynamic from "@/components/dynamic";
import useMT from "./useMT";
import { LoadingBox } from "@/components/loading";
import ErrorAlert from "@/components/errorAlert";
import EmptyList from "@/components/emptyList";
import I18N from "@/i18n";

const ResultsVisual = lazy(() => import("@/components/results/visual"));
const ResultsTable = lazy(() => import("@/components/results/table"));

const ViewPill = ({
  active = false,
  onClick,
  labelId,
}: {
  active?: boolean;
  onClick: () => void;
  labelId: string;
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "h-8 px-3 rounded-full border text-caption font-bold transition-colors",
        active
          ? "bg-primary/10 border-primary/40 text-primary"
          : "bg-white border-gray-200 text-gray-500 hover:text-gray-800"
      )}
      onClick={onClick}
    >
      <I18N id={labelId} />
    </button>
  );
};

const MtResultUI = ({ mt }: { mt: { id: number } }) => {
  const {
    screenViewResults,
    setScreenViewResults,
    loading,
    error,
    MathTradeResults,
  } = useMT(mt.id);

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-1.5 py-3 border-b border-gray-200">
        <ViewPill
          active={screenViewResults === 0}
          onClick={() => setScreenViewResults(0)}
          labelId="results.screen.visual"
        />
        <ViewPill
          active={screenViewResults === 1}
          onClick={() => setScreenViewResults(1)}
          labelId="results.screen.grid"
        />
      </div>
      {screenViewResults === 0 ? (
        <Dynamic>
          <ResultsVisual forced />
        </Dynamic>
      ) : (
        <Dynamic>
          <ResultsTable />
        </Dynamic>
      )}
      {MathTradeResults?.length === 0 && !loading && !error ? (
        <EmptyList
          visible
          icon="status-box"
          message="results.historial.notResults"
        />
      ) : null}
      <ErrorAlert error={error} className="mt-4" />
      <LoadingBox loading={loading} transparent />
    </div>
  );
};

const MtResult = ({ mt }: { mt: { id: number } }) => {
  return (
    <ResultsContextProvider>
      <MtResultUI mt={mt} />
    </ResultsContextProvider>
  );
};

export default MtResult;
