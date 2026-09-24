import { useContext } from "react";
import { PageContext } from "@/context/page";
import MyGroupsInItemUI from "./ui";

const MyGroupsInItem = ({ className }) => {
  /* PAGE CONTEXT **********************************************/
  const { pageType } = useContext(PageContext);
  /* end PAGE CONTEXT *********************************************/

  // Shown even with no groups yet: it's the in-context hint that grouping
  // exists, and offers to create the first group.
  return pageType === "myOffer" ? (
    <MyGroupsInItemUI className={className} />
  ) : null;
};

export default MyGroupsInItem;
