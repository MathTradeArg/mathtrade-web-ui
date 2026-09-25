"use client";
import { useCallback, useContext, useState } from "react";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/store";
import { formatLocations } from "@/utils";

export const DATE_FIELDS = [
  "start_date",
  "freeze_geek_date",
  "freeze_wants_date",
  "provisional_results_date",
  "show_results_date",
  "meeting_date",
];

// datetime-local inputs work in the browser's local time; the backend
// stores/returns UTC ISO strings, so both directions need a conversion.
export const toLocalInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// Accepts Argentine formatting ("5.000", "5.000,50") as well as "5000.50".
// A lone dot followed by exactly 3 digits is a thousands separator.
export const parseAmount = (value?: string | number | null) => {
  let text = `${value ?? ""}`.replace(/[\s$]/g, "");
  if (text === "") return null;
  if (text.includes(",")) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
    text = text.replace(/\./g, "");
  }
  return text;
};

const toISO = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

const useAdminPanel = () => {
  const locations = useStore((state) => state.locations);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loadMathtrades, mathtrades, loadingList, errorList] = useFetch({
    endpoint: "GET_MATHTRADES",
    initialState: [],
    autoLoad: true,
  });

  const { updateMathtrade } = useContext(PageContext);

  const afterSave = useCallback(
    (saved: any) => {
      setEditingId(null);
      loadMathtrades();
      // If the admin edited the edition their own session is on, apply it to
      // the session copy too; otherwise settings like rules_quiz_required or
      // contribution_amount only show up after a re-login.
      const { data, updateStore } = useStore.getState();
      if (saved?.id && data?.mathtrade?.id === saved.id) {
        const mathtrade = { ...data.mathtrade, ...saved };
        updateStore("data", { ...data, mathtrade });
        updateMathtrade(mathtrade);
      }
    },
    [loadMathtrades, updateMathtrade]
  );

  const [saveMathtrade, , savingMathtrade, errorSave] = useFetch({
    endpoint: "PATCH_MATHTRADE_ADMIN",
    method: "PUT",
    afterLoad: afterSave,
  });

  // Fields left blank are simply omitted — all of them are optional on the
  // backend, and an omitted field on a full update just keeps its current
  // value instead of erroring on an empty-string date.
  const submitEdit = useCallback(
    (id: number, formProps: Record<string, any>) => {
      const params: Record<string, any> = {
        name: formProps.name,
        active: formProps.active,
        admin_only: formProps.admin_only,
        rules_quiz_required: formProps.rules_quiz_required,
      };
      if (formProps.location) params.location = formProps.location;
      // Blank clears it: no contribution required for this edition.
      params.contribution_amount = parseAmount(formProps.contribution_amount);
      DATE_FIELDS.forEach((field) => {
        const iso = toISO(formProps[field]);
        if (iso) params[field] = iso;
      });
      saveMathtrade({ urlParams: [id], params });
    },
    [saveMathtrade]
  );

  const [uploadRulebook, , uploadingRulebook, errorRulebook] = useFetch({
    endpoint: "POST_MATHTRADE_RULEBOOK",
    method: "POST",
    afterLoad: afterSave,
  });

  const submitRulebook = useCallback(
    (id: number, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      uploadRulebook({ urlParams: [id], params: formData });
    },
    [uploadRulebook]
  );

  return {
    mathtrades: mathtrades || [],
    loadingList,
    errorList,
    locationOptions: formatLocations(locations),
    editingId,
    setEditingId,
    submitEdit,
    savingMathtrade,
    errorSave,
    submitRulebook,
    uploadingRulebook,
    errorRulebook,
  };
};

export default useAdminPanel;
