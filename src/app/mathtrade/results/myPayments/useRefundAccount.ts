import useFetch from "@/hooks/useFetch";
import { refundPayload, type RefundForm } from "./refundFormErrors";

// Saves the participant's refund account (holder + alias and/or CBU).
// The body is never logged here: alias/CBU are personal bank data.
const useRefundAccount = (onSaved: () => void) => {
  const [save, , saving, error] = useFetch({
    endpoint: "PUT_MY_REFUND_ACCOUNT",
    method: "PUT",
    afterLoad: onSaved,
  });
  return {
    save: (form: RefundForm) => save({ params: refundPayload(form) }),
    saving: !!saving,
    error: error as any,
  };
};

export default useRefundAccount;
