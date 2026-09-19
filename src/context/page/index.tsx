"use client";
import { createContext, useState, useCallback, useMemo } from "react";
import useLocations from "@/hooks/useLocations";
import { useStore } from "@/store";
import { NEW_USER_OFFER_LIMIT } from "@/config/newUserOfferLimit";
import { REFERRAL_LIMIT } from "@/config/referral";

export const PageContext = createContext({
  updateMathtrade: (_value?: any) => {},
  pageType: null,
  setPageType: (_value?: any) => {},
  reloadValue: 1,
  forceReloadPage: (_value?: any) => {},
  //
  items: { list: [], count: 0 },
  setItems: (_value?: any) => {},
  games: { list: [], count: 0 },
  setGames: (_value?: any) => {},
  myCollection: [],
  myCollectionFiltered: [],
  myCollectionList: [],
  setMyCollection: (_value?: any) => {},
  myCollectionBGGids: [],
  setMyCollectionBGGids: (_value?: any) => {},
  myItemsInMT: [],
  setMyItemsInMT: (_value?: any) => {},
  myItemsInMT_forWants: [],
  setMyItemsInMT_forWants: (_value?: any) => {},
  myGroups: [],
  setMyGroups: (_value?: any) => {},
  myGroups_forWants: [],
  setMyGroups_forWants: (_value?: any) => {},
  myWants: [],
  setMyWants: (_value?: any) => {},
  loadingMyWants: false,
  setLoadingMyWants: (_value?: any) => {},
  newMyWantsNum: 0,
  setNewMyWantsNum: (_value?: any) => {},
  wantsNumPosition: null,
  setWantsNumPosition: (_position?: any) => {},
  //
  itemTags: [],
  setItemTags: (_value?: any) => {},
  users: [],
  setUsers: (_value?: any) => {},
  loadingUsers: false,
  setLoadingUsers: (_value?: any) => {},
  //
  mathtrade: null,
  mathTradeId: null,
  membership: null,
  userId: "",
  user: null,
  //
  showBanUsers: false,
  setShowBanUsers: (_value?: any) => {},
  //
  itemPreviewId: null,
  setItemPreviewId: (_value?: any) => {},
  customMathtradeId: null,
  setCustomMathtradeId: (_value?: any) => {},
  showModalPreview: false,
  setShowModalPreview: (_value?: any) => {},
  //
  canI: {
    sign: false,
    invite: false,
    offer: false,
    want: false,
    commit: false,
    results: false,
    provisionalResults: false,
    selfExclude: false,
  },
  //
  previewWantGroupId: null,
  setPreviewWantGroupId: (_value?: any) => {},
  previewWantGroup: null,
  setPreviewWantGroup: (_value?: any) => {},
  showPreviewWantGroupModal: false,
  setShowPreviewWantGroupModal: (_value?: any) => {},
  tooglePreviewWantGroupModal: (_value?: any) => {},
  //
  filterData: {} as Record<string, any>,
  setFilterData: (_value?: any) => {},
  //
  mustConfirm: false,
  setMustConfirm: (_value?: any) => {},
  mustConfirmDate: null,
  setMustConfirmDate: (_value?: any) => {},
  isNewUser: false,
  isUserEarlyPay: false,
  mathtrade_history: [],
  //
  referrer: null,
  isReferrer: false,
  referring_limit: REFERRAL_LIMIT,
});

