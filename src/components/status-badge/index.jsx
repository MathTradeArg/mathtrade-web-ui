import {
  boxStatusTypes,
  componentsStatusTypes,
  INVALID_STATUS_KEY,
} from "@/config/statusTypes";
import { getI18Ntext } from "@/i18n";
import Chip from "@/components/chip";
import { useMemo } from "react";

// Condition of a copy's box and components. Rendered as a plain chip, the same
// as any other attribute of the copy (language, box size), because "Muy bueno" /
// "Bastante usado" / "Sin caja" only describe it. The exception is
// INVALID_STATUS_KEY ("Revisar"), which is not a quality level but a pending
// task — while it is set, the copy is not listed among the offered games — so it
// is the only value that carries color.
const StatusBadge = ({
  status,
  min = false,
  noTooltip = false,
  type = "components",
  label = "",
  className = "",
}) => {
  const statusTypes = useMemo(() => {
    if (type === "box") {
      return boxStatusTypes;
    }
    return componentsStatusTypes;
  }, [type]);

  if (!status) {
    return null;
  }

  const statusType = statusTypes[status] || statusTypes[INVALID_STATUS_KEY];

  return (
    <Chip
      tone={status === INVALID_STATUS_KEY ? "alert" : "neutral"}
      tooltip={
        noTooltip
          ? ""
          : getI18Ntext(
              `statusType.${type === "box" ? "box" : "components"}.desc.${status}`
            )
      }
      className={className}
    >
      {label ? `${label}: ` : ""}
      {min ? statusType.min : statusType.text}
    </Chip>
  );
};

export default StatusBadge;
