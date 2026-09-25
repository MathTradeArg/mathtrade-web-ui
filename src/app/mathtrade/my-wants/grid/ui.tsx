"use client";
import useGrid from "./useGrid";
import WantGroupLabel from "@/components/want-components/grid/wantGroupLabel";
import MyItemLabel from "@/components/want-components/grid/myItemLabel";
import Cell from "@/components/want-components/grid/cell";
import EmptyList from "@/components/emptyList";
import I18N from "@/i18n";
import { PRIVATE_ROUTES } from "@/config/routes";

const GridUI = () => {
  //  const cols = 15;

  const {
    emptyWants,
    rootRef,
    readyToRender,
    wantList,
    myItemList,
    showNoOptionsAdv,
  } = useGrid();

  if (emptyWants) {
    return (
      <EmptyList
        visible
        message="MyWants.EmptyList"
        icon="heart"
        ctaText="MyWants.EmptyList.cta"
        ctaHref={PRIVATE_ROUTES.OFFER.path}
      />
    );
  }

  return (
    <div className="sticky top-5">
      <div
        className="border-spacing-0 bg-white w-full h-mygrid overflow-scroll pb-8 select-none"
        style={{ contain: "paint" }}
        ref={rootRef}
      >
        {readyToRender ? (
          <table className="grid-table">
            <thead className="sticky z-50 top-0 bg-white">
              <tr className="border-spacing-0">
                {myItemList.map((myItem, k) => {
                  return k === 0 ? (
                    <th key={k} className="border-spacing-0 m-0 p-0 relative">
                      {showNoOptionsAdv ? (
                        <div className="border-b border-r border-gray-300 w-full absolute bottom-0 top-0">
                          <div
                            className="
                        p-3 flex gap-1 justify-center items-center text-xs"
                          >
                            <div className="w-5 h-5 shadow-[inset_0_0_0_3px_red]"></div>
                            <div className="">
                              {"= "}
                              <I18N id="noOptionsInWant" />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </th>
                  ) : (
                    <th key={k} className="border-spacing-0 m-0 p-0">
                      <MyItemLabel rootRef={rootRef} myItem={myItem} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {wantList.map((wantGroup, j) => {
                if (wantGroup.isTagHeader) {
                  return (
                    <tr key={wantGroup._key} className="border-spacing-0">
                      <td
                        colSpan={myItemList.length}
                        className="border-spacing-0 m-0 p-0"
                      >
                        <div
                          className="sticky left-0 w-64 h-6 flex items-center gap-2 px-2 text-xs font-bold border-b border-r border-gray-300 bg-white"
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-gray-300"
                            style={{
                              backgroundColor: wantGroup.tag?.color || "#fff",
                            }}
                          />
                          <span className="cropped_1">
                            {wantGroup.tag ? (
                              wantGroup.tag.name
                            ) : (
                              <I18N id="grid.untagged" />
                            )}{" "}
                            ({wantGroup.count})
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr
                    key={wantGroup._key || wantGroup.id}
                    className="border-spacing-0"
                  >
                    {myItemList.map((myItem, k) => {
                      return k === 0 ? (
                        <td
                          className="border-spacing-0 m-0 p-0 sticky z-40 left-0"
                          key={k}
                        >
                          <WantGroupLabel
                            rootRef={rootRef}
                            wantGroup={wantGroup}
                          />
                        </td>
                      ) : (
                        <Cell
                          rootRef={rootRef}
                          wantGroup={wantGroup}
                          myItem={myItem}
                          key={k}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center pt-5">Cargando...</div>
        )}
      </div>
    </div>
  );
};

export default GridUI;
