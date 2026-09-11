import Thumbnail from "@/components/thumbnail";
import LinkExternal from "@/components/link-external";
import Icon from "@/components/icon";
import I18N, { getI18Ntext } from "@/i18n";
import StatusBadge from "@/components/status-badge";
import { ElementContext } from "@/context/element";
import { useContext } from "react";
import BadgeType from "@/components/badgeType";
import useBGGdata from "@/components/bggInfo/useBGGdata";
import { NO_RANK_VALUE } from "@/config/no-bgggame";
import { boxSizesValues, boxSizeIdToReview } from "@/config/boxSizes";
import Question from "@/components/question";
import clsx from "clsx";

type ElementCompleteProps = {
  onToggleExpanse: () => void;
};

const ElementComplete = ({ onToggleExpanse }: ElementCompleteProps) => {
  const { element } = useContext(ElementContext);

  const {
    typeNum,
    game,
    title,
    titleLink,
    publisher,
    publisherLink,
    language,
    notGame,
    offered,
    box_size,
    extraData,
  } = element as {
    typeNum?: number;
    game?: unknown;
    title: string;
    titleLink?: string | null;
    publisher?: string | null;
    publisherLink?: string | null;
    language?: string;
    notGame?: boolean;
    offered?: boolean;
    box_size?: number;
    extraData: { box_status?: string; component_status?: string };
  };

  const { box_status, component_status } = extraData;

  const {
    isInBGG,
    rate,
    rateColor,
    rateVotes,
    rank,
    weight,
    weightVotes,
    dependency,
  } = useBGGdata({ game }) as {
    isInBGG?: boolean;
    rate: number;
    rateColor: string;
    rateVotes: number;
    rank?: number;
    weight: number;
    weightVotes: number;
    dependency: string;
  };
  const showBGGstats = !notGame && game && isInBGG;

  const filledDots = Math.min(5, Math.max(0, Math.round(weight || 0)));
  const boxSize = boxSizesValues[box_size ?? boxSizeIdToReview];

  return (
    <div className="flex gap-3">
      <div className="relative w-[90px] shrink-0">
        <Thumbnail
          elements={[element]}
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
        <div className="flex items-center justify-between gap-2">
          <BadgeType
            className="text-[9px]"
            type="item"
            subtype={typeNum || 1}
          />
          {offered ? (
            <div className="shrink-0 uppercase font-bold bg-item-500 text-white text-[10px] px-2.5 py-[3px] rounded-full whitespace-nowrap">
              <I18N id="element.Offered" />
            </div>
          ) : null}
        </div>

        <div
          data-tooltip={getI18Ntext("Enlarge")}
          className="cursor-pointer"
          onClick={onToggleExpanse}
        >
          <h3 className="text-body-lg hover:opacity-70 leading-tight line-clamp-2">
            {title}
          </h3>
        </div>

        {showBGGstats ? (
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

        <div className="flex flex-wrap gap-1 items-center">
          <StatusBadge
            status={box_status}
            type="box"
            min
            label={getI18Ntext("status.label.box")}
          />
          <StatusBadge
            status={component_status}
            min
            label={getI18Ntext("status.label.components")}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {language ? (
            <span className="text-caption text-gray-500 bg-colorMain px-2 py-0.5 rounded">
              {language}
            </span>
          ) : null}
          {showBGGstats ? (
            <span className="text-caption text-gray-500 bg-colorMain px-2 py-0.5 rounded">
              {dependency}
            </span>
          ) : null}
          {boxSize ? (
            <span className="text-caption text-gray-500 bg-colorMain px-2 py-0.5 rounded inline-flex items-center gap-1">
              <I18N id={boxSize.text} />
              <Question
                text={getI18Ntext(boxSize.description, [
                  boxSize.valueA,
                  boxSize.valueB,
                ])}
                noTranslate
                className="text-[13px]"
              />
            </span>
          ) : null}
        </div>

        <div className="mt-auto text-caption text-gray-400 truncate">
          {showBGGstats ? (
            <>
              <I18N id="element.BGG.rank" />{" "}
              {rank === NO_RANK_VALUE ? "-" : rank}
              {" · "}
            </>
          ) : null}
          <LinkExternal
            href={publisherLink}
            tooltip="element.BGG.OpenEditionInBGG"
          >
            {publisher}
          </LinkExternal>
        </div>
      </div>
    </div>
  );
};

export default ElementComplete;
