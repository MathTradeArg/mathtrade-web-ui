"use client";
import clsx from "clsx";
import I18N from "@/i18n";
import { useStore } from "@/store";
import { formatAmount } from "@/utils/money";
import { ReceiptUpload, ViewReceipt, STATUS_STYLE } from "@/components/receiptUpload";
import type { PaymentReceipt } from "./types";

// Transfer receipt of "Mis pagos": upload, state, rejection reason and
// resubmit. There is no deadline once the payments are published.
const ReceiptSection = ({
  receipt,
  onChanged,
  readOnly = false,
}: {
  receipt: PaymentReceipt;
  onChanged: () => void;
  // Admin preview: nothing can be uploaded.
  readOnly?: boolean;
}) => {
  const mathtradeId = useStore((state) => state.data?.mathtrade?.id);
  const { status, id, amount, rejection_reason, can_upload } = receipt;

  return (
    <section className={clsx("border rounded-lg p-4", STATUS_STYLE[status])}>
      <h2 className="text-lg font-semibold mb-2">
        <I18N id="payments.receipt.title" />
      </h2>
      <p className="font-bold mb-2">
        <I18N id={`payments.receipt.status.${status}`} />
      </p>
      {status === "rejected" && rejection_reason ? (
        <p className="mb-3">
          {/* Plain text on purpose: I18N renders HTML, and the reason is
              free text typed by an admin. */}
          <I18N id="payments.receipt.rejectionReason" /> {rejection_reason}
        </p>
      ) : null}
      {status === "missing" || status === "rejected" ? (
        <p className="text-sm text-gray-600 mb-3">
          <I18N id="payments.receipt.noDeadline" />
        </p>
      ) : null}
      {id && amount && status !== "missing" ? (
        <p className="text-sm mb-2">
          <I18N id="payments.receipt.amount" values={[formatAmount(amount)]} />
        </p>
      ) : null}
      {can_upload && !readOnly ? (
        <ReceiptUpload endpoint="POST_PAYMENT_RECEIPT" onUploaded={onChanged} />
      ) : null}
      {id && (status === "pending" || status === "approved") ? (
        <ViewReceipt
          endpoint="GET_PAYMENT_RECEIPT_FILE"
          urlParams={[mathtradeId, id]}
          label="payments.receipt.viewReceipt"
        />
      ) : null}
    </section>
  );
};

export default ReceiptSection;
