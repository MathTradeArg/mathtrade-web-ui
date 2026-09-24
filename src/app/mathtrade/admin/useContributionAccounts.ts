"use client";
import { useCallback, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";

export type ContributionAccount = {
  id: number;
  holder_name: string;
  alias: string;
  cbu: string;
  bank: string;
  active: boolean;
};

const ACCOUNT_FIELDS = ["holder_name", "alias", "cbu", "bank"] as const;

const useContributionAccounts = (mathtradeId: number) => {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  // Stable reference: useFetch depends on urlParams, and a fresh array on
  // every render makes its autoLoad effect refetch in a loop.
  const urlParams = useMemo(() => [mathtradeId], [mathtradeId]);

  const [loadAccounts, accounts, loading, errorList] = useFetch({
    endpoint: "GET_CONTRIBUTION_ACCOUNTS",
    urlParams,
    initialState: [],
    autoLoad: true,
  });

  const afterSave = useCallback(() => {
    setEditingId(null);
    loadAccounts();
  }, [loadAccounts]);

  const [createAccount, , creating, errorCreate] = useFetch({
    endpoint: "POST_CONTRIBUTION_ACCOUNT",
    method: "POST",
    urlParams,
    afterLoad: afterSave,
  });

  const [updateAccount, , updating, errorUpdate] = useFetch({
    endpoint: "PUT_CONTRIBUTION_ACCOUNT",
    method: "PUT",
    urlParams,
    afterLoad: afterSave,
  });

  const [deleteAccount, , deleting, errorDelete] = useFetch({
    endpoint: "DELETE_CONTRIBUTION_ACCOUNT",
    method: "DELETE",
    urlParams,
    afterLoad: afterSave,
  });

  const submitAccount = useCallback(
    (formProps: Record<string, any>) => {
      const params: Record<string, any> = {};
      ACCOUNT_FIELDS.forEach((field) => {
        params[field] = (formProps[field] || "").trim();
      });
      if (editingId === "new") {
        createAccount({ params });
      } else if (editingId !== null) {
        const current = (accounts || []).find(
          (a: ContributionAccount) => a.id === editingId
        );
        updateAccount({
          urlParams: [editingId],
          params: { ...params, active: current?.active ?? true },
        });
      }
    },
    [editingId, accounts, createAccount, updateAccount]
  );

  const toggleActive = useCallback(
    (account: ContributionAccount) => {
      updateAccount({
        urlParams: [account.id],
        params: { ...account, active: !account.active },
      });
    },
    [updateAccount]
  );

  const removeAccount = useCallback(
    (account: ContributionAccount) => {
      deleteAccount({ urlParams: [account.id] });
    },
    [deleteAccount]
  );

  return {
    accounts: (accounts || []) as ContributionAccount[],
    editingId,
    setEditingId,
    submitAccount,
    toggleActive,
    removeAccount,
    busy: loading || creating || updating || deleting,
    error: errorList || errorCreate || errorUpdate || errorDelete,
  };
};

export default useContributionAccounts;
