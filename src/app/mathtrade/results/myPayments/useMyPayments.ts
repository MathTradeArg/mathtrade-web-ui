import useFetch from "@/hooks/useFetch";
import type { MyPayments } from "./types";

// The mathtradeId is filled in by useFetch from the store.
const useMyPayments = (): {
  data: MyPayments | null;
  loading: boolean;
  reload: () => void;
} => {
  const [reload, data, loading] = useFetch({
    endpoint: "GET_MY_PAYMENTS",
    initialState: null,
    autoLoad: true,
  });
  return { data: data as MyPayments | null, loading: !!loading, reload: () => reload() };
};

export default useMyPayments;
