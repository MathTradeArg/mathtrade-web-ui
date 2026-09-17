"use client";
import I18N from "@/i18n";
import Icon from "@/components/icon";
import clsx from "clsx";
import { useState, lazy } from "react";
import Dynamic from "@/components/dynamic";

const WantsOfferedApp = lazy(() => import("./app"));

const WantsOffered = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-5 py-4 rounded-xl border border-gray-200">
      <h3
        className="font-bold text-lg text-gray-500 text-balance cursor-pointer"
        onClick={() => setIsOpen((v) => !v)}
      >
        <Icon
          type="chevron-right"
          className={clsx("text-3xl transition-transform", {
            "rotate-90": isOpen,
          })}
        />
        <I18N id="wantsOffered.title" />
      </h3>
      {isOpen ? (
        <div className="pt-4">
          <Dynamic>
            <WantsOfferedApp />
          </Dynamic>
        </div>
      ) : null}
    </div>
  );
};

export default WantsOffered;
