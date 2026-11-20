// Client-side hints for the refund form. Same rules as the BE
// (my-refund-account/): the BE is the authority, this only saves a round trip.
// Values are i18n ids, never raw text, and nothing here logs the input.

export type RefundForm = { holder_name: string; alias: string; cbu: string };
export type RefundFormErrors = Partial<Record<keyof RefundForm, string>>;

const ALIAS = /^[A-Za-z0-9._-]{6,20}$/;
const CBU = /^\d{22}$/;

/** CBU as the BE reads it: spaces are dropped, hyphens are not accepted. */
export const normalizeCbu = (cbu: string): string => cbu.replace(/\s+/g, "");

export const validateRefundForm = (form: RefundForm): RefundFormErrors => {
  const errors: RefundFormErrors = {};
  const holder = form.holder_name.trim();
  const alias = form.alias.trim();
  const cbu = normalizeCbu(form.cbu);

  if (holder.length < 3 || holder.length > 100) {
    errors.holder_name = "payments.refund.error.holder";
  }
  if (!alias && !cbu) {
    errors.alias = "payments.refund.error.aliasOrCbu";
    errors.cbu = "payments.refund.error.aliasOrCbu";
    return errors;
  }
  if (alias && !ALIAS.test(alias)) errors.alias = "payments.refund.error.alias";
  if (cbu && !CBU.test(cbu)) errors.cbu = "payments.refund.error.cbu";
  return errors;
};

export const hasRefundErrors = (errors: RefundFormErrors): boolean =>
  Object.keys(errors).length > 0;

/** Body of the PUT: trimmed, CBU without spaces. */
export const refundPayload = (form: RefundForm): RefundForm => ({
  holder_name: form.holder_name.trim(),
  alias: form.alias.trim(),
  cbu: normalizeCbu(form.cbu),
});
