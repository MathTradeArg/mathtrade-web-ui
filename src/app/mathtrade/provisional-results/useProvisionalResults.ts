import { useMemo } from "react";
import useFetch from "@/hooks/useFetch";

export type ProvisionalItem = {
  id: number;
  title?: string;
  elements?: any[];
  membership?: any;
};

export type ProvisionalTrade = {
  id: number;
  item_from?: ProvisionalItem | null;
  item_to?: ProvisionalItem | null;
  membership_from?: any;
  membership_to?: any;
};

export type ProvisionalRun = {
  id: number;
  label: string;
  published_at?: string | null;
  results: ProvisionalTrade[];
};

export type ProvisionalSummaryRow = {
  item: ProvisionalItem;
  outcomes: { run_id: number; received: ProvisionalItem | null }[];
};

export type ProvisionalResultsPayload = {
  self_excluded?: boolean;
  can_self_exclude?: boolean;
  runs: ProvisionalRun[];
  summary: ProvisionalSummaryRow[];
};

const emptyPayload: ProvisionalResultsPayload = {
  runs: [],
  summary: [],
};

const useProvisionalResults = () => {
  const [getData, data, loading, error] = useFetch({
    endpoint: "GET_PROVISIONAL_RESULTS",
    autoLoad: true,
    initialState: emptyPayload,
  });

  const payload = useMemo(() => {
    if (!data || !Array.isArray(data.runs)) {
      return emptyPayload;
    }
    return data as ProvisionalResultsPayload;
  }, [data]);

  return {
    reload: getData,
    loading,
    error,
    runs: payload.runs,
    summary: payload.summary,
  };
};

export default useProvisionalResults;
