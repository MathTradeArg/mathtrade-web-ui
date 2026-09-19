"use client";
import I18N from "@/i18n";
import clsx from "clsx";
import Wrapper from "../wrapper";
import HelpContext from "@/components/help-context";
import type { ReactNode } from "react";

type PageHeaderVariant = "compact" | "minimal" | "welcome";

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  // compact: task screens (title + optional meta + help link)
  // minimal: simple screens (title only)
  // welcome: home only (short identity + inline links as children)
  variant?: PageHeaderVariant;
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

  return (
    <Wrapper>
      <div className="mb-main">
        <header
        className={clsx("relative overflow-hidden rounded-main", {
          "bg-gradient-to-br from-sky-700 to-purple-700 px-5 py-5 shadow-main":
            isWelcome,
          "bg-white shadow-main px-5 pt-4 pb-3": isCompact,
          "bg-white shadow-main px-5 py-3.5": variant === "minimal",
        })}
      >
        {isWelcome ? (
          <>
            <h1 className="text-white font-extrabold leading-tight text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] text-balance">
              <I18N id={title} />
            </h1>
            {children ? (
              <div className="mt-2 text-body text-white/95 leading-relaxed">
                {children}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h1
                className={clsx("text-balance m-0", {
                  "text-display": isCompact,
                  "text-heading": !isCompact,
                })}
              >
                <I18N id={title} />
              </h1>
              {meta ? (
                <div className="text-body text-gray-500 font-medium whitespace-nowrap">
                  {meta}
                </div>
              ) : null}
            </div>
            {subtitle ? (
              <p className="text-heading text-gray-600 pt-1">
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
