import Thumbnail from "@/components/thumbnail";
import LinkExternal from "@/components/link-external";
import Icon from "@/components/icon";
import { getI18Ntext } from "@/i18n";
import StatusBadge from "@/components/status-badge";
import { ElementContext } from "@/context/element";
import { useContext } from "react";
import BadgeType from "@/components/badgeType";

const ElementComplete = ({ onToggleExpanse }) => {
  const { element } = useContext(ElementContext);

  const {
    typeNum,
    title,
    titleLink,
    publisher,
    publisherLink,
    language,
    extraData,
  } = element;

  const { box_status, component_status } = extraData;

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

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <BadgeType
            className="text-[9px]"
            type="item"
            subtype={typeNum || 1}
          />
          {titleLink ? (
            <LinkExternal
              href={titleLink}
              className="shrink-0 flex items-center gap-1 w-fit leading-none text-bgg text-[10px]"
              tooltip="element.BGG.OpenGameInBGG"
            >
              BGG
              <Icon type="external-link" />
            </LinkExternal>
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

        <div className="flex flex-wrap gap-1 items-center mt-1.5">
          <StatusBadge status={box_status} type="box" min />
          <StatusBadge status={component_status} min />
        </div>

        {language ? (
          <div className="text-caption text-gray-500 mt-1">{language}</div>
        ) : null}

        <div className="text-caption text-gray-400 truncate mt-0.5">
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
