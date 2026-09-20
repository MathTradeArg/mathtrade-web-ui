"use client";
import { useRef } from "react";
import I18N from "@/i18n";
import { Form, InputContainer, Label, Input, Select, Switch } from "@/components/form";
import Button from "@/components/button";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import { DATE_FIELDS, toLocalInput } from "./useAdminPanel";

const DATE_LABELS: Record<string, string> = {
  start_date: "adminPanel.field.startDate",
  freeze_geek_date: "adminPanel.field.freezeGeekDate",
  freeze_wants_date: "adminPanel.field.freezeWantsDate",
  provisional_results_date: "adminPanel.field.provisionalResultsDate",
  show_results_date: "adminPanel.field.showResultsDate",
  meeting_date: "adminPanel.field.meetingDate",
};

type Mathtrade = {
  id: number;
  name: string;
  active: boolean;
  location?: { id: number } | null;
  rulebook_url?: string | null;
  [key: string]: any;
};

type EditionRowProps = {
  mathtrade: Mathtrade;
  editing: boolean;
  onToggleEdit: () => void;
  onSubmitEdit: (id: number, formProps: Record<string, any>) => void;
  saving: boolean;
  errorSave: any;
  locationOptions: { value: number; text: string }[];
  onUploadRulebook: (id: number, file: File) => void;
  uploadingRulebook: boolean;
  errorRulebook: any;
};

const EditionRow = ({
  mathtrade,
  editing,
  onToggleEdit,
  onSubmitEdit,
  saving,
  errorSave,
  locationOptions,
  onUploadRulebook,
  uploadingRulebook,
  errorRulebook,
}: EditionRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-stroke rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="font-bold">{mathtrade.name}</span>
          {mathtrade.active ? (
            <span className="ml-2 uppercase text-[10px] font-bold bg-primary text-white px-2 py-[3px] rounded-full">
              <I18N id="adminPanel.active.badge" />
            </span>
          ) : null}
        </div>
        <Button sm outline onClick={onToggleEdit} type="button">
          <I18N id="element.Edit" />
        </Button>
      </div>

      {editing ? (
        <div className="relative mt-4 pt-4 border-t border-stroke">
          <Form
            formatTypes={{ active: "boolean" }}
            onSubmit={(formProps) => onSubmitEdit(mathtrade.id, formProps)}
          >
            <InputContainer>
              <Label text="adminPanel.field.name" name="name" />
              <Input name="name" data={{ name: mathtrade.name }} />
            </InputContainer>

            <InputContainer>
              <Label text="form.Location" name="location" />
              <Select
                name="location"
                data={{ location: mathtrade.location?.id }}
                options={locationOptions}
              />
            </InputContainer>

            <InputContainer className="mb-4">
              <Switch name="active" data={{ active: !!mathtrade.active }}>
                <I18N id="adminPanel.field.active" />
              </Switch>
            </InputContainer>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DATE_FIELDS.map((field) => (
                <InputContainer key={field}>
                  <Label text={DATE_LABELS[field]} name={field} />
                  <Input
                    type="datetime-local"
                    name={field}
                    data={{ [field]: toLocalInput(mathtrade[field]) }}
                  />
                </InputContainer>
              ))}
            </div>

            <ErrorAlert error={errorSave} />

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                <I18N id="btn.Save" />
              </Button>
              <Button type="button" outline onClick={onToggleEdit}>
                <I18N id="btn.Cancel" />
              </Button>
            </div>
          </Form>

          <div className="mt-5 pt-4 border-t border-stroke">
            {mathtrade.rulebook_url ? (
              <a
                href={mathtrade.rulebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm"
              >
                <I18N id="adminPanel.rulebook.current" />
              </a>
            ) : (
              <p className="text-sm text-gray-500">
                <I18N id="adminPanel.rulebook.none" />
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadRulebook(mathtrade.id, file);
                }}
              />
            </div>
            <ErrorAlert error={errorRulebook} />
          </div>

          <LoadingBox loading={saving || uploadingRulebook} transparent />
        </div>
      ) : null}
    </div>
  );
};

export default EditionRow;
