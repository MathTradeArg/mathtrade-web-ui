"use client";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import ErrorAlert from "@/components/errorAlert";
import useAdminPanel from "./useAdminPanel";
import EditionRow from "./EditionRow";
import Link from "next/link";
import I18N from "@/i18n";
import { PRIVATE_ROUTES } from "@/config/routes";

const AdminPanelPage = () => {
  const {
    mathtrades,
    loadingList,
    errorList,
    locationOptions,
    editingId,
    setEditingId,
    submitEdit,
    savingMathtrade,
    errorSave,
    submitRulebook,
    uploadingRulebook,
    errorRulebook,
  } = useAdminPanel();

  return (
    <>
      <PageHeader title="title.AdminPanel" variant="minimal" />
      <SectionCommon loading={loadingList}>
        <div className="md:px-7 px-3 py-7">
          <div className="mb-4 text-right">
            <Link
              href={PRIVATE_ROUTES.ADMIN_CONTRIBUTIONS.path}
              className="text-primary underline"
            >
              <I18N id="adminContributions.link" />
            </Link>
          </div>
          <ErrorAlert error={errorList} />
          {mathtrades.map((mathtrade: any) => (
            <EditionRow
              key={mathtrade.id}
              mathtrade={mathtrade}
              editing={editingId === mathtrade.id}
              onToggleEdit={() =>
                setEditingId(editingId === mathtrade.id ? null : mathtrade.id)
              }
              onSubmitEdit={submitEdit}
              saving={savingMathtrade}
              errorSave={errorSave}
              locationOptions={locationOptions}
              onUploadRulebook={submitRulebook}
              uploadingRulebook={uploadingRulebook}
              errorRulebook={errorRulebook}
            />
          ))}
        </div>
      </SectionCommon>
    </>
  );
};

export default AdminPanelPage;
