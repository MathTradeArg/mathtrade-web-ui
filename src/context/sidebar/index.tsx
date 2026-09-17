"use client";
import { createContext, useCallback, useEffect, useState } from "react";
import { useOptions } from "@/store";

export const SidebarContext = createContext({
  name: null,
  visibleSidebar: false,
  toggleSidebar: (_value?: any) => {},
  hideSidebar: (_value?: any) => {},
  closeSidebar: (_value?: any) => {},
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
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
