import { useEffect, useState } from "react";
import useSignOut from "@/hooks/useSignOut";
import useExclusiveMobilePanel from "@/components/header/head-content/useExclusiveMobilePanel";

const useHeaderAccount = () => {
  const [show, setShow] = useState(false);
  const { visibleMobile, toggleMobile } = useExclusiveMobilePanel("account");

  const signOut = useSignOut();

  useEffect(() => {
    setShow(true);
  }, []);

  return { show, visibleMobile, toggleMobile, signOut };
};
export default useHeaderAccount;
