"use client";
import { getI18Ntext } from "@/i18n";
import clsx from "clsx";
import Link from "next/link";

// Literal class strings so Tailwind can see them (no dynamic templates).
const FILL: Record<string, string> = {
  primary: "bg-brand text-brand-ink hover:brightness-95",
  secondary: "bg-ink text-white hover:brightness-110",
  cancel: "bg-cancel text-white",
  danger: "bg-danger text-white hover:opacity-75",
  want: "bg-want text-white hover:opacity-75",
};
const OUTLINE: Record<string, string> = {
  primary: "border border-ink text-ink hover:bg-ink hover:text-white",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
  cancel: "border border-cancel text-cancel hover:bg-cancel hover:text-white",
  danger: "border border-danger text-danger hover:bg-danger hover:text-white",
  want: "border border-want text-want hover:bg-want hover:text-white",
};
// Disabled buttons keep the plain "cancel" colours with no hover.
const DISABLED_FILL = "bg-cancel text-white";
const DISABLED_OUTLINE = "border border-cancel text-cancel";

const Button = ({
  tag = "button",
  type = "submit",
  color = "primary",
  block = false,
  sm = false,
  lg = false,
  children = null,
  className = "",
  href = "",
  target = undefined,
  outline = false,
  ariaLabel = "",
  disabled = false,
  onClick = undefined,
}) => {
  const colorBtn = disabled ? "cancel" : color;

  const cl = clsx(
    "rounded-full outline-none transition-colors transition-opacity",
    {
      sm,
      "inline-block": !block,
      "w-auto": !block,
      block,
      "w-[100%]": block,
      //
    },
    disabled
      ? outline
        ? DISABLED_OUTLINE
        : DISABLED_FILL
      : outline
      ? OUTLINE[colorBtn] ?? OUTLINE.primary
      : FILL[colorBtn] ?? FILL.primary,
    sm
      ? "px-5 py-[2px] text-sm"
      : lg
      ? "px-10 py-3 text-xl"
      : "px-7 py-3 text-lg",
    className
  );

  const content = {
    button: (
      <button
        type={type as "button" | "reset" | "submit"}
        className={cl}
        aria-label={ariaLabel ? getI18Ntext(ariaLabel) : undefined}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    ),
    link: (
      <Link
        href={href}
        role="button"
        className={cl}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel ? getI18Ntext(ariaLabel) : undefined}
      >
        {children}
      </Link>
    ),
    a: (
      <a
        href={href}
        role="button"
        className={cl}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel ? getI18Ntext(ariaLabel) : undefined}
      >
        {children}
      </a>
    ),
  };

  return content[tag] || children;
};

export default Button;
