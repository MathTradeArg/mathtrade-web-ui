import Chip from "@/components/chip";
import {
  boxStatusTypes,
  componentsStatusTypes,
  INVALID_STATUS_KEY,
} from "@/config/statusTypes";
import { getI18Ntext } from "@/i18n";

type StatusTypeMap = Record<string, { min?: string } | undefined>;

const shortValue = (types: StatusTypeMap, status: string) =>
  types[status]?.min || types[INVALID_STATUS_KEY]?.min || "";

type StatusChipProps = {
  boxStatus?: string;
  componentStatus?: string;
  className?: string;
};

// Box + components condition in a single chip. As two separate chips they
// shared a wrapping row with language, dependency and box size, which broke
// into three ragged lines and left sibling cards at different heights.
const StatusChip = ({
  boxStatus,
  componentStatus,
  className,
}: StatusChipProps) => {
  const parts: string[] = [];
  const tooltips: string[] = [];

  if (boxStatus) {
    parts.push(
      `${getI18Ntext("status.label.box")} ${shortValue(
        boxStatusTypes as StatusTypeMap,
        boxStatus
      )}`
    );
    tooltips.push(
      `${getI18Ntext("status.label.box")}: ${getI18Ntext(
        `statusType.box.desc.${boxStatus}`
      )}`
    );
  }

  if (componentStatus) {
    parts.push(
      `${getI18Ntext("status.label.components.min")} ${shortValue(
        componentsStatusTypes as StatusTypeMap,
        componentStatus
      )}`
    );
    tooltips.push(
      `${getI18Ntext("status.label.components")}: ${getI18Ntext(
        `statusType.components.desc.${componentStatus}`
      )}`
    );
  }

  if (!parts.length) {
    return null;
  }

  // "Revisar" keeps the copy out of the offer listings, so it should not appear
  // on a card in practice — but if it ever does, it reads as a pending task
  // here too instead of blending in with language and box size.
  const needsReview =
    boxStatus === INVALID_STATUS_KEY || componentStatus === INVALID_STATUS_KEY;

  return (
    <Chip
      tone={needsReview ? "alert" : "neutral"}
      tooltip={tooltips.join(" — ")}
      className={className}
    >
      {parts.join(" · ")}
    </Chip>
  );
};

export default StatusChip;
