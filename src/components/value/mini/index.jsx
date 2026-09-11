import { useMemo } from "react";
import { valueToColor } from "../utils";

const ValueMini = ({ currentValue }) => {
  const { value, backgroundColor } = useMemo(() => {
    const value = parseFloat(currentValue || 0);
    return { value, backgroundColor: valueToColor(value) };
  }, [currentValue]);

  return (
    <div
      className="bg-white font-bold text-[10px] px-1.5 h-5 min-w-5 rounded-full cursor-default text-center leading-5 tracking-tighter border-[1.5px] shadow-sm"
      style={{ borderColor: backgroundColor, color: backgroundColor }}
      title={String(value)}
    >
      {value}
    </div>
  );
};

export default ValueMini;
