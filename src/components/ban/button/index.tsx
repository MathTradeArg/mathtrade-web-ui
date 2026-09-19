"use client";
import { useContext } from "react";
import { ItemContext } from "@/context/item";
import BanButtonUI from "./ui";

const BanButton = ({ className = "", type = "item", size: _size = "md" }) => {
  const { item } = useContext(ItemContext);

  return item?.isOwned ? null : (
    <BanButtonUI className={className} type={type} />
  );
};

export default BanButton;
