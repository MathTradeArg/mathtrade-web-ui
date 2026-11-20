export type AccountCall = "list" | "create" | "update" | "delete";

/** Each useFetch keeps its own error until ITS next call, so a stale error of
 *  an earlier call (e.g. a refused deactivation) would hide the message of the
 *  latest one (e.g. a refused delete). Only the error of the last call counts;
 *  its body (the BE `detail` / message) is shown by ErrorAlert. */
export const pickLastError = <T>(
  last: AccountCall,
  errors: Record<AccountCall, T | null | undefined>
): T | null => errors[last] ?? null;
