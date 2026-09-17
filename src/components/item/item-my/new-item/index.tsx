"use client";
import { useContext, lazy } from "react";
import { PageContext } from "@/context/page";
import Dynamic from "@/components/dynamic";

const NewItemProvider = lazy(() => import("./itemProvider"));

const NewItem = () => {
  const { canI } = useContext(PageContext);
  return canI.offer ? (
    <Dynamic h={130}>
      <NewItemProvider />
    </Dynamic>
  ) : null;
};
export default NewItem;
