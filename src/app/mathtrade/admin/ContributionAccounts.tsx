"use client";
import I18N from "@/i18n";
import { Form, InputContainer, Label, Input } from "@/components/form";
import Button from "@/components/button";
import ButtonAlert from "@/components/buttonAlert";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import useContributionAccounts, {
  ContributionAccount,
} from "./useContributionAccounts";

const AccountForm = ({
  account,
  onSubmit,
  onCancel,
}: {
  account?: ContributionAccount;
  onSubmit: (formProps: Record<string, any>) => void;
  onCancel: () => void;
}) => (
  <Form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <InputContainer>
        <Label text="adminPanel.contribution.holderName" name="holder_name" required />
        <Input name="holder_name" data={account} />
      </InputContainer>
      <InputContainer>
        <Label text="adminPanel.contribution.alias" name="alias" required />
        <Input name="alias" data={account} />
      </InputContainer>
      <InputContainer>
        <Label text="adminPanel.contribution.cbu" name="cbu" />
        <Input name="cbu" data={account} />
      </InputContainer>
      <InputContainer>
        <Label text="adminPanel.contribution.bank" name="bank" />
        <Input name="bank" data={account} />
      </InputContainer>
    </div>
    <div className="flex items-center gap-2">
      <Button sm type="submit">
        <I18N id="btn.Save" />
      </Button>
      <Button sm type="button" outline onClick={onCancel}>
        <I18N id="btn.Cancel" />
      </Button>
    </div>
  </Form>
);

const ContributionAccounts = ({ mathtradeId }: { mathtradeId: number }) => {
  const {
    accounts,
    editingId,
    setEditingId,
    submitAccount,
    toggleActive,
    removeAccount,
    busy,
    error,
  } = useContributionAccounts(mathtradeId);

  return (
    <div className="relative mt-5 pt-4 border-t border-stroke">
      <h4 className="font-bold mb-2">
        <I18N id="adminPanel.contribution.accountsTitle" />
      </h4>
      {accounts.length === 0 ? (
        <p className="text-sm text-gray-500 mb-2">
          <I18N id="adminPanel.contribution.noAccounts" />
        </p>
      ) : null}
      {accounts.map((account) =>
        editingId === account.id ? (
          <div key={account.id} className="mb-3">
            <AccountForm
              account={account}
              onSubmit={submitAccount}
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div
            key={account.id}
            className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-stroke text-sm"
          >
            <div className={account.active ? "" : "opacity-50"}>
              <span className="font-bold">{account.holder_name}</span>
              {" · "}
              {account.alias}
              {account.cbu ? ` · ${account.cbu}` : ""}
              {account.bank ? ` · ${account.bank}` : ""}
              {account.active ? null : (
                <span className="ml-2 uppercase text-[10px] font-bold bg-gray-400 text-white px-2 py-[3px] rounded-full">
                  <I18N id="adminPanel.contribution.inactive" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button sm outline type="button" onClick={() => setEditingId(account.id)}>
                <I18N id="element.Edit" />
              </Button>
              <Button sm outline type="button" onClick={() => toggleActive(account)}>
                <I18N
                  id={
                    account.active
                      ? "adminPanel.contribution.deactivate"
                      : "adminPanel.contribution.activate"
                  }
                />
              </Button>
              <ButtonAlert
                className="text-red-700 font-bold text-xs hover:text-red-900 transition-colors"
                title="adminPanel.contribution.deleteTitle"
                onClick={() => removeAccount(account)}
              >
                <I18N id="adminPanel.contribution.delete" />
              </ButtonAlert>
            </div>
          </div>
        )
      )}
      {editingId === "new" ? (
        <div className="mt-3">
          <AccountForm onSubmit={submitAccount} onCancel={() => setEditingId(null)} />
        </div>
      ) : (
        <div className="mt-3">
          <Button sm type="button" onClick={() => setEditingId("new")}>
            <I18N id="adminPanel.contribution.add" />
          </Button>
        </div>
      )}
      <ErrorAlert error={error} />
      <LoadingBox loading={busy} transparent />
    </div>
  );
};

export default ContributionAccounts;
