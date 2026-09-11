import BGGinfoLabel from "../bggInfo/bggInfoLabel";
import I18N, { getI18Ntext } from "@/i18n";
import { boxSizesValues, boxSizeIdToReview } from "@/config/boxSizes";
import { useMemo } from "react";
import clsx from "clsx";

type BoxSizeValue = {
  text: string;
  description: string;
  valueA?: string | number;
  valueB?: string | number;
};

const BoxSizeComp = ({
  boxSize,
  toReview,
}: {
  boxSize: BoxSizeValue;
  toReview: boolean;
}) => {
  return (
    <>
      <div
        className={clsx("text-body-lg", {
          "text-red-700": toReview,
        })}
      >
        <I18N id={boxSize.text} />
      </div>
      <div
        className={clsx("text-caption text-balance", {
          "italic text-gray-500": !toReview,
          "text-red-700": toReview,
        })}
      >
        <I18N
          id={boxSize.description}
          values={[boxSize.valueA, boxSize.valueB]}
        />
      </div>
    </>
  );
};

type BoxSizeProps = {
  value?: string | number | null;
  isComplete?: boolean;
};

const BoxSize = ({ value, isComplete = false }: BoxSizeProps) => {
  const { val, boxSize } = useMemo(() => {
    const val =
      typeof value === "undefined" || value === null
        ? boxSizeIdToReview
        : value;
    return {
      val,
      boxSize: boxSizesValues[val],
    };
  }, [value]);

  if (!boxSize) {
    return null;
  }

  if (isComplete) {
    return (
      <div>
        <BGGinfoLabel
          label="boxSizes.title"
          question={getI18Ntext("boxSizes.description")}
        />
        <BoxSizeComp
          boxSize={boxSize}
          toReview={`${val}` === `${boxSizeIdToReview}`}
        />
      </div>
    );
  }
  return (
    <div>
      <BoxSizeComp
        boxSize={boxSize}
        toReview={`${val}` === `${boxSizeIdToReview}`}
      />
    </div>
  );
};

export default BoxSize;
