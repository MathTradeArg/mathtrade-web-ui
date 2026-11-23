"use client";
import Link from "next/link";
import I18N from "@/i18n";
import Icon from "@/components/icon";
import { PRIVATE_ROUTES } from "@/config/routes";

// Shown instead of a page that is closed during the event.
const EventModeLockedScreen = () => {
  return (
    <div className="md:px-8 px-3 pt-8 pb-5">
      <section className="max-w-lg mx-auto bg-card border border-line p-6 rounded-card shadow-card text-center">
        <Icon type="lock" className="text-4xl text-ink-muted mb-3" />
        <h1 className="text-card-title mb-2 text-ink">
          <I18N id="eventMode.locked.title" />
        </h1>
        <p className="text-ink-muted mb-5 text-balance">
          <I18N id="eventMode.locked.message" />
        </p>
        <Link
          href={PRIVATE_ROUTES.HOME.path}
          className="inline-flex items-center gap-1.5 font-bold text-brand-ink bg-brand px-5 py-2.5 rounded-full hover:brightness-95 transition-opacity"
        >
          <I18N id="eventMode.locked.link" />
        </Link>
      </section>
    </div>
  );
};

export default EventModeLockedScreen;
