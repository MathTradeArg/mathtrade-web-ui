import type { ReactNode } from "react";
import { Page, View, Document, StyleSheet } from "@react-pdf/renderer";
import { dpi, padding } from "../config";

const styles = StyleSheet.create({
  section: {
    margin: 0,
    // `padding` is design-px at `dpi`; with Page dpi set, "px" maps to paper.
    padding: `${padding}px`,
    width: "100%",
    height: "100%",
  },
});

// One A4 page per entry. `pages` are already laid-out react-pdf nodes
// (typically a PageContent grid of TagLabels).
const Doc = ({ pages = [] }: { pages?: ReactNode[] }) => (
  <Document>
    {pages.map((content, k) => (
      <Page size="A4" dpi={dpi} key={k}>
        <View style={styles.section}>{content}</View>
      </Page>
    ))}
  </Document>
);

export default Doc;
