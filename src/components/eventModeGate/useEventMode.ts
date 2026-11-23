"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import { useStore } from "@/store";
import { isEventRestricted } from "@/config/eventMode";

/**
 * Event mode as the backend reports it in current/ (PageContext). `restricted`
 * is also true while the flag is unknown, so nothing that would get a 403
 * mounts before current/ answers.
 */
const useEventMode = () => {
  const { eventMode } = useContext(PageContext);
  const user = useStore((state: any) => state.data?.user);
  const isAdmin = Boolean(user?.math_admin);
  return {
    eventMode,
    isAdmin,
    restricted: isEventRestricted({ eventMode, isAdmin }),
    known: eventMode !== null,
  };
};

export default useEventMode;
