import clsx from "clsx";

const ElementWrapperInside = ({ children, padded = true, className = "" }) => {
  return (
    <div
      className={clsx(
        // min-w-0/max-w-full: my-offer row cards (150px thumb + content) used
        // to grow past the viewport; without a bound, flex children never wrap.
        "bg-white rounded-lg border border-gray-400 min-w-0 max-w-full w-full",
        {
          "p-4": padded,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default ElementWrapperInside;
