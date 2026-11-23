import { useContext } from "react";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";
import Calendar from "@/components/calendar";
import WhatIsMT from "@/components/whatIsMT";
import EditionCard from "./editionCard";
import EditionStats from "./editionStats";
import Referral from "@/components/referral";
import ReferralInvite from "./referralInvite";
import UserQR from "@/components/userQr";
import useTour from "@/tours/useTour";
import Link from "next/link";
import { PRIVATE_ROUTES } from "@/config/routes";
import useEventMode from "@/components/eventModeGate/useEventMode";

const HomeContent = () => {
  /* PAGE CONTEXT **********************************************/
  const { mathtrade } = useContext(PageContext);
  /* end PAGE CONTEXT */

  const hasEdition = mathtrade && Object.keys(mathtrade).length > 0;
  // In event mode useTour itself stays off (no POST users/tours/).
  useTour("home", { ready: true });
  const { eventMode, isAdmin } = useEventMode();

  // Event mode: the QR and the way to the results only. Only once current/
  // confirmed it (none of the rest asks the API, so there's no 403 to avoid
  // meanwhile, and the regular Home doesn't flash the reduced one on load).
  if (eventMode === true && !isAdmin) {
    return (
      <div className="md:px-8 px-3 pt-8 pb-5">
        {hasEdition ? (
          <>
            <EditionCard />
            <UserQR />
          </>
        ) : null}
        <div className="flex justify-center mb-8">
          <Link
            href={PRIVATE_ROUTES.RESULTS.path}
            className="inline-flex items-center gap-1.5 font-bold text-brand-ink bg-brand px-6 py-3 rounded-full hover:brightness-95 transition-opacity"
          >
            <I18N id="home.edition.next.results" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-8 px-3 pt-8 pb-5">
      {hasEdition ? (
        <>
          <EditionCard />
          <UserQR />
          {/* Numbers and calendar side by side, both stacked. */}
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 mb-6">
            <section className="bg-card border border-line p-5 rounded-card shadow-card">
              <h2 className="text-card-title mb-4 text-ink">
                <I18N id="home.stats.title" />
              </h2>
              <EditionStats />
            </section>
            <section
              className="bg-card border border-line p-5 rounded-card shadow-card"
              data-tour="home.calendar"
            >
              <h2 className="text-card-title mb-4 text-ink">
                <I18N id="timeline.header" />
              </h2>
              <Calendar />
            </section>
          </div>
          <ReferralInvite />
        </>
      ) : null}
      <div
        className="mb-8 bg-card border border-line p-5 rounded-card shadow-card"
        data-tour="home.whatIs"
      >
        <WhatIsMT />
      </div>
      {/* At the bottom; a floating button scrolls down to it. */}
      {hasEdition ? <Referral floatingButton /> : null}
    </div>
  );
};

export default HomeContent;
