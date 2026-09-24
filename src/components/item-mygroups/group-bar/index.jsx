"use client";
import { useContext, useMemo, useState } from "react";
import { PageContext } from "@/context/page";
import { useOptions } from "@/store";
import Button from "@/components/button";
import HelpContext from "@/components/help-context";
import InnerButton from "@/components/button/inner-button";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import { colorTagStyles } from "@/utils/color";
import GroupItemsPicker from "../group-items-picker";

/* Shown on "Mi oferta" while a group is selected ("inside the group"): the
 * place to add items to it, instead of the small per-item control. */
const GroupBar = () => {
  const { myGroups, canI } = useContext(PageContext);
  const groupId = useOptions((state) => state.filters_myoffer?.groupId);
  const [pickerOpen, setPickerOpen] = useState(false);

  const group = useMemo(
    () => myGroups.find((g) => g.id === groupId) || null,
    [myGroups, groupId]
  );

  if (!group || !(canI.offer || canI.want)) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-stroke rounded-lg p-3 mb-5 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-3 self-stretch rounded"
          style={{ backgroundColor: colorTagStyles(group.color).backgroundColor }}
        />
        <div className="min-w-0">
          <p className="font-bold uppercase truncate">{group.name}</p>
          <p className="text-sm text-gray-600">
            <I18N id="myGroups.bar.count" values={[group.item_ids.length]} />
          </p>
        </div>
        <HelpContext id="insideGroup" />
      </div>
      <Button type="button" onClick={() => setPickerOpen(true)}>
        <InnerButton>
          <Icon type="plus" />
          <I18N id="myGroups.bar.addItems" />
        </InnerButton>
      </Button>
      {pickerOpen ? (
        <GroupItemsPicker
          group={group}
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default GroupBar;
