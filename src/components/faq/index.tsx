"use client";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import clsx from "clsx";
import { useState } from "react";

type FaqData = {
  question?: string;
  answer?: string[];
  images?: string[];
};

const Faq = ({
  data = {},
  translate = false,
  accent = false,
}: {
  data?: FaqData;
  translate?: boolean;
  accent?: boolean;
}) => {
  const { question = "", answer = [], images = [] } = data;
  const [open, setOpen] = useState(false);

  return (
    <div
      className={clsx(
        "mb-4 rounded-lg border",
        accent
          ? "border-sky-200 bg-sky-50"
          : "border-gray-200 bg-white"
      )}
    >
      <button
        type="button"
        className={clsx(
          "w-full text-left py-2.5 px-3 rounded-lg",
          accent ? "hover:bg-sky-100" : "hover:bg-gray-50"
        )}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Icon
            type="arrow-right"
            className={clsx(
              "text-sm shrink-0 transition-transform",
              accent ? "text-primary" : "text-gray-500",
              { "rotate-90": open }
            )}
          />
          <span
            className={clsx(
              "text-sm font-semibold",
              accent ? "text-sky-900" : "text-gray-800"
            )}
          >
            {translate ? <I18N id={question} /> : question}
          </span>
        </span>
      </button>
      {open ? (
        <div className="px-4 pb-4 pt-1 text-sm text-gray-700 leading-relaxed flex flex-col gap-3">
          {answer.map((anw, k) => (
            <p className="m-0 text-balance" key={k}>
              {translate ? <I18N id={anw} /> : anw}
            </p>
          ))}
          {images.length
            ? images.map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" key={k} />
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default Faq;
