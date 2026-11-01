import {
  StyleSheet
} from "@react-pdf/renderer";
import { dpi } from "../config";

export const px = (n: number) => `${n}px`;

// Design units match last year's labels (pixels at `dpi`). With Page
// dpi={dpi}, `${n}px` style values convert to the same physical size.

export const K = Math.round(0.01 * dpi);

export const padShape = 30 * K;
export const ambaW = 180 * K;

export const styles = StyleSheet.create({
  cell: {
    width: "100%",
    height: "100%",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#666666",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    margin: px(5 * K),
  },
  id: {
    fontSize: px(70 * K),
    fontFamily: "Helvetica",
    color: "#000000",
    textAlign: "center",
    marginBottom: px(2 * K),
  },
  line: {
    fontFamily: "Helvetica",
    color: "#000000",
    textAlign: "center",
    alignSelf: "stretch",
    marginBottom: px(2 * K),
  },
  mesaBlock: {
    alignSelf: "stretch",
    // paddingRect is from the cell edge; card already has pad+padInt inset.
    marginHorizontal: px(padShape),
    marginVertical: px(5 * K),
    position: "relative",
  },
  mesaShape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mesaRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  mesaMain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  amba: {
    width: px(ambaW),
    height: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  ambaText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  foldHalf: {
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: px(4 * K),
  },
  foldMark: {
    alignSelf: "stretch",
    marginBottom: px(3 * K),
  },
  foldHint: {
    fontSize: px(10 * K),
    color: "#444444",
    fontFamily: "Helvetica",
    marginBottom: px(2 * K),
  },
  foldLine: {
    borderTopWidth: 2,
    borderTopColor: "#666666",
    borderTopStyle: "dashed",
    alignSelf: "stretch",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "stretch",
    justifyContent: "center",
    marginBottom: px(3 * K),
    paddingLeft: px(10),
  },
  mandarALocation: {
    fontFamily: "Helvetica",
    color: "#000000",
    textAlign: "center",
    alignSelf: "stretch",
    marginBottom: px(2 * K),
    textDecoration: "underline",
  },
});
