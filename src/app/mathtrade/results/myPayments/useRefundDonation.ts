import { useCallback, useRef } from "react";
import useFetch from "@/hooks/useFetch";
import { donationPayload } from "./donation";

// Sends the donation. The body is only the confirmation word; the BE deletes
// the bank data it had. A ref blocks a second submit before `saving` renders.
const useRefundDonation = (onDonated: () => void) => {
  const sending = useRef(false);
  const [send, , saving, error] = useFetch({
    endpoint: "POST_MY_REFUND_DONATION",
    method: "POST",
    afterLoad: () => {
      sending.current = false;
      onDonated();
    },
  });
  const donate = useCallback(async () => {
    if (sending.current) return;
    sending.current = true;
    try {
      await send({ params: donationPayload() });
    } finally {
      sending.current = false;
    }
  }, [send]);
  return { donate, saving: !!saving, error: error as any };
};

export default useRefundDonation;
