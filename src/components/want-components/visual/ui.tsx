"use client";
import I18N from "@/i18n";
import ItemList from "./itemList";
import WantGroupUI from "./wantGroup";
import TradeArrows from "@/components/svg/trade-arrows";

const VisualSectionUI = ({ wantGroup = {}, myItemList = [] }) => {
  return (
    <div className="flex border-t border-gray-200 py-4">
      <div>
        <h3 className="text-caption font-bold text-gray-500 mb-2 tracking-wide">
          <I18N id="wantview.IwantToReceive" />
        </h3>
        <div className="sticky top-14">
          <div className="flex items-start">
            <WantGroupUI wantGroup={wantGroup} />
            <TradeArrows />
          </div>
        </div>
      </div>
      <div className="grow">
        <h3 className="text-caption font-bold text-gray-500 mb-2 tracking-wide">
          <I18N id="wantview.InchangeOf" />
        </h3>
        <ItemList wantGroup={wantGroup} myItemList={myItemList} />
      </div>
    </div>
  );
};

export default VisualSectionUI;
