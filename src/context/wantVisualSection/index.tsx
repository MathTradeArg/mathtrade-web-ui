"use client";
import { createContext, useState } from "react";

export const WantVisualSectionContext = createContext({
  forceShow: false,
  setForceShow: (_value?: any) => {},
});

export const WantVisualSectionContextProvider = ({ children = null }) => {
  const [forceShow, setForceShow] = useState(false);

  return (
    <WantVisualSectionContext.Provider
      value={{
        forceShow,
        setForceShow,
      }}
    >
      {children}
    </WantVisualSectionContext.Provider>
  );
};
