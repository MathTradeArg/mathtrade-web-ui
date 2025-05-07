import Thumbnail from "@/components/thumbnail";
import LinkExternal from "@/components/link-external";
import BGGinfo from "@/components/bggInfo";
import { GameContext } from "@/context/game";
import { useContext } from "react";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";
import Value from "@/components/value";
import WantButton from "@/components/want-button";
import BanButton from "@/components/ban/button";
import clsx from "clsx";
import WantButtonGame from "./wantButtonGame";
import ItemNoBGG from "./itemNoBgg";

const GameGridMD = ({ onToggleExpanse }) => {
  /* GAME CONTEXT **********************************************/
  const { game, gameRaw, showAsIgnored } = useContext(GameContext);

  const {
    ban_id,
    bgg_id,
    title,
    titleLink,
    type,
    thumbnail,
    year,
    items,
    itemCount,
    notGame,
  } = game;
  /* end GAME CONTEXT */

  return (
    <div
      className={clsx(
        "bg-gray-900 h-full  rounded-lg mx-auto lg:p-3 p-2 transition-opacity",
        {
          "opacity-30": showAsIgnored,
        }
      )}
    >
      <div className="flex gap-4 h-full">
        <div className="lg:w-52 w-24">
          <div className="relative">
            <Thumbnail
              elements={[{ thumbnail }]}
              className="rounded-t-lg lg:w-52 w-24"
            />
            <div
              className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-t-lg grid place-content-center backdrop-blur-sm cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              onClick={onToggleExpanse}
            >
              <div className="text-center text-white">
                <Icon type="plus" className="text-5xl" />
                <div className="font-bold uppercase text-xs">
                  <I18N id="Enlarge" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black rounded-b-lg flex items-center justify-end gap-3 p-2">
            <BanButton size="md" type="game" />
            <div className="w-[1px] h-4 bg-gray-400"></div>
            {ban_id ? null : <Value size="md" type="game" />}
          </div>
        </div>
        <div className="text-white flex flex-col h-full justify-between">
          <div>
            <div className="uppercase text-[10px] font-bold opacity-70">
              {type}
            </div>

            <div
              data-tooltip={getI18Ntext("Enlarge")}
              className="cursor-pointer"
              onClick={onToggleExpanse}
            >
              <h3 className="text-lg font-bold cropped hover:opacity-70">
                {`${title}${year ? ` (${year})` : ""}`}
              </h3>
            </div>

            {notGame ? (
              <ItemNoBGG
                itemRaw={items[0] || null}
                bgg_id={bgg_id}
                title={title}
              />
            ) : (
              <div className="py-3">
                <div className="py-3 border-b border-t border-gray-700">
                  <BGGinfo game={gameRaw} bggLink={titleLink} />
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            {notGame ? null : (
              <div data-tooltip={getI18Ntext("Enlarge")}>
                <div
                  className="text-xs opacity-50 mb-2 cursor-pointer"
                  onClick={onToggleExpanse}
                >
                  {`${itemCount} `}
                  <I18N
                    id={
                      itemCount === 1 ? "game.item-num.1" : "game.item-num.more"
                    }
                  />
                </div>
              </div>
            )}
            <WantButtonGame
              ban_id={ban_id}
              contextSize="md"
              notGame={notGame}
              itemRaw={items[0] || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGridMD;
