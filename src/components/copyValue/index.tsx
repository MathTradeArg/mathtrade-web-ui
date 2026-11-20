"use client";
import { useEffect, useState } from "react";
import copy from "copy-text-to-clipboard";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";

// A labeled value with a copy-to-clipboard button (bank data, aliases...).
const CopyValue = ({ label, value }: { label: string; value?: string | null }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div>
        <span className="text-gray-500 text-sm">
          <I18N id={label} />:
        </span>{" "}
        <span className="font-medium break-all">{value}</span>
      </div>
      <button
        type="button"
        className="text-sky-600 hover:text-sky-800 text-sm whitespace-nowrap"
        title={getI18Ntext("copy")}
        onClick={() => {
          if (copy(value)) setCopied(true);
        }}
      >
        {copied ? <I18N id="contribution.copied" /> : <Icon type="copy" />}
      </button>
    </div>
  );
};

export default CopyValue;
