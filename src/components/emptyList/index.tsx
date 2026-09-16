"use client";
import Link from "next/link";
import I18N from "@/i18n";
import Icon from "@/components/icon";

const EmptyList = ({
  visible = false,
  message = "EmptyList",
  icon = "",
  ctaText = "",
  ctaHref = "",
}) => {
  if (!visible) {
    return null;
  }

  if (!ctaText) {
    return (
      <div className="text-center italic font-bold text-xl text-gray-600 py-4">
        <I18N id={message || "EmptyList"} />
      </div>
    );
  }

  return (
    <div className="text-center bg-white border border-gray-200 rounded-lg py-10 px-6">
      {icon ? (
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl">
          <Icon type={icon} />
        </div>
      ) : null}
      <div className="text-gray-600 max-w-sm mx-auto mb-4">
        <I18N id={message || "EmptyList"} />
      </div>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-1.5 font-bold text-white bg-primary px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
      >
        <I18N id={ctaText} />
      </Link>
    </div>
  );
};

export default EmptyList;
