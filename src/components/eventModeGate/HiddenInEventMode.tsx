"use client";
import type { ReactNode } from "react";
import useEventMode from "./useEventMode";

// Renders its children unless event mode restricts the user (flag on, or not
// known yet). Banners and modals wrapped here ask closed endpoints on mount.
const HiddenInEventMode = ({ children }: { children: ReactNode }) => {
  const { restricted } = useEventMode();
  return restricted ? null : <>{children}</>;
};

export default HiddenInEventMode;
