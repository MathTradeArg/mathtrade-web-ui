"use client";
import ChangeSection from "@/components/results/visual/changeSection";
import EmptyList from "@/components/emptyList";
import I18N from "@/i18n";
import type { ProvisionalRun } from "./useProvisionalResults";

const RunSection = ({ run }: { run: ProvisionalRun }) => {
  return (
    <section className="mb-10">
      <h2 className="text-base font-bold mb-1">{run.label}</h2>
      {run.results?.length ? (
        run.results.map((result) => (
          <ChangeSection result={result} key={result.id} />
        ))
      ) : (
        <EmptyList visible icon="status-box" message="provisional.run.none" />
      )}
    </section>
  );
};

const ProvisionalRuns = ({ runs = [] }: { runs?: ProvisionalRun[] }) => {
  if (!runs.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-base font-bold mb-4">
        <I18N id="provisional.runs.title" />
      </h2>
      {runs.map((run) => (
        <RunSection key={run.id} run={run} />
      ))}
    </div>
  );
};

export default ProvisionalRuns;
