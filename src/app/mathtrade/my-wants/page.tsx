"use client";
import MyWantsUI from "./ui";
import { MyWantsContextProvider } from "@/context/myWants/all";
import ModalPreviewerItemWant from "@/components/previewerItem/modal";
import PageHeader from "@/components/pageHeader";
import { useRedirectIfNavLocked } from "@/components/sidebar/useSidebarNav";

export default function MyWants() {
  const locked = useRedirectIfNavLocked("WANTS");

  if (locked) {
    return null;
  }

  return (
    <>
      <PageHeader
        variant="compact"
        title="title.MyWants"
        helpId="page.myWants"
      />
      <MyWantsContextProvider>
        <MyWantsUI />
        <ModalPreviewerItemWant />
      </MyWantsContextProvider>
    </>
  );
}
