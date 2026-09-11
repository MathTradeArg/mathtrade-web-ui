import Thumbnail from "@/components/thumbnail";
import { GameContext } from "@/context/game";
import { useContext } from "react";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";
import Value from "@/components/value";
import BanButton from "@/components/ban/button";
import clsx from "clsx";
import WantButtonGame from "./wantButtonGame";
import ItemNoBGG from "./itemNoBgg";
import BadgeType from "@/components/badgeType";
import { resolveCardKind, cardKindBorderClass } from "@/components/badgeType/cardKind";
import useBGGdata from "@/components/bggInfo/useBGGdata";
import { NO_RANK_VALUE } from "@/config/no-bgggame";

type GameCardData = {
  ban_id?: number | string | null;
  bgg_id?: number | null;
  title: string;
  titleLink?: string | null;
  typeNum?: number;
  thumbnail?: string;
  year?: number | string | null;
  items?: { elements?: unknown[] }[];
  itemCount?: number;
  notGame?: boolean;
};

type GameGridMDProps = {
  onToggleExpanse: () => void;
};

const GameGridMD = ({ onToggleExpanse }: GameGridMDProps) => {
  /* GAME CONTEXT **********************************************/
  const { game, gameRaw, showAsIgnored } = useContext(GameContext);

  const {
    ban_id,
    title,
    titleLink,
    typeNum,
    thumbnail,
    year,
    items,
    itemCount,
    notGame,
  } = game as GameCardData;
  /* end GAME CONTEXT */

  const { isInBGG, rate, rateColor, rateVotes, rank, weight } = useBGGdata({
    game: gameRaw,
  }) as {
    isInBGG?: boolean;
    rate: number;
    rateColor: string;
    rateVotes: number;
    rank?: number;
    weight: number;
  };
  const showBGGstats = !notGame && isInBGG;
  const filledDots = Math.min(5, Math.max(0, Math.round(weight || 0)));

  // The backend buckets combo items (several different games bundled as
  // one item) under the same "no BGG match" placeholder as genuine
  // out-of-BGG items — tell them apart by the underlying item's element
  // count so combos get the combo badge/color, not "fuera de la BGG".
  const isComboItem = !!notGame && (items?.[0]?.elements?.length || 0) > 1;
  const isTrueNotGame = !!notGame && !isComboItem;
  const cardKind = resolveCardKind({
    isCombo: isComboItem,
    isTrueNotGame,
    isExpansion: !isComboItem && typeNum === 2,
  });

  return (
    <div
      className={clsx(
        "bg-white h-full rounded-lg transition-opacity relative flex flex-col",
        cardKindBorderClass(cardKind),
        {
          "opacity-30 pointer-events-none": showAsIgnored,
          "shadow-[0_0_0_7px_rgba(255,0,0,1)]": ban_id,
        }
      )}
    >
      <div className="flex items-center justify-end gap-2 px-2 pt-2">
        <BanButton size="md" type="game" />
        <div className="w-[1px] h-4 bg-gray-200"></div>
        {ban_id ? null : <Value type="game" />}
      </div>

      <div className="flex gap-3 p-3 pt-1.5 grow">
        <div className="relative w-[110px] shrink-0">
          <Thumbnail
            elements={[{ thumbnail }]}
            className="rounded-lg w-full h-full"
          />
          <div
            className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-lg grid place-content-center backdrop-blur-sm cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            onClick={onToggleExpanse}
          >
            <Icon type="plus" className="text-2xl text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <BadgeType
            className="text-[9px]"
            type="game"
            subtype={isTrueNotGame ? 3 : typeNum || 1}
            isCombo={isComboItem}
          />

          <div
            data-tooltip={getI18Ntext("Enlarge")}
            className="cursor-pointer"
            onClick={onToggleExpanse}
          >
            <h3 className="text-body-lg hover:opacity-70 leading-tight line-clamp-2">
              {`${title}${year ? ` (${year})` : ""}`}
            </h3>
          </div>

          {notGame ? (
            <ItemNoBGG itemRaw={items?.[0] || null} />
          ) : showBGGstats ? (
            <div className="flex items-center gap-3">
              <div
                className="text-[13px] font-bold text-center w-7 h-7 leading-7 rounded-full text-white shrink-0"
                style={{ backgroundColor: rateColor }}
                title={`${rateVotes} ${getI18Ntext("element.BGG.votes")}`}
              >
                {rate}
              </div>
              <div className="flex gap-1" title={`${weight} / 5`}>
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className={clsx(
                      "w-[5px] h-[5px] rounded-full",
                      dot <= filledDots ? "bg-[#2c2e33]" : "bg-gray-200"
                    )}
                  />
                ))}
              </div>
              {titleLink ? (
                <a
                  href={titleLink}
                  target="_blank"
                  rel="nofollow noopener"
                  className="ml-auto shrink-0 w-6 h-6 rounded-md bg-bgg/10 text-bgg flex items-center justify-center hover:bg-bgg/20 transition-colors"
                  title={getI18Ntext("element.BGG.OpenGameInBGG")}
                >
                  <Icon type="bgg" className="text-xs" />
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto text-caption text-gray-400 truncate">
            {itemCount} <I18N id={itemCount === 1 ? "game.item-num.1" : "game.item-num.more"} />
            {showBGGstats ? (
              <>
                {" · "}
                <I18N id="element.BGG.rank" />{" "}
                {rank === NO_RANK_VALUE || rank == null ? "-" : rank}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <WantButtonGame
          ban_id={ban_id}
          contextSize="md"
          notGame={notGame}
          itemRaw={items?.[0] || null}
        />
      </div>
    </div>
  );
};

export default GameGridMD;
