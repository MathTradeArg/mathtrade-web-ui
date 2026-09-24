"use client";
import { createContext, useCallback, useEffect, useState } from "react";
import { useOptions } from "@/store";

export const SidebarContext = createContext({
  name: null,
  visibleSidebar: false,
  toggleSidebar: (_value?: any) => {},
  hideSidebar: (_value?: any) => {},
  closeSidebar: (_value?: any) => {},
  openSidebar: () => {},
  // What the sidebar should do once opened from outside it (e.g. "newGroup"
  // opens the new-group editor); the consumer clears it after acting on it.
  intent: null as string | null,
  setIntent: (_value: string | null) => {},
});

export const SidebarContextProvider = ({ name = null, children = null }) => {
  /* OPTIONS */
  const options = useOptions((state) => state.options);
  const updateOptions = useOptions((state) => state.updateOptions);
  /* end OPTIONS */

  const [visibleSidebar, setVisibleSidebar] = useState(
    options[`sidebar_${name}_visible`] || false
  );

  const toggleSidebar = useCallback(() => {
    setVisibleSidebar((v) => {
      return !v;
    });
  }, []);

  const hideSidebar = useCallback(() => {
    if (window.innerWidth < 1024) {
      setVisibleSidebar(false);
    }
  }, []);

  const closeSidebar = useCallback(() => {
    setVisibleSidebar(false);
  }, []);

  const openSidebar = useCallback(() => {
    setVisibleSidebar(true);
  }, []);

  const [intent, setIntent] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      updateOptions({
        [`sidebar_${name}_visible`]: visibleSidebar,
      });
    }
  }, [updateOptions, name, visibleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        name,
        visibleSidebar,
        hideSidebar,
        closeSidebar,
        toggleSidebar,
        openSidebar,
        intent,
        setIntent,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
