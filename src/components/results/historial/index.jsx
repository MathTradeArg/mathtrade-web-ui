//import useResults from "./useResults";

import { useContext, useState } from "react";
import MtResult from "./mt";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";
import Selector from "./selector";

const ResultsHistorial = () => {
  const { mathtrade_history } = useContext(PageContext);

  const [mtSelectedId, setMtSelectedId] = useState(
    mathtrade_history[0]?.id || -1
  );

  return (
    <div className="md:px-8 px-3 py-8">
      {mathtrade_history.length === 0 ? (
        <p className="text-center text-balance text-2xl py-3">
          <I18N id="results.historial.notFound" />
        </p>
      ) : (
        <div>
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
      )}
    </div>
  );
};

export default ResultsHistorial;
