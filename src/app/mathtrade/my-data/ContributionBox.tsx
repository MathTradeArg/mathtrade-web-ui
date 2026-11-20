"use client";
import clsx from "clsx";
import I18N from "@/i18n";
import CopyValue from "@/components/copyValue";
import { formatAmount } from "@/utils/money";
import { contributionDeadline } from "@/utils/contributionDeadline";
import { ReceiptUpload, ViewReceipt, STATUS_STYLE } from "@/components/receiptUpload";

const AccountCard = ({ amount, account }) =>
  account ? (
    <>
      <p className="mb-2">
        <I18N id="contribution.transferTo" values={[formatAmount(amount)]} />
      </p>
      <div className="bg-white border border-stroke rounded-md px-3 py-2 mb-4">
        <CopyValue label="contribution.account.holder" value={account.holder_name} />
        <CopyValue label="contribution.account.alias" value={account.alias} />
        <CopyValue label="contribution.account.cbu" value={account.cbu} />
        <CopyValue label="contribution.account.bank" value={account.bank} />
      </div>
    </>
  ) : (
    <p className="text-sm">
      <I18N id="contribution.noAccount" />
    </p>
  );

const ContributionBox = ({
  isMembership,
  contribution,
  contributionAmount,
  mathtradeId,
  onChanged,
}) => {
  if (!isMembership) {
    if (!contributionAmount) return null;
    return (
      <div
        className="border border-stroke rounded-lg p-4 mb-6 bg-gray-50"
        data-tour="signup.contribution"
      >
        <p className="mb-2">
          <I18N
            id="contribution.signupAmount"
            values={[formatAmount(contributionAmount)]}
          />
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <I18N id="contribution.explanation" />
        </p>
        <p className="text-sm text-gray-600">
          <I18N id="contribution.afterSignup" />
        </p>
      </div>
    );
  }

  if (!contribution) return null;
  const { amount, account, status, rejection_reason, id, can_upload, upload_until, resubmit_allowed } =
    contribution;
  const deadline = contributionDeadline(upload_until);
  const needsReceipt = status === "missing" || status === "rejected";
  // Can't send one now: the deadline passed, or the rejection was final.
  const closed = needsReceipt && can_upload === false;

  return (
    <div className={clsx("border rounded-lg p-4 mb-6", STATUS_STYLE[status])}>
      <p className="font-bold mb-2">
        <I18N id={`contribution.status.${status}`} />
      </p>
      {status === "rejected" && rejection_reason ? (
        <p className="mb-3">
          {/* Plain text on purpose: I18N renders HTML, and the reason is
              free text typed by an admin. */}
          <I18N id="contribution.rejectionReason" /> {rejection_reason}
        </p>
      ) : null}
      {closed ? (
        <p className="font-semibold mb-3">
          <I18N
            id={
              status === "rejected" && resubmit_allowed === false
                ? "contribution.finalRejection"
                : "contribution.closed"
            }
          />
        </p>
      ) : null}
      {needsReceipt && !closed ? (
        <>
          {deadline ? (
            <p className="font-semibold mb-3">
              <I18N id="contribution.deadline" values={[deadline]} />
            </p>
          ) : null}
          <p className="text-sm text-gray-600 mb-3">
            <I18N id="contribution.explanation" />
          </p>
          <AccountCard amount={amount} account={account} />
          {account ? <ReceiptUpload endpoint="POST_CONTRIBUTION" onUploaded={onChanged} /> : null}
        </>
      ) : null}
      {id && !needsReceipt ? (
        <ViewReceipt
          endpoint="GET_CONTRIBUTION_RECEIPT"
          urlParams={[mathtradeId, id]}
        />
      ) : null}
    </div>
  );
};

export default ContributionBox;
