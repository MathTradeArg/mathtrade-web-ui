import { useContext, useCallback, useState, useEffect, useMemo } from "react";
import { ResultsContext } from "@/context/results";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";

const defaultScreenViewResults = 0;

const useMT = (mtId) => {
  /* SCREEN OPTIONS **********************************************/
  const [screenViewResults, setScreenViewResults] = useState(
    defaultScreenViewResults
  );
  /* end SCREEN OPTIONS **********************************************/

  /* RESULTS CONTEXT *****************************************/
  const {
    currentUserId,
    setMathTradeResults,
    MathTradeResults,
    setCustomMathtradeId,
  } = useContext(ResultsContext);

  useEffect(() => {
    setCustomMathtradeId(mtId);
  }, [setCustomMathtradeId, mtId]);

  /* end RESULTS CONTEXT *****************************************/

  /* GET USERS *************************************************/
  const afterLoad = useCallback(
    (newMTresults) => {
      setMathTradeResults(newMTresults);
    },
    [setMathTradeResults]
  );
  const [getMathTradeResults, , loading, error] = useFetch({
    endpoint: "GET_MT_RESULTS_HISTORIAL",
    //autoLoad: true,
    initialState: [],
    afterLoad,
  });

  useEffect(() => {
    getMathTradeResults({
      params: { user: currentUserId },
      urlParams: [mtId],
    });
  }, [getMathTradeResults, setMathTradeResults, currentUserId, mtId]);
  // end GET USERS ********************************************

  return {
    screenViewResults,
    setScreenViewResults,
    MathTradeResults,
    loading,
    error,
  };
};

export default useMT;
