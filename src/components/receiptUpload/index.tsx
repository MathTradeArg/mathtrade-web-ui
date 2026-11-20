"use client";
import { useCallback, useRef, useState } from "react";
import I18N from "@/i18n";
import Button from "@/components/button";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import useFetch from "@/hooks/useFetch";
import { openAuthenticatedFile } from "@/hooks/useFetch/utils";
import { RECEIPT_ACCEPT, receiptClientError } from "@/utils/receiptFile";

// Card colors of a receipt state (sign-up contribution and Mis pagos).
export const STATUS_STYLE: Record<string, string> = {
  missing: "border-warning bg-yellow-50",
  rejected: "border-danger bg-red-50",
  pending: "border-sky-400 bg-sky-50",
  approved: "border-green-500 bg-green-50",
};

// File input + send button of a transfer receipt. `endpoint` is the POST
// endpoint (the mathtradeId is filled in from the store by useFetch).
export const ReceiptUpload = ({
  endpoint,
  onUploaded,
}: {
  endpoint: string;
  onUploaded: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const afterLoad = useCallback(() => {
    setFile(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
    onUploaded();
  }, [onUploaded]);

  const [sendReceipt, , sending, error] = useFetch({
    endpoint,
    method: "POST",
    afterLoad,
  });

  return (
    <div className="relative">
      <p className="text-sm font-bold mb-1">
        <I18N id="contribution.upload.label" />
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={RECEIPT_ACCEPT}
        className="text-sm mb-2 block"
        onChange={(e) => {
          const next = e.target.files?.[0] || null;
          setFile(next);
          setLocalError(next ? receiptClientError(next) : null);
        }}
      />
      <p className="text-xs text-gray-500 mb-3">
        <I18N id="contribution.upload.help" />
      </p>
      <Button
        sm
        type="button"
        disabled={!file || sending || Boolean(localError)}
        onClick={() => {
          const clientError = receiptClientError(file);
          if (clientError) {
            setLocalError(clientError);
            return;
          }
          const formData = new FormData();
          formData.append("file", file as File);
          sendReceipt({ params: formData });
        }}
      >
        <I18N id="contribution.upload.btn" />
      </Button>
      <ErrorAlert error={localError || error} />
      <LoadingBox loading={sending} transparent min />
    </div>
  );
};

// Opens the receipt file through the authenticated endpoint.
export const ViewReceipt = ({
  endpoint,
  urlParams,
  label = "contribution.viewReceipt",
}: {
  endpoint: string;
  urlParams: (string | number | null | undefined)[];
  label?: string;
}) => (
  <button
    type="button"
    className="text-primary underline text-sm"
    onClick={() => openAuthenticatedFile({ endpoint, urlParams })}
  >
    <I18N id={label} />
  </button>
);
