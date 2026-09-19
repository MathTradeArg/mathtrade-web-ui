"use client";
import { useContext, lazy } from "react";
import { PageContext } from "@/context/page";
import Dynamic from "@/components/dynamic";

const NewItemProvider = lazy(() => import("./itemProvider"));

const NewItem = () => {
  const { canI, user } = useContext(PageContext);
  // Admins can see the form even outside the real offer window — the
  // backend still rejects the write until the phase is genuinely open.
  return canI.offer || user?.math_admin ? (
    <Dynamic h={130}>
      <NewItemProvider />
    </Dynamic>
  ) : null;
};
export default NewItem;
