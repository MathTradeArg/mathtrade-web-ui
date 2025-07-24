import { lazy } from "react";
import { ResultsContextProvider } from "@/context/results";
import Tabs from "@/components/tabs";
import Dynamic from "@/components/dynamic";
import useMT from "./useMT";
import { LoadingBox } from "@/components/loading";
import ErrorAlert from "@/components/errorAlert";
import I18N from "@/i18n";

const ResultsVisual = lazy(() => import("@/components/results/visual"));
const ResultsTable = lazy(() => import("@/components/results/table"));

const MtResultUI = ({ mt }) => {
  const {
    screenViewResults,
    setScreenViewResults,
    loading,
    error,
    MathTradeResults,
  } = useMT(mt.id);

  //LOGICA
  return (
    <div className="relative">
      <div className="border-b border-gray-400/50">
        <Tabs
          list={["results.screen.visual", "results.screen.grid"]}
          highlighted={2}
          value={screenViewResults}
          onChange={setScreenViewResults}
          min
          className="relative top-[2px]"
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
        <p className="text-center text-balance text-2xl py-4">
          <I18N id="results.historial.notResults" />
        </p>
      ) : null}
      <ErrorAlert error={error} className="mt-4" />
      <LoadingBox loading={loading} transparent />
    </div>
  );
};

const MtResult = ({ mt }) => {
  return (
    <ResultsContextProvider>
      <MtResultUI mt={mt} />
    </ResultsContextProvider>
  );
};

export default MtResult;
