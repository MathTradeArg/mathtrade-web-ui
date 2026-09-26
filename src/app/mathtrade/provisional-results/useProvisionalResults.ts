import { useMemo } from "react";
import useFetch from "@/hooks/useFetch";

export type ProvisionalItem = {
  id: number;
  title?: string;
  elements?: any[];
  membership?: any;
};

// One row per item the member offers: what they'd receive in each of the
// runs they took part in (numbered 1..n; the runs can't be told apart).
export type ProvisionalSummaryRow = {
  item: ProvisionalItem;
  outcomes: { run: number; received: ProvisionalItem | null }[];
};

export type ProvisionalResultsPayload = {
  self_excluded?: boolean;
  can_self_exclude?: boolean;
  runs_count: number;
  summary: ProvisionalSummaryRow[];
};

const emptyPayload: ProvisionalResultsPayload = {
  runs_count: 0,
  summary: [],
};

const useProvisionalResults = () => {
  const [getData, data, loading, error] = useFetch({
    endpoint: "GET_PROVISIONAL_RESULTS",
    autoLoad: true,
    initialState: emptyPayload,
  });

  const payload = useMemo(() => {
    if (!data || typeof data.runs_count !== "number") {
      return emptyPayload;
    }
    return data as ProvisionalResultsPayload;
  }, [data]);

  return {
    reload: getData,
    loading,
    error,
    runsCount: payload.runs_count,
    summary: payload.summary,
  };
};

export default useProvisionalResults;
