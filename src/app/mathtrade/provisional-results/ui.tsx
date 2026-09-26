"use client";
import EmptyList from "@/components/emptyList";
import ErrorAlert from "@/components/errorAlert";
import I18N from "@/i18n";
import { LoadingBox } from "@/components/loading";
import useProvisionalResults from "./useProvisionalResults";
import ProvisionalSummary from "./summary";
import ProvisionalExclude from "./exclude";

const ProvisionalResultsUI = () => {
  const { loading, error, runsCount, summary } = useProvisionalResults();

  if (loading && !runsCount) {
    return (
      <div className="relative min-h-48">
        <LoadingBox loading />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* What these are, in plain words. Deliberately says nothing about how
          the runs are built: members must not be able to tell them apart. */}
      <section className="mb-6 rounded-xl bg-primary/5 border border-primary/20 p-4">
        <h2 className="font-bold text-base mb-2">
          <I18N id="provisional.intro.title" />
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          <I18N id="provisional.intro.what" />
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <I18N id="provisional.intro.final" />
        </p>
        <p className="text-sm text-gray-700">
          <I18N id="provisional.intro.exclude" />
        </p>
      </section>
      <ErrorAlert error={error} />
      {!runsCount ? (
        <EmptyList visible icon="status-box" message="provisional.none" />
      ) : (
        <>
          <ProvisionalSummary rows={summary} />
          <LoadingBox loading={loading} transparent />
        </>
      )}
      <ProvisionalExclude />
    </div>
  );
};

export default ProvisionalResultsUI;
