import { createContext, useState, useContext } from "react";
import { PageContext } from "../page";
import useExclusiveMobilePanel from "@/components/header/head-content/useExclusiveMobilePanel";

export const NotificationsContext = createContext({
  itemNotifUnread: 0,
  setItemNotifUnread: () => {},
  //
  wantNotifUnread: 0,
  setWantNotifUnread: () => {},
  //
  adminNotifUnread: 0,
  setAdminNotifUnread: () => {},
  //
  visibleMobile: false,
  toggleMobile: () => {},
  //
  membership: null,
});

export const NotificationsContextProvider = ({ children }) => {
  const { membership } = useContext(PageContext);

  const [itemNotifUnread, setItemNotifUnread] = useState(0);
  //
  const [wantNotifUnread, setWantNotifUnread] = useState(0);
  //
  const [adminNotifUnread, setAdminNotifUnread] = useState(0);
  //
  // Full-screen panel on mobile: opening it closes the other panels.
  const { visibleMobile, toggleMobile } =
    useExclusiveMobilePanel("notifications");

  return (
    <NotificationsContext.Provider
      value={{
        itemNotifUnread,
        setItemNotifUnread,
        //
        wantNotifUnread,
        setWantNotifUnread,
        //
        adminNotifUnread,
        setAdminNotifUnread,
        //
        visibleMobile,
        toggleMobile,
        //
        membership,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
