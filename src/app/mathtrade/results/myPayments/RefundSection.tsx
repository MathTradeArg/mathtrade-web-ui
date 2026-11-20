"use client";
import { useState } from "react";
import Button from "@/components/button";
import CopyValue from "@/components/copyValue";
import ConfirmModal from "@/components/confirmModal";
import ErrorAlert from "@/components/errorAlert";
import Modal from "@/components/modal";
import I18N, { getI18Ntext } from "@/i18n";
import { DateIntlFormat } from "@/utils/dateUtils";
import { absAmount, formatAmount } from "@/utils/money";
import {
  hasRefundErrors,
  validateRefundForm,
  type RefundForm,
  type RefundFormErrors,
} from "./refundFormErrors";
import useRefundAccount from "./useRefundAccount";
import useRefundDonation from "./useRefundDonation";
import { donationErrorText, donationWordMatches } from "./donation";
import type { RefundState } from "./types";

const FIELDS = ["holder_name", "alias", "cbu"] as const;

const inputClass = "border border-line rounded-md p-2 text-sm bg-white w-full min-w-0";

// BE field errors come as Spanish text, a string or a one-item list.
const serverFieldErrors = (error: any): RefundFormErrors => {
  const data = error?.data;
  const out: RefundFormErrors = {};
  if (!data || typeof data !== "object" || Array.isArray(data)) return out;
  for (const field of FIELDS) {
    const value = Array.isArray(data[field]) ? data[field][0] : data[field];
    if (typeof value === "string" && value.trim()) out[field] = value;
  }
  return out;
};

// A client error is an i18n id; a BE error is already text.
const fieldMessage = (message?: string) =>
  !message ? "" : message.startsWith("payments.") ? getI18Ntext(message) : message;

