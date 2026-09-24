import Icon from "@/components/icon";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/sidebar";
import GroupEditor from "./editor";
import I18N from "@/i18n";

const NewGroup = () => {
  const [visibleEdit, setVisibleEdit] = useState(false);
  const { intent, setIntent } = useContext(SidebarContext);

  // "Crear un grupo" from the page or an item card opens the sidebar with
  // this editor already open.
  useEffect(() => {
    if (intent === "newGroup") {
      setVisibleEdit(true);
      setIntent(null);
    }
  }, [intent, setIntent]);

  return visibleEdit ? (
    <GroupEditor
      onClose={() => {
        setVisibleEdit(false);
      }}
    />
  ) : (
    <div className="p-3">
      <button
        className="mx-auto flex justify-center items-center text-primary hover:opacity-80"
        onClick={() => {
          setVisibleEdit(true);
        }}
      >
        <Icon type="plus" />
        <I18N id="myItems.sidebar.AddGroup" />
      </button>
    </div>
  );
};

export default NewGroup;
