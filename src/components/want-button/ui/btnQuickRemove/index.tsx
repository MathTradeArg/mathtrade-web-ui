import { useCallback, useContext, useMemo } from "react";
import { PageContext } from "@/context/page";
import { WantGroupContext } from "@/context/wantGroup";
import useFetch from "@/hooks/useFetch";
import clsx from "clsx";
import InnerButton from "@/components/button/inner-button";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import ErrorAlert from "@/components/errorAlert";

const BtnQuickRemove = () => {
  /* PAGE CONTEXT **********************************************/
  const { setMyWants, setNewMyWantsNum, canI, setMustConfirm } =
    useContext(PageContext);
  /* end PAGE CONTEXT */

  /* WANT CONTEXT **********************************************/
  const { wantGroup, contextType } = useContext(WantGroupContext);

  const { id } = wantGroup;
  /* end WANT CONTEXT **********************************************/

  /* DELETE *************************************/

  const afterLoad = useCallback(() => {
    setMustConfirm(true);
    setMyWants((oldMyWants) => {
      const oldMyWantsCopy = [...oldMyWants].filter((w) => w.id !== id);
      return oldMyWantsCopy;
    });
    setNewMyWantsNum((n) => {
      return Math.max(0, n - 1);
    });
  }, [setMyWants, setNewMyWantsNum, id, setMustConfirm]);

  const urlParams = useMemo(() => {
    return [id];
  }, [id]);

  const [deleteWant, , loading, error] = useFetch({
    endpoint: "DELETE_MYWANTS",
    urlParams,
    method: "DELETE",
    afterLoad,
  });

  /* end DELETE *************************************/

  if (!canI.want) {
    return (
      <div className="text-center">
        <div
          className={clsx(
            "inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 cursor-not-allowed",
            {
              "bg-white px-3 py-1 rounded-full": contextType === "tag",
            }
          )}
        >
          <Icon type="heart-filled" className="text-base" />
          <I18N id="btn.Want.Wanted" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div
        className={clsx(
          "inline-flex items-center gap-2 text-sm font-semibold text-want",
          {
            "bg-white px-3 py-1 rounded-full": contextType === "tag",
          }
        )}
      >
        <Icon type="heart-filled" className="text-base" />
        <I18N id="btn.Want.Wanted" />
        <span className="text-gray-300 font-normal">·</span>
        <button
          className={clsx(
            "font-normal text-red-600 underline decoration-red-300 underline-offset-2",
            {
              "hover:decoration-red-600": !loading,
              "opacity-40": loading,
            }
          )}
          disabled={loading}
          onClick={deleteWant}
        >
          <InnerButton>
            {loading ? <Icon type="loading" /> : null}
            <I18N id="btn.Want.removeWant.md" />
          </InnerButton>
        </button>
      </div>
      <ErrorAlert error={error} className="mt-2" />
    </div>
  );
};

export default BtnQuickRemove;
