"use client";
import I18N from "@/i18n";
import ErrorAlert from "@/components/errorAlert";
import SuccessAlert from "@/components/successAlert";
import Button from "@/components/button";
import Checkbox from "@/components/form/inputTypes/checkbox";
import { ADMIN_EMAIL_KINDS } from "@/utils/adminEmailPreferences";
import useAdminEmailPreferences from "./useAdminEmailPreferences";

export default function AdminEmailPreferences() {
  const { prefs, isAdmin, saving, saved, errorSave, toggle, save } =
    useAdminEmailPreferences();

  if (!isAdmin || !prefs) return null;

  return (
    <section>
      <h2 className="text-center pb-2 mb-7 font-bold block w-full border-b border-gray-300">
        <I18N id="myAccount.adminEmails.title" />
      </h2>
      <p className="text-sm text-gray-700 mb-4">
        <I18N id="myAccount.adminEmails.help" />
      </p>
      <div className="grid gap-3 mb-4">
        {ADMIN_EMAIL_KINDS.map((kind) => (
          <Checkbox
            key={kind}
            data={prefs}
            name={kind}
            required={false}
            ariaLabel={`myAccount.adminEmails.${kind}`}
            disabled={saving}
            onChange={() => toggle(kind)}
          >
            <I18N id={`myAccount.adminEmails.${kind}`} />
          </Checkbox>
        ))}
      </div>
      <ErrorAlert error={errorSave} />
      {saved && <SuccessAlert text="myAccount.adminEmails.saved" />}
      <div className="text-center py-3">
        <Button type="button" ariaLabel="btn.Save" disabled={saving} onClick={save}>
          <I18N id="btn.Save" />
        </Button>
      </div>
    </section>
  );
}
