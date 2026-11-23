"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LoadingBox } from "@/components/loading";
import { routeGate } from "@/config/eventMode";
import useEventMode from "./useEventMode";
import EventModeLockedScreen from "./EventModeLockedScreen";

// Route guard of the private layout: a page closed during the event is not
// mounted (so it fires no request); the locked screen shows instead. While
// current/ hasn't answered, closed routes wait.
const EventModeGuard = ({ children }: { children: ReactNode }) => {
  const { eventMode, isAdmin } = useEventMode();
  const pathname = usePathname();
  const gate = routeGate({ eventMode, isAdmin, pathname });
  if (gate === "loading") return <LoadingBox loading />;
  if (gate === "blocked") return <EventModeLockedScreen />;
  return <>{children}</>;
};

export default EventModeGuard;
