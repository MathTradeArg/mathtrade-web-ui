"use client";
import ItemChange from "./item";
import UserHub, { UserCaption } from "./user";
import I18N from "@/i18n";
import { FlowArrow } from "@/components/svg/trade-arrows";

const ChangeSection = ({ result }: { result: any }) => {
  const {
    item_from,
    item_to,
    membership_from,
    membership_to,
    delivered,
    received,
  } = result || {};

  return (
    <div className="py-5 border-b border-gray-200">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <div>
          <h3 className="text-sm font-bold text-want mb-2">
            <I18N id="results.col.receive" />
          </h3>
          <ItemChange item={item_from} received={received} />
          <UserCaption user={membership_from} side="from" />
        </div>
        <FlowArrow tone="want" />
        <UserHub />
        <FlowArrow tone="give" />
        <div>
          <h3 className="text-sm font-bold text-secondary mb-2">
            <I18N id="results.col.offer" />
          </h3>
          <ItemChange item={item_to} delivered={delivered} />
          <UserCaption user={membership_to} side="to" />
        </div>
      </div>
    </div>
  );
};

export default ChangeSection;
