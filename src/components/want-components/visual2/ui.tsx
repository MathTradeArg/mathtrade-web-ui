"use client";
import I18N from "@/i18n";
import TradeArrows from "@/components/svg/trade-arrows";
import ItemVisual2 from "./item";
import WantListVisual2 from "./wantList";

const VisualSectionUI = ({ item = null }) => {
  return (
    <div className="flex border-t border-gray-200 py-4">
      <div>
        <h3 className="text-caption font-bold text-gray-500 mb-2 tracking-wide">
          <I18N id="wantview.InchangeOf" />
        </h3>
        <div className="sticky top-14">
          <div className="flex items-start">
            <ItemVisual2 itemRaw={item} />
            <TradeArrows />
          </div>
        </div>
      </div>
      <div className="grow">
        <h3 className="text-caption font-bold text-gray-500 mb-2 tracking-wide">
          <I18N id="wantview.IwantToReceive" />
        </h3>
        <WantListVisual2 item={item} />
      </div>
    </div>
  );
};

export default VisualSectionUI;
