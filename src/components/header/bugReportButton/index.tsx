"use client";
import { useCallback, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { GOOGLE_RECAPTCHA_CLIENT_KEY } from "@/config";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import clsx from "clsx";
import Modal from "@/components/modal";
import { fadeLabelClass } from "@/components/sidebar/fadeLabel";
import { captureScreenshot } from "@/utils/screenshot";
import { getConsoleBuffer } from "@/utils/consoleBuffer";
import BugReportForm from "./form";

type BugReportButtonProps = {
  // "row" mirrors HelpButton's sidebar/more-sheet row layout — this
  // component has no "header" variant since it opens a Modal, not a
  // hover panel, so there is nothing to render inline in the header bar.
  variant?: "row";
  // "dark" for the black sidebar, "light" for the white mobile sheet.
  tone?: "dark" | "light";
  collapsed?: boolean;
};

const BugReportButtonInner = ({
  tone = "dark",
  collapsed = false,
}: BugReportButtonProps = {}) => {
  const [open, setOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [consoleLog, setConsoleLog] = useState("");

  const toggleOpen = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const openWithCapture = useCallback(async () => {
    // Captured up front, before the modal even opens, so the preview the
    // form shows is exactly what gets sent — no separate "attach" step.
    const shot = await captureScreenshot();
    setScreenshot(shot);
    setConsoleLog(getConsoleBuffer().join("\n"));
    setOpen(true);
  }, []);

  return (
    <div className="relative">
      <button
        className={clsx(
          "flex items-center w-full cursor-pointer peer text-sm py-2 rounded-lg",
          collapsed ? "justify-center px-0" : "text-left px-2",
          tone === "light"
            ? "text-gray-900 hover:bg-gray-50"
            : "text-white/80 hover:text-white hover:bg-white/5"
        )}
        onClick={openWithCapture}
      >
        <Icon type="report" className="text-lg shrink-0" />
        <span className={fadeLabelClass(!collapsed)}>
          <I18N id="bugReport.menu" />
        </span>
      </button>

      <Modal isOpen={open} onClose={toggleOpen} size="md">
        <BugReportForm
          toggleEditingMode={toggleOpen}
          screenshot={screenshot}
          consoleLog={consoleLog}
        />
      </Modal>
    </div>
  );
};

const BugReportButton = (props: BugReportButtonProps = {}) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={GOOGLE_RECAPTCHA_CLIENT_KEY}
    language="es"
  >
    <BugReportButtonInner {...props} />
  </GoogleReCaptchaProvider>
);

export default BugReportButton;
