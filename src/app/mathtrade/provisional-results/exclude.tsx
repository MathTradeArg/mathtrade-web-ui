"use client";
import { useCallback, useContext, useState } from "react";
import { PageContext } from "@/context/page";
import { useStore } from "@/store";
import useFetch from "@/hooks/useFetch";
import I18N from "@/i18n";
import Button from "@/components/button";
import Modal from "@/components/modal";
import ErrorAlert from "@/components/errorAlert";
import { PUBLIC_ROUTES } from "@/config/routes";
import Link from "next/link";

const ProvisionalExclude = () => {
  const { canI } = useContext(PageContext);
  const updateStore = useStore((state) => state.updateStore);
  const [open, setOpen] = useState(false);

  const afterLoad = useCallback(() => {
    const current = useStore.getState().data;
    updateStore("data", {
      ...current,
      membership: {
        ...current.membership,
        self_excluded: true,
      },
    });
    setOpen(false);
  }, [updateStore]);

  const [selfExclude, , loading, error] = useFetch({
    endpoint: "POST_SELF_EXCLUDE",
    method: "POST",
    afterLoad,
  });

  if (!canI.selfExclude) {
    return null;
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <ErrorAlert error={error} />
      <Button
        type="button"
        color="danger"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <I18N id="provisional.exclude.cta" />
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="sm"
        className="py-8 px-6 w-full"
      >
        <h2 className="text-lg font-bold mb-3">
          <I18N id="provisional.exclude.modal.title" />
        </h2>
        <p className="text-sm text-gray-700 mb-6">
          <I18N id="provisional.exclude.modal.body" />
          <Link
            href={PUBLIC_ROUTES.TERMS_CONDITIONS.path}
            className="underline hover:opacity-75"
          >
            <I18N id="provisional.exclude.reglamento" />
          </Link>
          .
        </p>
        <Button
          type="button"
          color="danger"
          disabled={loading}
          onClick={() => selfExclude({ params: {} })}
        >
          <I18N id="provisional.exclude.modal.btn" />
        </Button>
      </Modal>
    </div>
  );
};

export default ProvisionalExclude;
