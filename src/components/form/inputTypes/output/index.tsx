import Icon from "@/components/icon";
import clsx from "clsx";
import { getI18Ntext } from "@/i18n";
import type { ReactNode } from "react";

type OutputProps = {
  data?: Record<string, any>;
  name?: string;
  value?: ReactNode;
  className?: string;
  ariaLabel?: string;
  icon?: string;
};

const Output = ({ data, name, value, className, ariaLabel, icon }: OutputProps) => {
  return (
    <div
      className={clsx("flex items-stretch relative", className)}
      aria-label={ariaLabel ? getI18Ntext(ariaLabel) : undefined}
    >
      <div
        className={clsx(
          "input block w-full border border-line rounded-md shadow-sm peer focus:outline-none p-2 italic text-gray-400",
          {
            "order-2 border-l-0 rounded-tl-none rounded-bl-none": icon,
          }
        )}
      >
        {value || (data && name && data[name] ? data[name] : "")}
      </div>

      {icon ? (
        <div className="input-icon border text-ink-muted border-line order-1 border-r-0 rounded-tl-md rounded-bl-md w-[45px] flex flex-col justify-center items-center bg-surface">
          <Icon type={icon} />
        </div>
      ) : null}
    </div>
  );
};
export default Output;
