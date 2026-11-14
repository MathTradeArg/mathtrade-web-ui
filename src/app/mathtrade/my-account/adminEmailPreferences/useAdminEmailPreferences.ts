import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
  fromApi,
  toApi,
  togglePref,
  type AdminEmailKind,
  type AdminEmailPreferences,
  type AdminEmailPreferencesApi,
} from "@/utils/adminEmailPreferences";

// The GET answers 200 only for admins. A 403 leaves `data` null and the error
// is deliberately not exposed (and no afterError is passed): a non-admin must
// see nothing, not an alert.
const useAdminEmailPreferences = () => {
  const [, data, loading] = useFetch({
    endpoint: "GET_ADMIN_EMAIL_PREFERENCES",
    autoLoad: true,
  }) as [any, AdminEmailPreferencesApi | null, boolean, any];

  const [prefs, setPrefs] = useState<AdminEmailPreferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setPrefs(fromApi(data));
  }, [data]);

  const afterLoad = useCallback((resp: AdminEmailPreferencesApi) => {
    setPrefs(fromApi(resp));
    setSaved(true);
  }, []);

  const [savePrefs, , saving, errorSave] = useFetch({
    endpoint: "PUT_ADMIN_EMAIL_PREFERENCES",
    method: "PUT",
    afterLoad,
  }) as [any, any, boolean, any];

  const toggle = useCallback((kind: AdminEmailKind) => {
    setPrefs((p) => (p ? togglePref(p, kind) : p));
    setSaved(false);
  }, []);

  const save = useCallback(() => {
    if (prefs) savePrefs({ params: toApi(prefs) });
  }, [prefs, savePrefs]);

  return {
    prefs,
    isAdmin: prefs !== null,
    loading,
    saving,
    saved,
    errorSave,
    toggle,
    save,
  };
};

export default useAdminEmailPreferences;
