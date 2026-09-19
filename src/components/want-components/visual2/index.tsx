"use client";
import { WantVisualSectionContextProvider } from "@/context/wantVisualSection";
import VisualSectionContainer from "./container";

const VisualSection2 = ({ item = null }) => {
  return (
    <WantVisualSectionContextProvider>
      <VisualSectionContainer item={item} />
    </WantVisualSectionContextProvider>
  );
};
export default VisualSection2;
