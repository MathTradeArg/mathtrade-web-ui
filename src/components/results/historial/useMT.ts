import { useContext, useCallback, useState, useEffect } from "react";
import { ResultsContext } from "@/context/results";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";

const defaultScreenViewResults = 0;

const useMT = (mtId: number) => {
  const [screenViewResults, setScreenViewResults] = useState(
    defaultScreenViewResults
  );

  const { userId } = useContext(PageContext);
  const {
    currentUserId,
    setCurrentUserId,
    setUserList,
    setMathTradeResults,
    MathTradeResults,
    setCustomMathtradeId,
  } = useContext(ResultsContext);

  useEffect(() => {
    setCustomMathtradeId(mtId);
    setCurrentUserId(userId);
  }, [setCustomMathtradeId, mtId, setCurrentUserId, userId]);

  const afterLoadUsers = useCallback(
    (newUserList) => {
      setUserList(newUserList || []);
    },
    [setUserList]
  );
  const [getUsers, , loadingUsers] = useFetch({
    endpoint: "GET_MATHTRADE_USERS",
    initialState: [],
    afterLoad: afterLoadUsers,
  });

  useEffect(() => {
    getUsers({ mathtradeId: mtId });
  }, [getUsers, mtId]);

  const afterLoad = useCallback(
    ({ results }) => {
      setMathTradeResults(results);
    },
    [setMathTradeResults]
  );
  const [getMathTradeResults, , loading, error] = useFetch({
    endpoint: "GET_MT_RESULTS_HISTORIAL",
    initialState: [],
    afterLoad,
  });

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    getMathTradeResults({
      params: { user: currentUserId, page_size: 200 },
      urlParams: [mtId],
    });
  }, [getMathTradeResults, currentUserId, mtId]);

  return {
    screenViewResults,
    setScreenViewResults,
    MathTradeResults,
    loading: loading || loadingUsers,
    error,
  };
};

export default useMT;
