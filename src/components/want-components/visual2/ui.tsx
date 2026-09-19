"use client";
import I18N from "@/i18n";
import TradeArrows from "@/components/svg/trade-arrows";
import ItemVisual2 from "./item";
import WantListVisual2 from "./wantList";

const VisualSectionUI = ({ item = null }) => {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:grid-cols-[auto_auto_minmax(0,1fr)] gap-x-1.5 sm:gap-x-0 border-t border-gray-200 py-4">
      <h3 className="col-start-1 row-start-1 text-caption font-bold text-gray-500 mb-2 tracking-wide">
        <I18N id="wantview.InchangeOf" />
      </h3>
      <h3 className="col-start-3 row-start-1 text-caption font-bold text-gray-500 mb-2 tracking-wide">
        <I18N id="wantview.IwantToReceive" />
      </h3>
      <div className="col-start-1 row-start-2 min-w-0 sticky top-14 self-start">
        <ItemVisual2 itemRaw={item} />
      </div>
      <div className="col-start-2 row-start-2 self-center">
        <TradeArrows padded={false} />
      </div>
      <div className="col-start-3 row-start-2 min-w-0 flex flex-col">
        <WantListVisual2 item={item} />
      </div>
    </div>
  );
};

export default VisualSectionUI;
