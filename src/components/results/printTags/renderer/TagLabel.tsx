import {
  View,
  Text,
  Svg,
  Polygon,
  Rect,
  StyleSheet,
  type Styles,
} from "@react-pdf/renderer";
import { canvasWidth, dpi, elementPerPage } from "../config";
import type { Tag } from "../types";
import { fitLine } from "./fitLine";

type Style = Styles[string];

// Design units match last year's labels (pixels at `dpi`). With Page
// dpi={dpi}, `${n}px` style values convert to the same physical size.

const K = Math.round(0.01 * dpi);
const COLS = 2;
const cellW = Math.round(canvasWidth / COLS);

const pad = 5 * K;
const padInt = 5 * K;
const padShape = 30 * K;
const mesaH = 100 * K;
const sideHex = 130 * K;
const ambaW = 150 * K;
const textW = cellW - 2 * pad - 2 * padInt;
const shapeW = cellW - 2 * padShape;

const px = (n: number) => `${n}px`;

const Fitted = ({
  text,
  size,
  minSize,
  maxWidth = textW,
  style,
}: {
  text: string;
  size: number;
  minSize: number;
  maxWidth?: number;
  style?: Style | Style[];
}) => {
  const fitted = fitLine(text, maxWidth, size, minSize);
  return (
    <Text style={[{ fontSize: px(fitted.fontSize) }, style]} wrap={false}>
      {fitted.text}
    </Text>
  );
};

const RouteShape = ({
  via,
  height,
  stroke,
}: {
  via: boolean;
  height: number;
  stroke: string;
}) => (
  <Svg viewBox={`0 0 ${shapeW} ${height}`} width="100%" height={px(height)}>
    {via ? (
      <Rect
        x={0}
        y={0}
        width={shapeW}
        height={height}
        stroke={stroke}
        strokeWidth={2}
        fill="none"
      />
    ) : (
      <Polygon
        points={[
          [0, height / 2],
          [shapeW / 2 - sideHex / 2, 0],
          [shapeW / 2 + sideHex / 2, 0],
          [shapeW, height / 2],
          [shapeW / 2 + sideHex / 2, height],
          [shapeW / 2 - sideHex / 2, height],
        ]
          .map(([x, y]) => `${x},${y}`)
          .join(" ")}
        stroke={stroke}
        strokeWidth={2}
        fill="none"
      />
    )}
  </Svg>
);

const MesaBlock = ({
  mesa,
  via,
  isAMBA,
  height,
  mesaSize,
  stroke,
  ambaTitleSize,
  ambaCitySize,
}: {
  mesa: string;
  via: boolean;
  isAMBA: boolean;
  height: number;
  mesaSize: number;
  stroke: string;
  ambaTitleSize: number;
  ambaCitySize: number;
}) => (
  <View style={[styles.mesaBlock, { height: px(height) }]}>
    <View style={styles.mesaShape}>
      <RouteShape via={via} height={height} stroke={stroke} />
    </View>
    <View style={styles.mesaRow}>
      <View style={styles.mesaMain}>
        <Text style={{ fontSize: px(mesaSize), textAlign: "center" }} wrap={false}>
          {mesa}
        </Text>
      </View>
      {isAMBA ? (
        <View style={styles.amba}>
          <Text style={[styles.ambaText, { fontSize: px(ambaTitleSize) }]} wrap={false}>
            QUEDA EN
          </Text>
          <Text style={[styles.ambaText, { fontSize: px(ambaCitySize) }]} wrap={false}>
            CABA
          </Text>
        </View>
      ) : null}
    </View>
  </View>
);

const FoldHalf = ({ data }: { data: Tag }) => {
  const { id, altLocation, from, mesa, name, to, via, isAMBA } = data;
  const nameMax = textW - (20 + 275 - padInt);

  return (
    <View style={styles.foldHalf}>
      <View style={styles.foldMark}>
        <Text style={styles.foldHint} wrap={false}>
          DOBLAR POR AQUÍ
        </Text>
        <View style={styles.foldLine} />
      </View>

      <View style={styles.idNameRow}>
        <Text style={styles.idFold} wrap={false}>
          {id}
        </Text>
        <Fitted
          text={name}
          size={19 * K}
          minSize={12 * K}
          maxWidth={nameMax}
          style={styles.nameFold}
        />
      </View>

      <Fitted text={"De: " + from} size={13 * K} minSize={9 * K} style={styles.line} />
      <Fitted
        text={!via ? "Mandar a " + altLocation : "Mandar a CABA"}
        size={13 * K}
        minSize={9 * K}
        style={styles.line}
      />

      <MesaBlock
        mesa={mesa}
        via={via}
        isAMBA={isAMBA}
        height={mesaH}
        mesaSize={60 * K}
        stroke={via ? "#000000" : "#AAAAAA"}
        ambaTitleSize={20 * K}
        ambaCitySize={30 * K}
      />

      <Fitted text={"Para: " + to} size={14 * K} minSize={9 * K} style={styles.line} />
    </View>
  );
};

const TagLabel = ({ data }: { data: Tag }) => {
  const { id, altLocation, from, mesa, name, to, via, isAMBA } = data;

  return (
    <View style={styles.cell}>
      <View style={styles.card}>
        <Text style={styles.id} wrap={false}>
          {id}
        </Text>
        <Fitted text={name} size={28 * K} minSize={18 * K} style={styles.line} />
        <Fitted text={"De: " + from} size={20 * K} minSize={13 * K} style={styles.line} />
        <Fitted
          text={!via ? "Mandar a " + altLocation : "Mandar a CABA"}
          size={18 * K}
          minSize={13 * K}
          style={styles.line}
        />

        <MesaBlock
          mesa={mesa}
          via={via}
          isAMBA={isAMBA}
          height={mesaH}
          mesaSize={isAMBA ? 60 * K : 80 * K}
          stroke={via ? "#000000" : "#888888"}
          ambaTitleSize={26 * K}
          ambaCitySize={45 * K}
        />

        <Fitted text={"Para: " + to} size={20 * K} minSize={13 * K} style={styles.line} />

        {elementPerPage === 4 ? <FoldHalf data={data} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: "100%",
    height: "100%",
    padding: px(pad),
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#666666",
    backgroundColor: "#FFFFFF",
    paddingVertical: px(padInt),
    paddingHorizontal: px(padInt),
    alignItems: "center",
  },
  id: {
    fontSize: px(60 * K),
    fontFamily: "Helvetica",
    color: "#000000",
    textAlign: "center",
    marginBottom: px(4 * K),
  },
  line: {
    fontFamily: "Helvetica",
    color: "#000000",
    textAlign: "center",
    alignSelf: "stretch",
    marginBottom: px(8 * K),
  },
  mesaBlock: {
    alignSelf: "stretch",
    // paddingRect is from the cell edge; card already has pad+padInt inset.
    marginHorizontal: px(padShape - pad - padInt),
    marginVertical: px(6 * K),
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
    marginTop: px(20 * K),
  },
  foldMark: {
    alignSelf: "stretch",
    marginBottom: px(10 * K),
  },
  foldHint: {
    fontSize: px(7 * K),
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
  idNameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "stretch",
    marginBottom: px(6 * K),
    paddingLeft: px(10),
  },
  idFold: {
    fontSize: px(50 * K),
    fontFamily: "Helvetica",
    color: "#000000",
    marginRight: px(12 * K),
  },
  nameFold: {
    fontFamily: "Helvetica",
    color: "#000000",
    flex: 1,
    marginBottom: px(4 * K),
  },
});

export default TagLabel;
