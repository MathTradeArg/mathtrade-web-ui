"use client";
import Modal from "@/components/modal";
import { useState } from "react";
import I18N from "@/i18n";
import Icon from "@/components/icon";
import WhatIsMT from "@/components/whatIsMT";

// Login's "¿Qué es el Math Trade?": the same explanation as the home.
const WhatIsMathTrade = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((v) => !v);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleIsOpen}
        className="bg-white rounded-full px-4 py-1 shadow-md hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center gap-1">
          <div className="text-ink-muted font-bold text-sm">
            <I18N id="whatIsMathTrade" />
          </div>
          <div className="bg-sun text-ink rounded-full w-6 h-6 flex items-center justify-center text-base">
            <Icon type="help" />
          </div>
        </div>
      </button>
      <Modal isOpen={isOpen} onClose={toggleIsOpen} size="md2">
        <div className="p-5 sm:p-8">
          <WhatIsMT showFaqLink={false} />
        </div>
      </Modal>
    </>
  );
};

export default WhatIsMathTrade;
