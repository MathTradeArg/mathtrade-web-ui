"use client";
import { useCallback, useState, lazy, type ReactNode } from "react";
import ElementView from "./elementView";
import { ElementContextProvider } from "@/context/element";
import Dynamic from "@/components/dynamic";
import Modal from "@/components/modal";

const ElementEditor = lazy(() => import("./editor"));

const ElementCollection = ({
  element = null,
  insideItem = false,
  extraContent = null,
  header = null,
  layout = "poster",
}: {
  element?: any;
  insideItem?: boolean;
  extraContent?: ReactNode;
  header?: ReactNode;
  layout?: "poster" | "row";
}) => {
  // Keep the card visible; the form lives in a modal so the 340px grid cell
  // no longer clips it.
  const [editingMode, setEditingMode] = useState(false);
  const toggleEditingMode = useCallback(() => {
    setEditingMode((v) => !v);
  }, []);

  return (
    <ElementContextProvider elementRaw={element}>
      <ElementView
        toggleEditingMode={toggleEditingMode}
        insideItem={insideItem}
        extraContent={extraContent}
        header={header}
        layout={layout}
      />
      <Modal isOpen={editingMode} onClose={toggleEditingMode} size="md2">
        <Dynamic h={600}>
          <ElementEditor toggleEditingMode={toggleEditingMode} />
        </Dynamic>
      </Modal>
    </ElementContextProvider>
  );
};
export default ElementCollection;
