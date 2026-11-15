import clsx from "clsx";
import { getI18Ntext } from "@/i18n";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

type TextareaProps = {
  name: string;
  placeholder?: string | null;
  noTranslatePlaceholder?: boolean;
  size?: "md" | "sm";
  disabled?: boolean;
  disabledInput?: boolean;
  ariaLabel?: string | null;
  data?: Record<string, any>;
  onChange?: ((e: ChangeEvent<HTMLTextAreaElement>) => void) | null;
  rows?: number | null;
  maxlength?: number;
  className?: string;
};

const Textarea = ({
  name,
  placeholder = null,
  noTranslatePlaceholder = false,
  size = "md",
  disabled = false,
  disabledInput = false,
  ariaLabel = null,
  data,
  onChange = null,
  rows = null,
  maxlength = undefined,
  className,
}: TextareaProps) => {
  const [valueInput, setValueInput] = useState("");

  useEffect(() => {
    setValueInput((data && data[name]) || "");
  }, [data, name]);

  return (
    <textarea
      name={name}
      className={clsx(
        "input block w-full border border-line rounded-md shadow-sm peer focus:border-primary focus:shadow-[0_0_6px_theme(colors.primary)]   focus:outline-none",
        {
          "p-3 text-base": size === "md",
          "p-2 text-sm": size === "sm",
          "bg-gray-200 text-gray-500": disabled || disabledInput,
        },
        className
      )}
      placeholder={
        placeholder
          ? noTranslatePlaceholder
            ? placeholder
            : getI18Ntext(placeholder)
          : undefined
      }
      aria-label={ariaLabel ? getI18Ntext(ariaLabel) : undefined}
      value={valueInput}
      onChange={(e) => {
        if (!disabledInput) {
          setValueInput(e.target.value);
          if (onChange) onChange(e);
        }
      }}
      rows={rows || 2}
      maxLength={maxlength}
    />
  );
};

export default Textarea;
