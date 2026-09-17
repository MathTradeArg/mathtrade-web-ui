import clsx from "clsx";

export const fadeLabelClass = (show: boolean, extra = "") =>
  clsx(
    "whitespace-nowrap overflow-hidden transition-[opacity,max-width,margin] ease-out motion-reduce:transition-none",
    show
      ? "opacity-100 max-w-[180px] ml-2.5 duration-200 delay-100"
      : "opacity-0 max-w-0 ml-0 duration-150 delay-0",
    extra
  );
