import { View } from "@react-pdf/renderer";
import { canvasHeight, canvasWidth, elementPerPage } from "../config";
import type { Tag } from "../types";
import TagLabel from "./TagLabel";

const COLS = 2;

// One A4 page body: up to `elementPerPage` labels in a 2-column grid.
// Cell size stays in the same design-px as the old canvas so TagLabel's
// absolute layout matches last year's printed labels.
const PageContent = ({ tags = [] }: { tags?: Tag[] }) => {
  const rows = Math.ceil(elementPerPage / COLS);
  const width = Math.round(canvasWidth / COLS);
  const height = Math.round(canvasHeight / rows);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {tags.map((tag, k) => (
        <View
          key={k}
          style={{
            width: `${100 / COLS}%`,
            height: `${100 / rows}%`,
          }}
        >
          <TagLabel data={tag} width={width} height={height} />
        </View>
      ))}
    </View>
  );
};

export default PageContent;
