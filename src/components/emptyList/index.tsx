"use client";
import Link from "next/link";
import I18N from "@/i18n";
import { Die, Meeple } from "@/components/illustrations";

const EmptyList = ({
  visible = false,
  message = "EmptyList",
  // Still accepted so callers need no change; the art is now fixed (meeple + die).
  icon = "",
  ctaText = "",
  ctaHref = "",
}) => {
  if (!visible) {
    return null;
  }

  if (!ctaText && !icon) {
    return (
      <div className="text-center italic font-bold text-xl text-gray-600 py-4">
        <I18N id={message || "EmptyList"} />
      </div>
    );
  }

  return (
    <div className="text-center bg-surface rounded-main py-8 px-6">
      <div className="flex justify-center items-end mb-3" aria-hidden>
        <Meeple fill="#ffb084" className="w-11 h-11 -mx-1" />
        <Die className="w-11 h-11 -mx-1" />
      </div>
      <div className="text-ink-muted max-w-sm mx-auto mb-4">
        <I18N id={message || "EmptyList"} />
      </div>
      {ctaText && ctaHref ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 font-bold text-brand-ink bg-brand px-5 py-2.5 rounded-full hover:brightness-95 transition-opacity"
        >
          <I18N id={ctaText} />
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyList;
