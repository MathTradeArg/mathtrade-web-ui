import I18N from "@/i18n";
import Question from "../question";
import clsx from "clsx";
import type { ReactNode } from "react";

type BGGinfoLabelProps = {
  label: string;
  question?: string;
  children?: ReactNode;
  contextFor?: string;
};

const BGGinfoLabel = ({ label, question, children }: BGGinfoLabelProps) => {
  return (
    <div>
      <div className="whitespace-nowrap leading-none">
        <span className={clsx("text-caption mr-1 opacity-90")}>
          <I18N id={label} />
        </span>
        {question ? <Question text={question} noTranslate /> : null}
      </div>
      {children}
    </div>
  );
};

export default BGGinfoLabel;
