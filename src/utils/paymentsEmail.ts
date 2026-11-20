// Pure helpers of the "payments published" email in the admin Pagos panel
// and the due date notice of "Mis pagos". Kept free of React for node --test.

export type PublishEmailNotice =
  | { kind: "first"; recipients: number }
  | { kind: "already" }
  | { kind: "none" };

/** What the publish confirmation says about the email: the FIRST publish sends
 *  one to `recipients` participants; once `emailed_at` is set none is sent. */
export const publishEmailNotice = (
  summary: { emailed_at?: string | null; email_recipients?: number } | null | undefined,
): PublishEmailNotice => {
  if (!summary) return { kind: "none" };
  if (summary.emailed_at) return { kind: "already" };
  const recipients = Number(summary.email_recipients);
  if (!Number.isFinite(recipients)) return { kind: "none" };
  return { kind: "first", recipients };
};

/** "2026-11-25" -> "25/11/2026" (es-AR, no time, no timezone shift). Anything
 *  else comes back empty. */
export const formatDueDate = (value: unknown): string => {
  const match = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
};
