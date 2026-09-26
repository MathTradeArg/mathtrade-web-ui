import { useEffect, useMemo, useState } from "react";
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

// Set when an admin looks at someone else's results (?member=<user_id>).
export type ProvisionalMember = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  self_excluded_at: string | null;
};

export type ProvisionalResultsPayload = {
  self_excluded?: boolean;
  can_self_exclude?: boolean;
  member?: ProvisionalMember | null;
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
    initialState: emptyPayload,
  });

  // ?member=<user_id>: an admin looking at a member's results, from the
  // self-excluded list. Read after mount (no useSearchParams, which would
  // need a Suspense boundary); the backend ignores it for non-admins.
  const [member, setMember] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    setMember(new URLSearchParams(window.location.search).get("member"));
  }, []);
  useEffect(() => {
    if (member === undefined) return;
    getData(member ? { params: { member } } : {});
  }, [member, getData]);

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
    viewingMember: payload.member || null,
  };
};

export default useProvisionalResults;
