"use client";
import { useCallback, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";

export type RulesQuestion = {
  id: number;
  text: string;
  options: string[];
  correct_index: number;
  explanation: string;
  active: boolean;
};

export type QuestionDraft = Omit<RulesQuestion, "id" | "active"> & {
  active?: boolean;
};

const useRulesQuestions = () => {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  const [loadQuestions, questions, loading, errorList] = useFetch({
    endpoint: "GET_RULES_QUESTIONS",
    initialState: [],
    autoLoad: true,
  });

  // Update the list from the response instead of reloading all questions.
  const [list, setList] = useState<RulesQuestion[] | null>(null);
  const current: RulesQuestion[] = useMemo(
    () => list ?? questions ?? [],
    [list, questions]
  );

  const upsert = useCallback(
    (saved: RulesQuestion) => {
      setList((prev) => {
        const base = prev ?? questions ?? [];
        return base.some((q: RulesQuestion) => q.id === saved.id)
          ? base.map((q: RulesQuestion) => (q.id === saved.id ? saved : q))
          : [...base, saved];
      });
      setEditingId(null);
    },
    [questions]
  );

  const [createQuestion, , creating, errorCreate] = useFetch({
    endpoint: "POST_RULES_QUESTION",
    method: "POST",
    afterLoad: upsert,
  });

  const [updateQuestion, , updating, errorUpdate] = useFetch({
    endpoint: "PUT_RULES_QUESTION",
    method: "PUT",
    afterLoad: upsert,
  });

  const save = useCallback(
    (draft: QuestionDraft) => {
      if (editingId === "new") {
        createQuestion({ params: { ...draft, active: true } });
      } else if (editingId !== null) {
        const existing = current.find((q) => q.id === editingId);
        updateQuestion({
          urlParams: [editingId],
          params: { ...draft, active: existing?.active ?? true },
        });
      }
    },
    [editingId, current, createQuestion, updateQuestion]
  );

  const toggleActive = useCallback(
    (question: RulesQuestion) =>
      updateQuestion({
        urlParams: [question.id],
        params: { ...question, active: !question.active },
      }),
    [updateQuestion]
  );

  return {
    questions: current,
    editingId,
    setEditingId,
    save,
    toggleActive,
    reload: loadQuestions,
    busy: loading || creating || updating,
    error: errorList || errorCreate || errorUpdate,
  };
};

export default useRulesQuestions;
