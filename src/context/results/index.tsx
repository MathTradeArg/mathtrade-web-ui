import { useContext, createContext, useMemo, useState, type ReactNode } from "react";
import { PageContext } from "@/context/page";

export const ResultsContext = createContext({
  userList: [],
  setUserList: (_list?: any) => {},
  currentUser: null,
  currentUserId: null,
  setCurrentUserId: (_id?: any) => {},
  //
  customMathtradeId: null,
  setCustomMathtradeId: (_id?: any) => {},
  //
  MathTradeResults: null,
  setMathTradeResults: (_results?: any) => {},
  // Label numbers show in Visual and Grilla only after the labels are published.
  showTradeCodes: false,
});

export const ResultsContextProvider = ({
  children,
  showTradeCodes = false,
}: {
  children: ReactNode;
  showTradeCodes?: boolean;
}) => {
  /* PAGE CONTEXT *****************************************/
  const { userId } = useContext(PageContext);
  /* end PAGE CONTEXT *****************************************/

  const [customMathtradeId, setCustomMathtradeId] = useState(null);

  const [userList, setUserList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [MathTradeResults, setMathTradeResults] = useState(null);

  const currentUser = useMemo(() => {
    if (!userList.length || !currentUserId) {
      return null;
    }

    return (
      userList.find((u) => String(u.id) === String(currentUserId)) || null
    );
  }, [userList, currentUserId]);

  return (
    <ResultsContext.Provider
      value={{
        userList,
        setUserList,
        currentUser,
        currentUserId,
        setCurrentUserId,
        //
        customMathtradeId,
        setCustomMathtradeId,
        //
        MathTradeResults,
        setMathTradeResults,
        showTradeCodes,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
