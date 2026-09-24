"use client";
import { useState } from "react";
import clsx from "clsx";
import PageHeader from "@/components/pageHeader";
import SectionCommon from "@/components/sections/common";
import ErrorAlert from "@/components/errorAlert";
import Button from "@/components/button";
import I18N, { getI18Ntext } from "@/i18n";
import useRulesQuestions, { QuestionDraft, RulesQuestion } from "./useRulesQuestions";

const MAX_OPTIONS = 4;

const QuestionEditor = ({
  question,
  onSave,
  onCancel,
}: {
  question?: RulesQuestion;
  onSave: (draft: QuestionDraft) => void;
  onCancel: () => void;
}) => {
  const [text, setText] = useState(question?.text ?? "");
  const [options, setOptions] = useState<string[]>(() => {
    const base = question?.options ?? ["", "", ""];
    return [...base, ...Array(MAX_OPTIONS).fill("")].slice(0, MAX_OPTIONS);
  });
  const [correct, setCorrect] = useState(question?.correct_index ?? 0);
  const [explanation, setExplanation] = useState(question?.explanation ?? "");

  const submit = () => {
    // Drop empty options, keeping the correct one pointing at the same text.
    const filled = options
      .map((value, index) => ({ value: value.trim(), index }))
      .filter((o) => o.value);
    const correctIndex = filled.findIndex((o) => o.index === correct);
    onSave({
      text: text.trim(),
      options: filled.map((o) => o.value),
      correct_index: correctIndex,
      explanation: explanation.trim(),
    });
  };

  const inputClass = "w-full border border-stroke rounded-md p-2 text-sm";
  return (
    <div className="border border-primary rounded-lg p-4 mb-3 bg-white">
      <textarea
        className={clsx(inputClass, "mb-3")}
        rows={2}
        placeholder={getI18Ntext("adminRulesQuestions.text")}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className="text-xs text-gray-600 mb-1">
        <I18N id="adminRulesQuestions.optionsHelp" />
      </p>
      {options.map((value, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="correct"
            checked={correct === index}
            onChange={() => setCorrect(index)}
            aria-label={getI18Ntext("adminRulesQuestions.correct")}
          />
          <input
            className={inputClass}
            placeholder={`${getI18Ntext("adminRulesQuestions.option")} ${index + 1}`}
            value={value}
            onChange={(e) =>
              setOptions((prev) => prev.map((o, i) => (i === index ? e.target.value : o)))
            }
          />
        </div>
      ))}
      <textarea
        className={clsx(inputClass, "mb-3")}
        rows={2}
        placeholder={getI18Ntext("adminRulesQuestions.explanation")}
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button sm type="button" disabled={!text.trim() || !options[correct]?.trim()} onClick={submit}>
          <I18N id="btn.Save" />
        </Button>
        <Button sm type="button" outline onClick={onCancel}>
          <I18N id="btn.Cancel" />
        </Button>
      </div>
    </div>
  );
};

const RulesQuestionsPage = () => {
  const { questions, editingId, setEditingId, save, toggleActive, busy, error } =
    useRulesQuestions();
  const activeCount = questions.filter((q) => q.active).length;

  return (
    <>
      <PageHeader title="title.AdminRulesQuestions" variant="minimal" />
      <SectionCommon loading={busy}>
        <div className="md:px-7 px-3 py-7 max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 mb-4">
            <I18N id="adminRulesQuestions.lead" values={[activeCount]} />
          </p>
          <ErrorAlert error={error} />
          {editingId === "new" ? (
            <QuestionEditor onSave={save} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="mb-4">
              <Button sm type="button" onClick={() => setEditingId("new")}>
                <I18N id="adminRulesQuestions.add" />
              </Button>
            </div>
          )}
          {questions.map((question, position) =>
            editingId === question.id ? (
              <QuestionEditor
                key={question.id}
                question={question}
                onSave={save}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={question.id}
                className={clsx("border border-stroke rounded-lg p-4 mb-3", {
                  "opacity-50": !question.active,
                })}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">
                    {position + 1}. {question.text}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button sm outline type="button" onClick={() => setEditingId(question.id)}>
                      <I18N id="element.Edit" />
                    </Button>
                    <Button sm outline type="button" onClick={() => toggleActive(question)}>
                      <I18N
                        id={question.active ? "adminPanel.contribution.deactivate" : "adminPanel.contribution.activate"}
                      />
                    </Button>
                  </div>
                </div>
                <ul className="mt-2 text-sm">
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      className={clsx({ "font-bold text-green-700": index === question.correct_index })}
                    >
                      {index === question.correct_index ? "✔ " : "• "}
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </SectionCommon>
    </>
  );
};

export default RulesQuestionsPage;
