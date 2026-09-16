"use client";
import MyWantsUI from "./ui";
import { MyWantsContextProvider } from "@/context/myWants/all";
import { PageContext } from "@/context/page";
import ModalPreviewerItemWant from "@/components/previewerItem/modal";
import PageHeader from "@/components/pageHeader";
import I18N from "@/i18n";
import { useContext } from "react";

export default function MyWants() {
  const { canI } = useContext(PageContext);

  return (
    <>
      <PageHeader
        variant="compact"
        title="title.MyWants"
        helpId="page.myWants"
        alert={
          <div className="flex items-center justify-between gap-3 flex-wrap bg-danger/10 border border-danger/20 text-red-800 rounded-lg px-4 py-2.5 text-body">
            <span>
              <I18N id="myWants.alert" />
            </span>
          </div>
        }
      />
      {canI.offer ? (
        <div className="text-center italic font-bold text-xl text-gray-600 py-4">
          <I18N id="WaitFinishOffer" />
        </div>
      ) : (
        <MyWantsContextProvider>
          <MyWantsUI />
          <ModalPreviewerItemWant />
        </MyWantsContextProvider>
      )}
    </>
  );
}
