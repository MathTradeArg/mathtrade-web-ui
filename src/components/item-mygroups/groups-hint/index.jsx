"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import { SidebarContext } from "@/context/sidebar";
import { useOptions } from "@/store";
import HelpContext from "@/components/help-context";
import Icon from "@/components/icon";
import I18N from "@/i18n";

/* On "Mi oferta", with no group selected: surface what groups are and a way
 * to create one, since the "Mis grupos" panel starts closed. */
const GroupsHint = () => {
  const { canI } = useContext(PageContext);
  const { openSidebar, setIntent } = useContext(SidebarContext);
  const groupId = useOptions((state) => state.filters_myoffer?.groupId);

  if (groupId || !(canI.offer || canI.want)) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <HelpContext id="whatAreGroups" />
      <button
        type="button"
        className="flex items-center gap-1 text-primary text-sm font-bold hover:underline"
        onClick={() => {
          setIntent("newGroup");
          openSidebar();
        }}
      >
        <Icon type="plus" />
        <I18N id="myGroups.hint.create" />
      </button>
    </div>
  );
};

export default GroupsHint;
