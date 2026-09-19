"use client";
import { WantVisualSectionContextProvider } from "@/context/wantVisualSection";
import VisualSectionContainer from "./container";

const VisualSection = ({ wantGroup = null, myItemList = [] }) => {
  return (
    <WantVisualSectionContextProvider>
      <VisualSectionContainer wantGroup={wantGroup} myItemList={myItemList} />
    </WantVisualSectionContextProvider>
  );
};

export default VisualSection;
