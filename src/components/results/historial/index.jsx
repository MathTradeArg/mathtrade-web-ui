//import useResults from "./useResults";

import { lazy, useContext, useState } from "react";
import MtResult from "./mt";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";
import Selector from "./selector";
import Tabs from "@/components/tabs";
import Dynamic from "@/components/dynamic";

const GraphViewer = lazy(() =>
  import("@/components/interactiveGraph/graphViewer")
);

// Chain graphs only exist as static per-year JSON (public/data/graph_results_*.json),
// not tied to a specific mathtrade id, so this tab shows every available year
// rather than trying to derive one from the Selector's current pick — MAT-130.
const GRAPH_YEARS = ["2025", "2024", "2023"];

const ResultsHistorial = () => {
  const { mathtrade_history } = useContext(PageContext);

  const [mtSelectedId, setMtSelectedId] = useState(
    mathtrade_history[0]?.id || -1
  );
  const [screenView, setScreenView] = useState(0);

  return (
    <div className="md:px-8 px-3 py-8">
      {mathtrade_history.length === 0 ? (
        <p className="text-center text-balance text-2xl py-3">
          <I18N id="results.historial.notFound" />
        </p>
      ) : (
        <div>
          <Tabs
            list={["results.tab.results", "results.tab.chains"]}
            value={screenView}
            onChange={setScreenView}
          />
          {screenView === 0 ? (
            <div className="mt-4">
              <Selector
                list={mathtrade_history}
                selected={mtSelectedId}
                onChange={setMtSelectedId}
              />
              {mathtrade_history.map((mt) => {
                if (mt.id !== mtSelectedId) {
                  return null;
                }
                return <MtResult mt={mt} key={mt.id} />;
              })}
            </div>
          ) : (
            <div className="min-h-96 relative mt-4">
              <Dynamic>
                <GraphViewer years={GRAPH_YEARS} />
              </Dynamic>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsHistorial;
