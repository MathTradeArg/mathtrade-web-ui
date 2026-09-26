"use client";
import { lazy } from "react";
import { ResultsContextProvider } from "@/context/results";
import Dynamic from "@/components/dynamic";
import useMT from "./useMT";
import { LoadingBox } from "@/components/loading";
import ErrorAlert from "@/components/errorAlert";
import EmptyList from "@/components/emptyList";
import I18N from "@/i18n";
import UserSelector from "@/components/results/userSelector";
import ListToolbar from "@/components/list-toolbar";
import { SegmentButton, SegmentedGroup } from "@/components/segmented";

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
}) => (
  <SegmentButton active={active} onClick={onClick} small>
    <I18N id={labelId} />
  </SegmentButton>
);

const MtResultUI = ({ mt }: { mt: { id: number } }) => {
  const {
    screenViewResults,
    setScreenViewResults,
    loading,
    error,
    MathTradeResults,
  } = useMT(mt.id);

  const tradeCount = MathTradeResults?.length || 0;

  return (
    <div className="relative">
      <ListToolbar
        align="end"
        leading={<UserSelector compact />}
        count={
          tradeCount ? (
            <>
              {tradeCount}{" "}
              <I18N
                id={tradeCount === 1 ? "result.trade" : "result.trades"}
              />
            </>
          ) : null
        }
        trailing={
          <SegmentedGroup>
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
          </SegmentedGroup>
        }
      />
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
