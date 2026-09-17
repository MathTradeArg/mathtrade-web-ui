"use client";
import useFooter from "./useFooter";
import OrderBy from "@/components/orderBy";
import I18N, { getI18Ntext } from "@/i18n";
import clsx from "clsx";
import AutocompleteButton from "./autocomplete";
import { LoadingBox } from "@/components/loading";
import Wrapper from "@/components/wrapper";
import ListToolbar from "@/components/list-toolbar";
import ListSearch from "@/components/list-toolbar/search";
import { useOptions } from "@/store";
import { useContext } from "react";
import { GotoTopContext } from "@/context/goto-top";
import useSidebarNav from "@/components/sidebar/useSidebarNav";

const Footer = () => {
  const { emptyWants, enabledBtn, changesCount, onClick, loading } =
    useFooter();
  const { gotoTop } = useContext(GotoTopContext);
  const { collapsed } = useSidebarNav();
  const filters = useOptions((state) => state.filters_wants);
  const updateFilters = useOptions((state) => state.updateFilters);

  if (emptyWants) {
    return null;
  }
  return (
    <>
      {loading ? null : (
        <div
          className={clsx(
            "fixed z-50 right-0 left-0 pb-3 transition-[left] duration-300 ease-out motion-reduce:transition-none",
            "bottom-[calc(3.5rem+env(safe-area-inset-bottom))] lg:bottom-0",
            collapsed ? "lg:left-[76px]" : "lg:left-[260px]"
          )}
        >
          <Wrapper>
            <ListToolbar
              className="rounded-main border border-gray-200 shadow-sm max-w-full min-w-0"
              search={
                <ListSearch
                  value={filters?.keyword || ""}
                  onChange={(keyword) => {
                    gotoTop();
                    updateFilters(
                      { keyword: keyword || undefined },
                      "wants"
                    );
                  }}
                />
              }
              sort={
                <OrderBy
                  type="wants"
                  options={[
                    { text: getI18Ntext("element.Type"), value: "type" },
                    { text: getI18Ntext("element.Name"), value: "name" },
                    { text: getI18Ntext("element.Value"), value: "value" },
                    {
                      text: getI18Ntext("element.MostWanted"),
                      value: "most_wanted",
                    },
                  ]}
                />
              }
              trailing={
                <>
                  <AutocompleteButton />
                  {changesCount > 0 ? (
                    <span className="text-amber-700 text-caption font-semibold hidden md:block whitespace-nowrap">
                      <I18N
                        id={
                          changesCount === 1
                            ? "MyWants.unsavedChanges.1"
                            : "MyWants.unsavedChanges.more"
                        }
                        values={[changesCount]}
                      />
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className={clsx(
                      "h-[34px] rounded-full outline-none transition-colors px-4 text-body font-bold whitespace-nowrap",
                      enabledBtn
                        ? "bg-want text-white hover:opacity-80"
                        : "bg-gray-200 text-gray-400"
                    )}
                    onClick={onClick}
                    disabled={!enabledBtn}
                  >
                    <I18N id="MyWants.btn.Save" />
                  </button>
                </>
              }
            />
          </Wrapper>
        </div>
      )}
      <LoadingBox loading={loading} />
    </>
  );
};

export default Footer;
