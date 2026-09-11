import clsx from "clsx";
import Icon from "@/components/icon";
import { getI18Ntext } from "@/i18n";
import useBanButton from "./useBanButton";

const BanButtonUI = ({ className, type = "item" }) => {
  const { showAsIgnored, onClick, loading, ban_id } = useBanButton(type);
  return (
    <div className={clsx("h-7", className)}>
      <div data-tooltip={getI18Ntext(ban_id ? "unban" : `ban.${type}`)}>
        <button
          className={clsx(
            "font-normal relative cursor-pointer w-7 h-7 flex items-center justify-center transition-colors rounded-full leading-none",
            {
              "text-gray-600": type === "item" && !showAsIgnored && !ban_id,
              "text-white": type === "game" && !showAsIgnored && !ban_id,
              "hover:bg-gray-200":
                type === "item" && !showAsIgnored && !ban_id,
              "hover:bg-white/15":
                type === "game" && !showAsIgnored && !ban_id,
              "text-red-600 bg-red-50": showAsIgnored || ban_id,
            }
          )}
          onClick={onClick}
        >
          <Icon
            type={loading ? "loading" : "trash"}
            className="relative left-[1px]"
          />
          {ban_id ? (
            <div
              className="w-3.5 h-[2px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full -rotate-45 bg-red-600"
            ></div>
          ) : null}
        </button>
      </div>
    </div>
  );
};
export default BanButtonUI;
