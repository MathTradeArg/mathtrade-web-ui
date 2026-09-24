import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const useRulesQuiz = ({ onPassed }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  // Questions of the last submitted attempt: after submitting, the server no
  // longer returns them, but a failed user should see which ones were wrong.
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [nowMs, setNowMs] = useState(Date.now());

  const [loadState, , loadingState, errorState] = useFetch({
    endpoint: "GET_RULES_QUIZ",
    afterLoad: setQuiz,
    autoLoad: true,
  });

  const afterStart = useCallback((state) => {
    setQuiz(state);
    setAnswers({});
    setResult(null);
  }, []);
  const [startApi, , starting, errorStart] = useFetch({
    endpoint: "POST_RULES_QUIZ_START",
    method: "POST",
    afterLoad: afterStart,
  });

  const afterSubmit = useCallback(
    (submitResult) => {
      setResult(submitResult);
      loadState();
    },
    [loadState]
  );

  // Tell the page whenever the quiz is (or turns out to be already) passed,
  // e.g. after a reload, so it can show the sign-up form.
  const passed = !!quiz?.passed;
  useEffect(() => {
    if (passed) onPassed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed]);
  const [submitApi, , submitting, errorSubmit] = useFetch({
    endpoint: "POST_RULES_QUIZ_SUBMIT",
    method: "POST",
    afterLoad: afterSubmit,
  });

  // Display order only: the server grades by the stored option index, so each
  // shown option keeps its original index.
  const questions = useMemo(
    () =>
      (quiz?.questions || []).map((question) => ({
        ...question,
        shownOptions: shuffle(
          question.options.map((text, index) => ({ text, index }))
        ),
      })),
    [quiz?.questions]
  );

  const lockedUntilMs = quiz?.locked_until
    ? new Date(quiz.locked_until).getTime()
    : null;
  const locked = !!lockedUntilMs && lockedUntilMs > nowMs;

  useEffect(() => {
    if (!locked) return undefined;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [locked]);

  const remaining = locked ? Math.ceil((lockedUntilMs - nowMs) / 1000) : 0;

  const allAnswered =
    questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  const choose = useCallback((questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const start = useCallback(() => startApi(), [startApi]);
  const submit = useCallback(() => {
    setSubmittedQuestions(questions);
    submitApi({ params: { answers } });
  }, [submitApi, answers, questions]);

  let view = "loading";
  if (quiz) {
    if (quiz.passed) view = "passed";
    else if (questions.length) view = "questions";
    else if (locked) view = "locked";
    else view = "intro";
  }

  return {
    view,
    questions,
    answers,
    choose,
    allAnswered,
    start,
    submit,
    wrongIds: result && !result.passed ? result.wrong_ids : [],
    submittedQuestions,
    remaining,
    busy: loadingState || starting || submitting,
    error: errorState || errorStart || errorSubmit,
  };
};

export default useRulesQuiz;
