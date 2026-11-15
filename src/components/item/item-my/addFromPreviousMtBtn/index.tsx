import { useContext } from "react";
import { ItemPreviousMTContext } from "@/context/itemPreviousMT";
import I18N from "@/i18n";

const AddFromPreviousMTBtn = () => {
  const { mathTradePrevious, onOpen } = useContext(ItemPreviousMTContext);

  return mathTradePrevious && mathTradePrevious?.item_count > 0 ? (
    <div className="flex items-center" data-tour="myoffer.previous">
      <div className="px-4 md:block hidden">
        <div className="w-[2px] h-12 bg-line rotate-12"></div>
      </div>
      <div className="">
        <button
          className="text-xs leading-snug text-balance w-52 max-w-full min-h-12 grid place-items-center text-center rounded-card px-3 py-2 bg-brand border border-transparent text-brand-ink font-bold transition hover:brightness-95 relative"
          onClick={onOpen}
        >
          <I18N id="myOfferPreviousMathtrades.page.link" />
          <span className="absolute -top-2 -right-2 block text-[9px] font-bold bg-red-600 text-white px-2 uppercase rounded-sm">
            <I18N id="new" />
          </span>
        </button>
      </div>
    </div>
  ) : null;
};

export default AddFromPreviousMTBtn;