const PageContextProvider = ({ children = null }) => {
  const {
    mathtrade: mathtradeStored,
    membership,
    user,
    mathtrade_history,
  } = useStore((state) => state.data);

  const referrer = user?.referrer || null;
  const referring_limit = user?.referring_limit || REFERRAL_LIMIT;

  const [pageType, setPageType] = useState(null);
  const [items, setItems] = useState({ list: [], count: 0 });
  const [games, setGames] = useState({ list: [], count: 0 });
  const [myCollection, setMyCollection] = useState([]);
  const [myCollectionBGGids, setMyCollectionBGGids] = useState([]);
  const [myItemsInMT, setMyItemsInMT] = useState([]);
  const [myItemsInMT_forWants, setMyItemsInMT_forWants] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [myGroups_forWants, setMyGroups_forWants] = useState([]);
  const [myWants, setMyWants] = useState([]);
  const [loadingMyWants, setLoadingMyWants] = useState(false);
  const [newMyWantsNum, setNewMyWantsNum] = useState(0);
  const [wantsNumPosition, setWantsNumPosition] = useState(null);
  const [itemTags, setItemTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [showBanUsers, setShowBanUsers] = useState(false);

  const [itemPreviewId, setItemPreviewId] = useState(null);
  const [customMathtradeId, setCustomMathtradeId] = useState(null);
  const [showModalPreview, setShowModalPreview] = useState(false);

  const [reloadValue, setReload] = useState(1);
  const forceReloadPage = useCallback(() => {
    setReload(Date.now());
  }, []);

  const [mathtradeUpdated, updateMathtrade] = useState<any>({});

  const isReferrer = useMemo(() => {
    return referrer && membership && mathtradeStored;
  }, [referrer, membership, mathtradeStored]);

  const mathtrade = useMemo(() => {
    return { ...mathtradeStored, ...mathtradeUpdated };
  }, [mathtradeStored, mathtradeUpdated]);

  const canI = useMemo(() => {
    const closed = {
      sign: false,
      invite: false,
      offer: false,
      want: false,
      commit: false,
      results: false,
      provisionalResults: false,
      selfExclude: false,
      pageType,
    };

    if (!mathtrade || mathtrade.status === "freeze") {
      return closed;
    }

    if (user?.math_admin) {
      // Admins can see every phase's UI regardless of the real date/
      // membership — the backend still rejects writes (POST/PUT) unless
      // the phase is genuinely open, so this only affects what's visible,
      // not what actually saves.
      return {
        sign: false,
        invite: true,
        offer: true,
        want: true,
        commit: true,
        results: true,
        provisionalResults: true,
        selfExclude: false,
        pageType,
      };
    }

    const $now = new Date().getTime();

    const dateMs = (value: unknown) => {
      if (!value) return NaN;
      const ms = new Date(value as string).getTime();
      return Number.isFinite(ms) ? ms : NaN;
    };

    const $dates = [
      "start_date",
      "freeze_geek_date",
      "freeze_wants_date",
      "provisional_results_date",
      "meeting_date",
      "show_results_date",
    ].reduce((obj: Record<string, number>, dateName) => {
      obj[dateName] = dateMs(mathtrade[dateName]);
      return obj;
    }, {});

    const offer = $now >= $dates.start_date && $now < $dates.freeze_geek_date;
    const want =
      $now >= $dates.freeze_geek_date && $now < $dates.freeze_wants_date;
    const commit = want;
    const provisionalResults =
      Number.isFinite($dates.provisional_results_date) &&
      $now >= $dates.provisional_results_date;
    const results =
      Number.isFinite($dates.show_results_date) &&
      $now >= $dates.show_results_date &&
      (!Number.isFinite($dates.freeze_wants_date) ||
        $now >= $dates.freeze_wants_date);

    if (!membership) {
      return {
        sign: offer,
        invite: offer,
        offer,
        want,
        commit,
        results,
        provisionalResults,
        selfExclude: false,
        pageType,
      };
    }

    return {
      sign: false,
      invite: offer,
      offer,
      want,
      commit,
      results,
      provisionalResults,
      selfExclude:
        provisionalResults && !results && !membership.self_excluded,
      pageType,
    };
  }, [mathtrade, membership, pageType, user]);

  //

  //
  const [previewWantGroupId, setPreviewWantGroupId] = useState(null);
  const [previewWantGroup, setPreviewWantGroup] = useState(null);
  const [showPreviewWantGroupModal, setShowPreviewWantGroupModal] =
    useState(false);
  const tooglePreviewWantGroupModal = useCallback(() => {
    setShowPreviewWantGroupModal((v) => !v);
  }, []);

  const [filterData, setFilterData] = useState<Record<string, any>>({});

  const [mustConfirm, setMustConfirm] = useState(false);
  const [mustConfirmDate, setMustConfirmDate] = useState(null);

  useLocations();

  /* CollectionFILTERED ********************************************/
  const { myCollectionFiltered, myCollectionList } = useMemo(() => {
    const listElementIds = myItemsInMT.reduce((arr, { elements }) => {
      elements.forEach((element) => {
        arr.push(`${element.element.id}`);
      });
      return arr;
    }, []);

    const collFilter = myCollection.filter((element) => {
      return listElementIds.indexOf(`${element.id}`) < 0;
    });

    const collFilterList = collFilter.map(({ name: text, id, thumbnail }) => {
      return { text, value: `${id}`, thumbnail };
    });

    return {
      myCollectionFiltered: collFilter,
      myCollectionList: collFilterList,
    };
  }, [myCollection, myItemsInMT]);

  /* end CollectionFILTERED ********************************************/

  const isNewUser = useMemo(() => {
    return NEW_USER_OFFER_LIMIT && mathtrade_history.length === 0;
  }, [mathtrade_history]);

  const isUserEarlyPay = useMemo(() => {
    return user?.comment && user.comment.indexOf("early-pay") >= 0;
  }, [user]);

  return (
    <PageContext.Provider
      value={{
        updateMathtrade,
        pageType,
        setPageType,
        //
        reloadValue,
        forceReloadPage,
        //
        items,
        setItems,
        games,
        setGames,
        myCollection,
        myCollectionFiltered,
        myCollectionList,
        setMyCollection,
        myCollectionBGGids,
        setMyCollectionBGGids,
        myItemsInMT,
        setMyItemsInMT,
        myItemsInMT_forWants,
        setMyItemsInMT_forWants,
        myGroups,
        setMyGroups,
        myGroups_forWants,
        setMyGroups_forWants,
        myWants,
        setMyWants,
        loadingMyWants,
        setLoadingMyWants,
        newMyWantsNum,
        setNewMyWantsNum,
        wantsNumPosition,
        setWantsNumPosition,
        //
        itemTags,
        setItemTags,
        users,
        setUsers,
        loadingUsers,
        setLoadingUsers,
        //
        mathtrade,
        membership,
        mathTradeId: mathtrade && mathtrade.id ? mathtrade.id : null,
        userId: user && user.id ? user.id : "",
        user,
        //
        showBanUsers,
        setShowBanUsers,
        //
        itemPreviewId,
        setItemPreviewId,
        customMathtradeId,
        setCustomMathtradeId,
        showModalPreview,
        setShowModalPreview,
        //
        canI,
        /* canI: {
          offer: true,
          want: true,
          commit: true,
          results: true,
        }, */
        //
        previewWantGroupId,
        setPreviewWantGroupId,
        previewWantGroup,
        setPreviewWantGroup,
        showPreviewWantGroupModal,
        setShowPreviewWantGroupModal,
        tooglePreviewWantGroupModal,
        //
        filterData,
        setFilterData,
        mustConfirm,
        setMustConfirm,
        mustConfirmDate,
        setMustConfirmDate,
        //
        isNewUser,
        isUserEarlyPay,
        mathtrade_history,
        //
        referrer,
        isReferrer,
        referring_limit,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export default PageContextProvider;
