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

  const { isInBGG, rate, rateVotes, rank, weight } = useBGGdata({
    game: gameRaw,
  }) as {
    isInBGG?: boolean;
    rate: number;
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
        "h-full rounded-lg transition-opacity relative flex flex-col overflow-hidden",
        cardKindBorderClass(cardKind),
        {
          "opacity-30 pointer-events-none": showAsIgnored,
          "shadow-[0_0_0_7px_rgba(255,0,0,1)]": ban_id,
        }
      )}
    >
      <div className="flex items-center justify-end gap-2 px-3 pt-2 pb-1">
        <BanButton size="md" type="game" />
        <div className="w-[1px] h-4 bg-gray-200"></div>
        {ban_id ? null : <Value type="game" />}
      </div>

      <div className="flex gap-0 grow">
        <div className="relative w-[130px] shrink-0">
          <Thumbnail
            elements={[{ thumbnail }]}
            className="w-full h-full"
          />
          <div
            className="absolute top-0 left-0 w-full h-full bg-black/40 grid place-content-center backdrop-blur-sm cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            onClick={onToggleExpanse}
          >
            <Icon type="plus" className="text-2xl text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 py-3.5 px-4 flex flex-col gap-2.5 items-start">
          <BadgeType
            className="text-[9px]"
            type="game"
            subtype={isTrueNotGame ? 3 : typeNum || 1}
            isCombo={isComboItem}
          />

          <div
            data-tooltip={getI18Ntext("Enlarge")}
            className="cursor-pointer w-full"
            onClick={onToggleExpanse}
          >
            <h3 className="text-heading hover:opacity-70 leading-tight line-clamp-2">
              {`${title}${year ? ` (${year})` : ""}`}
            </h3>
          </div>

          {notGame ? (
            <ItemNoBGG itemRaw={items?.[0] || null} />
          ) : showBGGstats ? (
            <div className="flex items-center gap-4 w-full">
              <div
                className="text-body-lg text-center w-10 h-10 leading-10 rounded-full text-white shrink-0 bg-primary"
                title={`${rateVotes} ${getI18Ntext("element.BGG.votes")}`}
              >
                {rate}
              </div>
              <div className="flex gap-1" title={`${weight} / 5`}>
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className={clsx(
                      "w-2 h-2 rounded-full",
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
                  className="ml-auto shrink-0 w-7 h-7 rounded-md bg-bgg/10 text-bgg flex items-center justify-center hover:bg-bgg/20 transition-colors"
                  title={getI18Ntext("element.BGG.OpenGameInBGG")}
                >
                  <Icon type="external-link" className="text-sm" />
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto w-full text-caption text-gray-400 truncate">
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

      <div className="px-3 pb-3 pt-2">
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