// "Te devolvemos $X": the participant loads where to receive it.
const RefundSection = ({
  refund,
  amount,
  onChanged,
  readOnly = false,
}: {
  refund: RefundState;
  // Positive amount owed to the participant.
  amount: string;
  onChanged: () => void;
  // Admin preview: shows the state, never the form.
  readOnly?: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<RefundForm>({
    holder_name: refund.holder_name || "",
    alias: refund.alias || "",
    cbu: refund.cbu || "",
  });
  const [clientErrors, setClientErrors] = useState<RefundFormErrors>({});

  const { save, saving, error } = useRefundAccount(() => {
    setEditing(false);
    setSaved(true);
    onChanged();
  });

  // Donation flow: 0 closed, 1 explanation, 2 amount + typed word.
  const [donateStep, setDonateStep] = useState<0 | 1 | 2>(0);
  const [typed, setTyped] = useState("");
  const [attempted, setAttempted] = useState(false);
  const { donate, saving: donating, error: donateError } = useRefundDonation(() => {
    setDonateStep(0);
    onChanged();
  });
  const closeDonation = () => {
    if (donating) return;
    setDonateStep(0);
    setTyped("");
    setAttempted(false);
  };
  const donationAmount = formatAmount(absAmount(refund.amount || amount));
  const onDonate = () => {
    if (donating || !donationWordMatches(typed)) return;
    setAttempted(true);
    donate();
  };

  const { status, can_edit } = refund;
  const serverErrors = serverFieldErrors(error);
  const errors = hasRefundErrors(clientErrors) ? clientErrors : serverErrors;
  const looseError = error && !hasRefundErrors(serverErrors) ? error : null;
  const hasData = !!(refund.holder_name || refund.alias || refund.cbu);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateRefundForm(form);
    setClientErrors(found);
    if (hasRefundErrors(found)) return;
    setSaved(false);
    save(form);
  };

  const startEditing = () => {
    setForm({
      holder_name: refund.holder_name || "",
      alias: refund.alias || "",
      cbu: refund.cbu || "",
    });
    setClientErrors({});
    setSaved(false);
    setEditing(true);
  };

  const data = hasData ? (
    <div className="bg-white border border-stroke rounded-md px-3 py-2 mb-3">
      <CopyValue label="payments.refund.holder" value={refund.holder_name} />
      <CopyValue label="payments.refund.alias" value={refund.alias} />
      <CopyValue label="payments.refund.cbu" value={refund.cbu} />
    </div>
  ) : null;

  if (status === "donated") {
    return (
      <section className="border border-green-300 bg-green-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">
          <I18N id="payments.refund.title" />
        </h2>
        <p className="font-bold mb-2">
          <I18N
            id={readOnly ? "payments.refund.donate.doneReadOnly" : "payments.refund.donate.done"}
            values={[donationAmount]}
          />
        </p>
        {!readOnly ? (
          <p className="text-sm text-gray-600">
            <I18N id="payments.refund.donate.doneHelp" />
          </p>
        ) : null}
      </section>
    );
  }

  if (status === "refunded") {
    return (
      <section className="border border-green-300 bg-green-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">
          <I18N id="payments.refund.title" />
        </h2>
        <p className="font-bold mb-2">
          <I18N
            id="payments.refund.status.refunded"
            values={[
              formatAmount(refund.amount || amount),
              DateIntlFormat(refund.refunded_at),
            ]}
          />
        </p>
        {data}
      </section>
    );
  }

  const showForm = !readOnly && can_edit && (status === "missing" || editing);

  return (
    <section className="border border-stroke bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">
        <I18N id="payments.refund.title" />
      </h2>

      {status === "submitted" && !editing ? (
        <>
          <p className="font-bold mb-2">
            <I18N id="payments.refund.status.submitted" />
          </p>
          {saved ? (
            <p className="text-sm text-green-700 mb-2">
              <I18N id="payments.refund.saved" />
            </p>
          ) : null}
          {data}
          {!can_edit && !readOnly ? (
            <p className="text-sm text-gray-600">
              <I18N id="payments.refund.locked" />
            </p>
          ) : null}
        </>
      ) : null}

      {status === "missing" && !showForm ? (
        <p className="text-sm text-gray-600">
          <I18N id={readOnly ? "payments.refund.status.missingReadOnly" : "payments.refund.locked"} />
        </p>
      ) : null}

      {showForm ? (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 min-w-0">
          <p className="text-sm text-gray-600">
            <I18N id="payments.refund.help" />
          </p>
          {FIELDS.map((field) => (
            <label key={field} className="text-sm flex flex-col gap-1 min-w-0">
              <span className="text-gray-600">
                <I18N id={`payments.refund.field.${field}`} />
              </span>
              <input
                type="text"
                name={field}
                className={inputClass}
                value={form[field]}
                inputMode={field === "cbu" ? "numeric" : "text"}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                maxLength={field === "holder_name" ? 100 : field === "alias" ? 20 : 30}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              />
              {errors[field] ? (
                <span className="text-danger text-xs break-words">
                  {fieldMessage(errors[field])}
                </span>
              ) : null}
            </label>
          ))}
          <ErrorAlert error={looseError} />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={saving}>
              <I18N id="payments.refund.save" />
            </Button>
            {editing ? (
              <Button
                type="button"
                color="cancel"
                outline
                onClick={() => {
                  setEditing(false);
                  setClientErrors({});
                }}
              >
                <I18N id="btn.Cancel" />
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}

      {status === "submitted" && !editing && can_edit && !readOnly ? (
        <Button type="button" sm outline onClick={startEditing}>
          <I18N id="payments.refund.edit" />
        </Button>
      ) : null}

      {refund.can_donate && !readOnly ? (
        <>
          <label className="flex items-start gap-2 text-sm mt-4 pt-3 border-t border-stroke cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 shrink-0"
              checked={donateStep !== 0}
              onChange={(e) => {
                if (e.target.checked) setDonateStep(1);
                else closeDonation();
              }}
            />
            <span>
              <I18N id="payments.refund.donate.checkbox" />
            </span>
          </label>
          <ConfirmModal
            isOpen={donateStep === 1}
            onCancel={closeDonation}
            onConfirm={() => setDonateStep(2)}
            title="payments.refund.donate.step1.title"
            description="payments.refund.donate.step1.text"
            descriptionValues={[donationAmount]}
            confirmId="payments.refund.donate.step1.confirm"
          />
          <Modal size="sm" isOpen={donateStep === 2} onClose={closeDonation} canNotClose={donating}>
            <form
              className="text-center flex flex-col gap-3 min-w-0"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                onDonate();
              }}
            >
              <h3 className="text-card-title text-ink">
                <I18N id="payments.refund.donate.step2.title" />
              </h3>
              <p className="text-sm text-gray-700 text-balance">
                <I18N id="payments.refund.donate.step2.text" />
              </p>
              <p className="text-4xl font-bold text-ink break-words">{donationAmount}</p>
              <label className="text-sm flex flex-col gap-1 text-left min-w-0">
                <span className="text-gray-600">
                  <I18N id="payments.refund.donate.step2.label" />
                </span>
                <input
                  type="text"
                  name="confirmation"
                  className={inputClass}
                  value={typed}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  disabled={donating}
                  onChange={(e) => setTyped(e.target.value)}
                />
              </label>
              {attempted && donateError ? (
                <p role="alert" className="text-danger text-sm break-words">
                  {donationErrorText(donateError) ?? getI18Ntext("payments.refund.donate.error")}
                </p>
              ) : null}
              <div className="flex items-center justify-center gap-3 pt-1">
                <Button type="button" color="cancel" outline disabled={donating} onClick={closeDonation}>
                  <I18N id="btn.Cancel" />
                </Button>
                <Button
                  type="submit"
                  color="danger"
                  className="px-6"
                  disabled={donating || !donationWordMatches(typed)}
                >
                  <I18N id="payments.refund.donate.step2.confirm" />
                </Button>
              </div>
            </form>
          </Modal>
        </>
      ) : null}
    </section>
  );
};

export default RefundSection;
