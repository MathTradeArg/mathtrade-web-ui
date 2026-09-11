import Thumbnail from "@/components/thumbnail";
import LinkExternal from "@/components/link-external";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import ButtonAlert from "@/components/buttonAlert";
import InnerButton from "@/components/button/inner-button";
import useDeleteElement from "./useDeleteElement";
import { LoadingBox } from "@/components/loading";
import ErrorAlert from "@/components/errorAlert";
import BoxSize from "@/components/boxSize";
import { ElementContext } from "@/context/element";
import { PageContext } from "@/context/page";
import { useContext, useMemo, type ReactNode } from "react";
import BadgeType from "@/components/badgeType";
import BGGinfoLabel from "@/components/bggInfo/bggInfoLabel";
import BGGlink from "@/components/bggInfo/bggLink";
import useBGGdata from "@/components/bggInfo/useBGGdata";
import { getI18Ntext } from "@/i18n";
import { NO_RANK_VALUE } from "@/config/no-bgggame";
import clsx from "clsx";

type ElementViewProps = {
  toggleEditingMode?: () => void;
  insideItem?: boolean;
  extraContent?: ReactNode;
};

const ElementView = ({
  toggleEditingMode,
  insideItem,
  extraContent,
}: ElementViewProps) => {
  const { canI } = useContext(PageContext);

  const { element } = useContext(ElementContext);

  const { deleteElement, loading, error } = useDeleteElement(element);

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
  } = element;

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

  const isExpansion = typeNum === 2;
  const accentClass = isExpansion ? "bg-gameExpansion" : "bg-gameBase";
  const titleColorClass = isExpansion ? "text-gameExpansion" : "text-gameBase";

  const showEdition = useMemo(() => {
    if (insideItem) {
      return false;
    }
    if (offered && !canI.offer) {
      return false;
    }
    return true;
  }, [insideItem, canI, offered]);

  return (
    <div className="relative -m-4 flex-1 rounded-lg overflow-hidden flex">
      <div
        className={clsx(
          "self-stretch shrink-0 w-2 shadow-[inset_-1px_0_0_rgba(255,255,255,0.5)]",
          accentClass
        )}
      />
      <div className="grow min-w-0 flex flex-col">
        <div className="relative w-full aspect-square">
          <Thumbnail elements={[element]} className="w-full h-full" />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <BadgeType
                className="text-[10px] mb-1.5"
                type="item"
                subtype={typeNum || 1}
              />
              <h3 className={clsx("text-heading", titleColorClass)}>
                {title}
              </h3>
            </div>
            {offered ? (
              <div className="shrink-0 mt-0.5 uppercase font-bold bg-item-500 text-white text-[10px] px-3 py-[3px] rounded-full whitespace-nowrap">
                <I18N id="element.Offered" />
              </div>
            ) : null}
          </div>

          {titleLink ? null : (
            <div className="italic text-gray-500 font-bold text-caption mt-2">
              <I18N id="element-type-badge-3" />
            </div>
          )}

          {showBGGstats ? (
            <div className="flex items-center gap-4 mt-3">
              <BGGinfoLabel
                label="element.BGG.rating"
                question={`${rateVotes} ${getI18Ntext("element.BGG.votes")}`}
              >
                <div
                  className="mt-1 text-body-lg text-center w-9 h-9 leading-9 rounded-full text-white"
                  style={{ backgroundColor: rateColor }}
                >
                  {rate}
                </div>
              </BGGinfoLabel>
              <BGGinfoLabel
                label="element.BGG.weight"
                question={`${weightVotes} ${getI18Ntext("element.BGG.votes")}`}
              >
                <div className="text-body-lg text-[#2c2e33]">
                  {weight} / 5
                </div>
              </BGGinfoLabel>
              {titleLink ? <BGGlink href={titleLink} /> : null}
            </div>
          ) : null}

          <div className="h-px bg-gray-200 my-3" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-caption">
            {showBGGstats ? (
              <>
                <div>
                  <span className="text-gray-400">
                    <I18N id="element.BGG.rank" />{" "}
                  </span>
                  <span className="font-semibold text-[#2c2e33]">
                    {rank === NO_RANK_VALUE ? "-" : rank}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">
                    <I18N id="element.BGG.dependency" />{" "}
                  </span>
                  <span className="font-semibold text-[#2c2e33]">
                    {dependency}
                  </span>
                </div>
              </>
            ) : null}
            <div>
              <span className="text-gray-400">{language}</span>
            </div>
            <div className="flex items-center gap-2">
              <BoxSize value={box_size} isComplete />
            </div>
            <div className="col-span-2">
              <LinkExternal
                href={publisherLink}
                tooltip="element.BGG.OpenEditionInBGG"
                className="text-gray-400 italic"
              >
                {publisher}
              </LinkExternal>
            </div>
          </div>

          {showEdition ? (
            <div className="flex items-center gap-1 border-t text-gray-500 pt-3 mt-3">
              <button
                className="bg-primary text-white px-5 py-1 rounded-full font-bold text-sm hover:bg-sky-800  transition-colors"
                onClick={toggleEditingMode}
              >
                <InnerButton>
                  <Icon type="edit" />
                  <I18N id="element.Edit" />
                </InnerButton>
              </button>
              <ButtonAlert
                className="text-danger font-bold px-5 py-1 text-sm hover:text-red-900 transition-colors"
                title="Delete.Element"
                onClick={deleteElement}
              >
                <InnerButton>
                  <Icon type="trash" />
                  <I18N id="btn.Delete" />
                </InnerButton>
              </ButtonAlert>
            </div>
          ) : null}
          <ErrorAlert error={error} className="mt-3 mb-0" />
          {extraContent || null}
        </div>
      </div>
      <LoadingBox loading={loading} min />
    </div>
  );
};
export default ElementView;
