import { useMemo } from "react";
import { valueToColor } from "../utils";

const ValueMini = ({ currentValue }) => {
  const { value, backgroundColor } = useMemo(() => {
    const value = parseFloat(currentValue || 0);
    return { value, backgroundColor: valueToColor(value) };
  }, [currentValue]);

  return (
    <div
      className="bg-white font-bold text-[9px] w-6 h-6 shrink-0 rounded-full cursor-default flex items-center justify-center tracking-tighter border-[1.5px] shadow-sm"
      style={{ borderColor: backgroundColor, color: backgroundColor }}
      title={String(value)}
    >
      {value}
    </div>
  );
};

export default ValueMini;
