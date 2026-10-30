import { View } from "@react-pdf/renderer";
import { elementPerPage } from "../config";
import type { Tag } from "../types";
import TagLabel from "./TagLabel";

const COLS = 2;

// One A4 page body: up to `elementPerPage` labels in a 2-column grid.
const PageContent = ({ tags = [] }: { tags?: Tag[] }) => {
  const rows = Math.ceil(elementPerPage / COLS);

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
          <TagLabel data={tag} />
        </View>
      ))}
    </View>
  );
};

export default PageContent;
