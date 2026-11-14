export const ADMIN_EMAIL_KINDS = [
  "item_observation",
  "delivery_created",
  "delivery_comment",
  "delivery_closed",
  "bug_report",
] as const;

export type AdminEmailKind = (typeof ADMIN_EMAIL_KINDS)[number];
export type AdminEmailPreferences = Record<AdminEmailKind, boolean>;
export type AdminEmailPreferencesApi = Record<`admin_email_${AdminEmailKind}`, boolean>;

export const fromApi = (
  data: Partial<AdminEmailPreferencesApi> | null | undefined
): AdminEmailPreferences =>
  Object.fromEntries(
    ADMIN_EMAIL_KINDS.map((kind) => [kind, data?.[`admin_email_${kind}`] === true])
  ) as AdminEmailPreferences;

export const toApi = (prefs: AdminEmailPreferences): AdminEmailPreferencesApi =>
  Object.fromEntries(
    ADMIN_EMAIL_KINDS.map((kind) => [`admin_email_${kind}`, prefs[kind] === true])
  ) as AdminEmailPreferencesApi;

export const togglePref = (
  prefs: AdminEmailPreferences,
  kind: AdminEmailKind
): AdminEmailPreferences => ({ ...prefs, [kind]: !prefs[kind] });
