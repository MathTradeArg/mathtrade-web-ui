"use client";
import { createContext, useState } from "react";

export const GridContext = createContext({
  groupsVisible: {},
  setGroupsVisible: (_value) => {},
  showNoOptionsAdv: false,
  setShowNoOptionsAdv: (_value) => {},
});

export const GridContextProvider = ({ children = null }) => {
  const [groupsVisible, setGroupsVisible] = useState({});
  const [showNoOptionsAdv, setShowNoOptionsAdv] = useState(false);

  return (
    <GridContext.Provider
      value={{
        groupsVisible,
        setGroupsVisible,
        showNoOptionsAdv,
        setShowNoOptionsAdv,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
