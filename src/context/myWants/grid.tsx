"use client";
import { createContext, useState } from "react";

export const GridContext = createContext({
  groupsVisible: {},
  setGroupsVisible: (_value) => {},
  // Expanded tag wants (rows), like groupsVisible for item groups (columns).
  tagsVisible: {} as Record<string, boolean>,
  setTagsVisible: (_value) => {},
  showNoOptionsAdv: false,
  setShowNoOptionsAdv: (_value) => {},
});

export const GridContextProvider = ({ children = null }) => {
  const [groupsVisible, setGroupsVisible] = useState({});
  const [tagsVisible, setTagsVisible] = useState({});
  const [showNoOptionsAdv, setShowNoOptionsAdv] = useState(false);

  return (
    <GridContext.Provider
      value={{
        groupsVisible,
        setGroupsVisible,
        tagsVisible,
        setTagsVisible,
        showNoOptionsAdv,
        setShowNoOptionsAdv,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
