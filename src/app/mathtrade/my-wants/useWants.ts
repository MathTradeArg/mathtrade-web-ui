import { useContext, useCallback, useState, useEffect, useMemo } from "react";
import { useOptions } from "@/store";
import { PageContext } from "@/context/page";
import { MyWantsContext } from "@/context/myWants/all";
import useFetch from "@/hooks/useFetch";
import { DateIntlFormat } from "@/utils/dateUtils";

const useWants = () => {
  const options = useOptions((state) => state.options);
  const updateOptions = useOptions((state) => state.updateOptions);
  const [screenView, setScreenView] = useState(options?.screenView || 0);
  useEffect(() => {
    updateOptions({
      screenView,
    });
  }, [updateOptions, screenView]);

  const {
    myWants,
    setMyWants,
    setMyItemsInMT_forWants,
    userId,
    setMyGroups_forWants,
    setMustConfirm,
    setMustConfirmDate,
  } = useContext(PageContext);

  const {
    setMatchValues,
    setChanges,
    setDeletedWantgroupIds,
    setIsLoadedWants,
  } = useContext(MyWantsContext);

  const afterLoadMyWants = useCallback(
    ({ results }) => {
      setMyWants(results);
      setIsLoadedWants(true);
      setChanges({});
      setDeletedWantgroupIds({});
    },
    [setIsLoadedWants, setMyWants, setChanges, setDeletedWantgroupIds]
  );
  const myWantsParams = useMemo(() => ({ page_size: 200 }), []);
  const [, , loadingMyWants, errorMyWants] = useFetch({
    endpoint: "MYWANTS",
    autoLoad: true,
    initialState: { results: [] },
    params: myWantsParams,
    afterLoad: afterLoadMyWants,
  });

  const afterLoadMyItems = useCallback(
    (newMyItemsInMT) => {
      setMyItemsInMT_forWants(newMyItemsInMT);
      setChanges({});
    },
    [setMyItemsInMT_forWants, setChanges]
  );
  const [, , loadingMyItemsInMT, errorMyItemsInMT] = useFetch({
    endpoint: "GET_MYITEMS",
    autoLoad: true,
    initialState: [],
    afterLoad: afterLoadMyItems,
  });

  useEffect(() => {
    const newMatchValues = (myWants || []).reduce((obj, wantGroup) => {
      const { id, items } = wantGroup;
      (items || []).forEach((itemId) => {
        obj[`${id}_${itemId}`] = true;
      });
      return obj;
    }, {});

    setMatchValues(newMatchValues);
  }, [myWants, setMatchValues]);

  const afterLoadMyGroups = useCallback(
    (newGroups) => {
      setMyGroups_forWants(newGroups);
    },
    [setMyGroups_forWants]
  );
  const [loadMyGropus, , loadingMyGropus, errorGropusMyGropus] = useFetch({
    endpoint: "GET_MYITEM_GROUPS",
    initialState: [],
    afterLoad: afterLoadMyGroups,
  });
  useEffect(() => {
    if (screenView === 1) {
      loadMyGropus();
    }
  }, [loadMyGropus, screenView]);

  const afterLoadMyUser = useCallback(
    (user) => {
      if (typeof user.commitment !== "undefined") {
        setMustConfirm(!user.commitment);
      }
      if (
        typeof user.commitment_datetime !== "undefined" &&
        user.commitment_datetime !== null
      ) {
        setMustConfirmDate(DateIntlFormat(user.commitment_datetime));
      }
    },
    [setMustConfirm, setMustConfirmDate]
  );

  const urlUserParams = useMemo(() => {
    return [userId];
  }, [userId]);

  const [, , loadingMyUser, errorMyUser] = useFetch({
    endpoint: "GET_MATHTRADE_USER",
    urlParams: urlUserParams,
    afterLoad: afterLoadMyUser,
    autoLoad: true,
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.keyCode === 35) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return {
    screenView,
    setScreenView,
    loading:
      loadingMyWants || loadingMyItemsInMT || loadingMyGropus || loadingMyUser,
    error:
      errorMyWants || errorMyItemsInMT || errorGropusMyGropus || errorMyUser,
  };
};

export default useWants;
