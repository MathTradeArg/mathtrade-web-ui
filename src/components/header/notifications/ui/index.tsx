"use client";
import { useCallback, useState, useContext, useMemo } from "react";
import { NotificationsContext } from "@/context/notifications";
import HeadContent from "../../head-content";
import HeadButton from "../../head-button";
import clsx from "clsx";
import I18N from "@/i18n";
import Icon from "@/components/icon";
import List from "./list";
import useBulkReadNotifications from "./useBulkReadNotifications";
import { LoadingBox } from "@/components/loading";
import { fadeLabelClass } from "@/components/sidebar/fadeLabel";

const Tab = ({ name, id, tabSelected, setTabSelected, num }) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 px-3 cursor-pointer hover:opacity-60 font-bold border-b-2 relative top-[1px]",
        {
          "text-gray-400 border-transparent": id !== tabSelected,
          "text-black border-primary": id === tabSelected,
        }
      )}
      onClick={() => {
        setTabSelected(id);
      }}
    >
      <div className="text-xs">
        <I18N id={`notifications.tab.${name}`} />
      </div>

      {num ? (
        <div className="bg-primary text-white text-[9px] min-w-4 rounded-full text-center px-1">
          {num}
        </div>
      ) : null}
    </div>
  );
};

type NotificationsButtonProps = {
  // "row" renders an icon + badge + label row, for the sidebar's utility row.
  variant?: "header" | "row";
  placement?: "below" | "right";
  // "dark" for the black sidebar, "light" for the white mobile sheet.
  tone?: "dark" | "light";
  collapsed?: boolean;
};

const NotificationsButton = ({
  variant = "header",
  placement = "below",
  tone = "dark",
  collapsed = false,
}: NotificationsButtonProps = {}) => {
  const [tabSelected, setTabSelected] = useState(0);

  /* CONTEXT *************************************************/
  const {
    itemNotifUnread,
    //
    wantNotifUnread,
    //
    adminNotifUnread,
    //
    visibleMobile,
    toggleMobile,
    //
    membership,
  } = useContext(NotificationsContext);
  /* end CONTEXT *************************************************/

  const { tabList, num } = useMemo(() => {
    const tabsAdmin = [
      {
        name: "admin",
        num: adminNotifUnread,
      },
    ];

    if (membership) {
      return {
        tabList: [
          {
            name: "item",
            num: itemNotifUnread,
          },
          {
            name: "want",
            num: wantNotifUnread,
          },
          ...tabsAdmin,
        ],
        num: itemNotifUnread + wantNotifUnread + adminNotifUnread,
      };
    }

    return {
      tabList: tabsAdmin,
      num: adminNotifUnread,
    };
  }, [membership, itemNotifUnread, wantNotifUnread, adminNotifUnread]);

  const { setNotificationsBulkReaded, loading } = useBulkReadNotifications();

  return (
    <div className="relative">
      {variant === "row" ? (
        <button
          className={clsx(
            "flex items-center w-full cursor-pointer peer text-sm py-2 rounded-lg",
            collapsed ? "justify-center px-0" : "text-left px-2",
            tone === "light"
              ? "text-gray-900 hover:bg-gray-50"
              : "text-white/80 hover:text-white hover:bg-white/5"
          )}
          onClick={toggleMobile}
        >
          <span className="relative text-lg shrink-0">
            <Icon type="notifications" />
            {num ? (
              <span className="absolute -top-1 -right-1.5 bg-danger text-white text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
                {num > 9 ? "9+" : num}
              </span>
            ) : null}
          </span>
          <span className={fadeLabelClass(!collapsed)}>
            <I18N id="title.Notifications" />
          </span>
        </button>
      ) : (
        <HeadButton onClick={toggleMobile} icon="notifications" num={num} />
      )}

      <HeadContent
        visibleMobile={visibleMobile}
        toggleMobile={toggleMobile}
        placement={placement}
      >
        <div
          className={clsx("relative", {
            "min-h-40": loading,
          })}
        >
          {!loading && num > 0 ? (
            <button
              className="flex gap-3 text-xs p-2 hover:opacity-70 transition-opacity"
              onClick={setNotificationsBulkReaded}
            >
              <div className="text-gray-300">
                <Icon type="circle" />
              </div>
              <div className="text-gray-400 italic">
                <I18N id="notifications.all.MarkAsRead" />
              </div>
            </button>
          ) : null}

          <div className="border-b border-gray-300  pt-3">
            <div className="flex items-end">
              {tabList.map(({ name, num }, k) => {
                return (
                  <Tab
                    name={name}
                    key={name}
                    id={k}
                    tabSelected={tabSelected}
                    setTabSelected={setTabSelected}
                    num={num}
                  />
                );
              })}
            </div>
          </div>
          {!loading ? (
            membership ? (
              <>
                {tabSelected === 0 ? (
                  <List type="item" />
                ) : tabSelected === 1 ? (
                  <List type="want" />
                ) : (
                  <List type="admin" />
                )}
              </>
            ) : (
              <List type="admin" noMembership />
            )
          ) : (
            <LoadingBox loading />
          )}
        </div>
      </HeadContent>
    </div>
  );
};
export default NotificationsButton;
