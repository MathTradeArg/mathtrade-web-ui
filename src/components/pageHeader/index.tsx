"use client";
import I18N from "@/i18n";
import clsx from "clsx";
import Wrapper from "../wrapper";
import HelpContext from "@/components/help-context";
import Icon from "@/components/icon";
import { Meeple } from "@/components/illustrations";
import type { ReactNode } from "react";

type PageHeaderVariant = "compact" | "minimal" | "welcome";
type PageHeaderTone = "sun" | "peach" | "pink" | "mint" | "lilac";

// Literal class names so Tailwind sees them.
const TONES: Record<PageHeaderTone, { bg: string; icon: string }> = {
  sun: { bg: "bg-sun", icon: "die" },
  peach: { bg: "bg-peach", icon: "meeple" },
  pink: { bg: "bg-pink", icon: "meeple" },
  mint: { bg: "bg-mint", icon: "heart" },
  lilac: { bg: "bg-lilac", icon: "die" },
};

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  // compact: task screens (title + optional meta + help link)
  // minimal: simple screens (title only)
  // welcome: home only (short identity + inline links as children)
  variant?: PageHeaderVariant;
  // Colored tile with an icon, only for the main sections (compact only).
  tone?: PageHeaderTone;
  meta?: ReactNode;
  helpId?: string;
  help?: ReactNode;
  // Visible banner under the header (header itself stays ≤ 80px).
  // danger: high-risk (e.g. duplicate copies). warning: stage/constraint.
  alert?: ReactNode;
  alertTone?: "danger" | "warning";
  children?: ReactNode;
};

const PageHeader = ({
  title = "",
  subtitle = "",
  variant = "minimal",
  tone,
  meta = null,
  helpId,
  help = null,
  alert = null,
  alertTone = "danger",
  children = null,
}: PageHeaderProps) => {
  if (!title && !children) {
    return null;
  }

  const isWelcome = variant === "welcome";
  const isCompact = variant === "compact";
  const toneConf = isCompact && tone ? TONES[tone] : null;

  return (
    <Wrapper>
      <div className="mb-main">
        <header
        className={clsx("relative overflow-hidden rounded-main", {
          "bg-brand text-brand-ink px-6 py-5": isWelcome,
          "px-1 pt-4 pb-3": isCompact,
          "px-1 py-3.5": variant === "minimal",
        })}
      >
        {isWelcome ? (
          <div className="grid grid-cols-[1fr_auto] gap-x-5 items-center">
            <div>
              <h1 className="font-display font-semibold text-brand-ink leading-[1.1] text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] text-balance">
                <I18N id={title} />
              </h1>
              {children ? (
                <div className="mt-2 text-body text-brand-ink leading-relaxed">
                  {children}
                </div>
              ) : null}
            </div>
            <div className="hidden sm:flex items-end gap-3" aria-hidden>
              <Meeple fill="#ffc700" className="w-[54px] h-[54px]" />
              <Meeple fill="#ffffff" className="w-[72px] h-[72px]" />
              <Meeple fill="#ffb084" className="w-[54px] h-[54px]" />
            </div>
          </div>
        ) : toneConf ? (
          <div className="grid grid-cols-[48px_1fr] gap-x-3.5 items-center">
            <div
              className={clsx(
                "w-12 h-12 rounded-card flex items-center justify-center text-ink",
                toneConf.bg
              )}
              aria-hidden
            >
              <Icon type={toneConf.icon} className="text-[26px]" />
            </div>
            <div>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h1
                className={clsx("text-balance m-0 text-ink", {
                  "text-page-title": isCompact,
                  "text-card-title": !isCompact,
                })}
              >
                <I18N id={title} />
              </h1>
              {meta ? (
                <div className="text-body text-ink-muted font-semibold whitespace-nowrap">
                  {meta}
                </div>
              ) : null}
            </div>
            {subtitle ? (
              <p className="text-body-lg text-ink-muted font-semibold pt-1">
                <I18N id={subtitle} />
              </p>
            ) : null}
            {isCompact && (helpId || help) ? (
              <div className="mt-1.5 flex items-center gap-2.5 flex-wrap">
                {helpId ? <HelpContext id={helpId} variant="link" /> : null}
                {help}
              </div>
            ) : null}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h1
                className={clsx("text-balance m-0 text-ink", {
                  "text-page-title": isCompact,
                  "text-card-title": !isCompact,
                })}
              >
                <I18N id={title} />
              </h1>
              {meta ? (
                <div className="text-body text-ink-muted font-semibold whitespace-nowrap">
                  {meta}
                </div>
              ) : null}
            </div>
            {subtitle ? (
              <p className="text-body-lg text-ink-muted font-semibold pt-1">
                <I18N id={subtitle} />
              </p>
            ) : null}
            {isCompact && (helpId || help) ? (
              <div className="mt-1.5 flex items-center gap-2.5 flex-wrap">
                {helpId ? <HelpContext id={helpId} variant="link" /> : null}
                {help}
              </div>
            ) : null}
          </>
        )}
      </header>
      {alert ? (
        <div
          className={clsx(
            "mt-2 rounded-lg border px-4 py-2.5 text-body",
            alertTone === "warning"
              ? "border-orange-700 bg-orange-500 text-white font-semibold"
              : "border-red-200 bg-red-50 text-red-800"
          )}
        >
          {alert}
        </div>
      ) : null}
      </div>
    </Wrapper>
  );
};

export default PageHeader;
