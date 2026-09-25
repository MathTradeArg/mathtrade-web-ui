"use client";
import { useCallback, useContext } from "react";
import clsx from "clsx";
import { ItemContext } from "@/context/item";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";
import InnerButton from "@/components/button/inner-button";
import { colorTagStyles } from "@/utils/color";

/* "Lo quiero" on an item that has a tag: the tag is the want, so wanting the
 * item adds it to the tag's want (and "Ya no lo quiero" takes it out, keeping
 * the tag), instead of creating a separate want that could bring a duplicate. */
const BtnTagWant = () => {
  const { itemTag, tagWant, wantedViaTag, item } = useContext(ItemContext);
  const { setMyWants, forceReloadPage } = useContext(PageContext);

  // Update the tag's want locally from the result: one call per click, no
  // reload of wants or items.
  const applyLocally = useCallback(
    (wanted) => {
      // A tag created in this session isn't in the loaded wants yet: reload.
      if (!tagWant) {
        forceReloadPage();
        return;
      }
      setMyWants((wants) =>
        wants.map((w) => {
          if (w.id !== tagWant.id) return w;
          const others = (w.wants || []).filter((itm) => itm.id !== item.id);
          return {
            ...w,
            wants: wanted ? [...others, { id: item.id, title: item.title }] : others,
          };
        })
      );
    },
    [tagWant, item, setMyWants, forceReloadPage]
  );

  const [consolidate, , loadingAdd, errorAdd] = useFetch({
    endpoint: "POST_TAG_CONSOLIDATE",
    method: "POST",
    afterLoad: useCallback(() => applyLocally(true), [applyLocally]),
  });
  const [unconsolidate, , loadingRemove, errorRemove] = useFetch({
    endpoint: "POST_TAG_UNCONSOLIDATE",
    method: "POST",
    afterLoad: useCallback(() => applyLocally(false), [applyLocally]),
  });

  if (!itemTag) return null;
  const loading = loadingAdd || loadingRemove;
  const params = { urlParams: [itemTag.id], params: { item_id: item.id } };

  return (
    <div className="text-center py-2">
      {wantedViaTag ? (
        <>
          <p className="text-xs text-gray-700 mb-2">
            <I18N id="tagWant.insideTag" values={[itemTag.name]} />
          </p>
          <button
            type="button"
            disabled={loading}
            className="rounded-full px-5 py-2 text-sm font-semibold border border-gray-300 text-gray-600 hover:opacity-75"
            onClick={() => unconsolidate(params)}
          >
            <InnerButton>
              <Icon type={loading ? "loading" : "close"} className="text-base" />
              <I18N id="tagWant.remove" />
            </InnerButton>
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={loading}
          title={getI18Ntext("tagWant.addHelp", [itemTag.name])}
          className={clsx(
            "rounded-full px-5 py-2 text-sm font-semibold bg-want text-white hover:opacity-90",
            { "opacity-50": loading }
          )}
          onClick={() => consolidate(params)}
        >
          <InnerButton>
            <Icon type={loading ? "loading" : "heart"} className="text-base" />
            <I18N id="tagWant.add" values={[itemTag.name]} />
          </InnerButton>
        </button>
      )}
      {errorAdd || errorRemove ? (
        <p className="text-xs text-red-600 mt-2">
          <I18N id="tagWant.error" />
        </p>
      ) : null}
      <div className="mt-2 flex justify-center">
        <span
          className="inline-block w-3 h-3 rounded-full border border-gray-300"
          style={colorTagStyles(itemTag.color)}
        />
      </div>
    </div>
  );
};

export default BtnTagWant;
