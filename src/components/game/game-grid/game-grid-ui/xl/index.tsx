import Thumbnail from "@/components/thumbnail";
import { GameContext } from "@/context/game";
import { useContext, lazy } from "react";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";
import Value from "@/components/value";
import BanButton from "@/components/ban/button";
import clsx from "clsx";
import ItemNoBGG from "../itemNoBgg";
import Dynamic from "@/components/dynamic";
import BadgeType from "@/components/badgeType";
import { resolveCardKind, cardKindBorderClass } from "@/components/badgeType/cardKind";
import useBGGdata from "@/components/bggInfo/useBGGdata";
import { NO_RANK_VALUE } from "@/config/no-bgggame";

const WantButtonGame = lazy(() => import("../wantButtonGame"));

type GameCardData = {
  ban_id?: number | string | null;
  bgg_id?: number | null;
  title: string;
  titleLink?: string | null;
  typeNum?: number;
  thumbnail?: string;
  year?: number | string | null;
  items?: { elements?: unknown[] }[];
  notGame?: boolean;
};

type GameGridXLProps = {
  onToggleExpanse: () => void;
};

const GameGridXL = ({ onToggleExpanse }: GameGridXLProps) => {
  /* GAME CONTEXT **********************************************/
  const { game, gameRaw, showAsIgnored } = useContext(GameContext);

  const {
    ban_id,
    title,
    year,
    titleLink,
    typeNum,
    thumbnail,
    items,
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

  // Same combo-vs-notGame disambiguation as game-grid-ui/md.tsx: a combo
  // item (several different games bundled together) has no single BGG
  // match either, so the backend buckets it the same as a genuine
  // out-of-BGG item — tell them apart by element count.
  const isComboItem = !!notGame && (items?.[0]?.elements?.length || 0) > 1;
  const isTrueNotGame = !!notGame && !isComboItem;
  const cardKind = resolveCardKind({
    isCombo: isComboItem,
    isTrueNotGame,
    isExpansion: !isComboItem && typeNum === 2,
  });

  return (
    <div className="relative">
      <div
        className={clsx(
          "bg-white w-full mx-auto relative transition-opacity rounded-t-lg overflow-hidden",
          cardKindBorderClass(cardKind),
          {
            "opacity-30  pointer-events-none": showAsIgnored,
            "shadow-[0_0_0_7px_rgba(255,0,0,1)]": ban_id,
          }
        )}
      >
        <div className="flex items-center justify-end gap-2 px-3 pt-3">
          <BanButton size="md" type="game" />
          <div className="w-[1px] h-4 bg-gray-200"></div>
          {ban_id ? null : <Value type="game" />}
        </div>

        <div className="flex gap-4">
          <div className="lg:w-52 w-24 shrink-0">
            <Thumbnail
              elements={[{ thumbnail }]}
              className="lg:w-52 w-24"
            />
          </div>
          <div className="grow min-w-0 flex flex-col gap-2 items-start py-2 pr-3">
            <BadgeType
              type="game"
              subtype={isTrueNotGame ? 3 : typeNum || 1}
              isCombo={isComboItem}
            />

            <h3 className="text-heading leading-tight w-full">{`${title}${
              year ? ` (${year})` : ""
            }`}</h3>

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
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-gray-400">
                    <I18N id="element.BGG.weight" />
                  </span>
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
                <div className="text-caption text-gray-400 shrink-0">
                  <I18N id="element.BGG.rank" />{" "}
                  {rank === NO_RANK_VALUE || rank == null ? "-" : rank}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <button
          className="absolute top-1 right-1 aspect-square w-7 opacity-60 hover:opacity-100 text-gray-500"
          onClick={onToggleExpanse}
        >
          <div data-tooltip={getI18Ntext("minimize")}>
            <Icon />
          </div>
        </button>
      </div>

      <Dynamic h={700}>
        <WantButtonGame
          ban_id={ban_id}
          contextSize="xl"
          notGame={notGame}
          itemRaw={items?.[0] || null}
        />
      </Dynamic>
      <button
        className="absolute -bottom-2 left-1/2 hover:opacity-100 text-white bg-gray-700 hover:bg-black transition-colors leading-none text-[9px] uppercase p-1 w-24 -ml-12 rounded-full"
        onClick={onToggleExpanse}
      >
        <Icon /> <I18N id="minimize" />
      </button>
    </div>
  );
};

export default GameGridXL;
