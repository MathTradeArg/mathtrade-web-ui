"use client";
import I18N, { getI18Ntext } from "@/i18n";
import ErrorAlert from "@/components/errorAlert";
import { FIELD_LABELS } from "./fieldLabels";

// A DRF 400 comes as {error: true, data: {field: ["message"]}}: list each
// message with its field's label, so it's clear which date to fix. Anything
// else falls back to the generic alert.
const FieldErrors = ({ error }: { error: any }) => {
  const data = error?.data;
  const entries =
    data && typeof data === "object" && !Array.isArray(data)
      ? Object.entries(data).filter(([, msgs]) => msgs)
      : [];
  if (!entries.length) return <ErrorAlert error={error} />;

  return (
    <div className="bg-danger text-white text-sm p-3 mb-3 rounded-md">
      <p className="font-semibold mb-1">
        <I18N id="adminPanel.errors.title" />
      </p>
      <ul className="list-disc pl-5">
        {entries.map(([field, msgs]) => (
          <li key={field}>
            <strong>
              {FIELD_LABELS[field] ? getI18Ntext(FIELD_LABELS[field]) : field}:
            </strong>{" "}
            {Array.isArray(msgs) ? msgs.join(" ") : `${msgs}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldErrors;
