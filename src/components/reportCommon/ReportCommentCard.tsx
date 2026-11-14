import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  name: ReactNode;
  // Already formatted.
  date: string;
  text: string;
  tone?: "amber" | "gray";
  className?: string;
  children?: ReactNode;
};

// One message of a report thread: author, date and text.
const ReportCommentCard = ({ name, date, text, tone = "gray", className, children }: Props) => (
  <div
    className={clsx(
      "min-w-0 rounded-md border px-3 py-2",
      tone === "amber" ? "border-amber-200 bg-white" : "border-gray-200 bg-white",
      className
    )}
  >
    <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
      <strong className="min-w-0 break-words">{name}</strong>
      <span className="opacity-75">{date}</span>
    </div>
    <p className="mt-0.5 whitespace-pre-line break-words">{text}</p>
    {children}
  </div>
);

export default ReportCommentCard;
