import {
  View,
  Text,
  Svg,
  Polygon,
  Rect,
  type Styles,
} from "@react-pdf/renderer";
import { canvasWidth, elementPerPage } from "../config";
import type { Tag } from "../types";
import { fitLine } from "./fitLine";
import { styles, px, K, padShape } from "./styles";

type Style = Styles[string];

const COLS = 2;
const cellW = Math.round(canvasWidth / COLS);

const mesaH = 100 * K;
const sideHex = 130 * K;
const textW = cellW - 10 * K;
const shapeW = cellW - 2 * padShape;

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
        strokeWidth={4}
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
        strokeWidth={4}
        fill="#ccc"
      />
    )}
  </Svg>
);

type UserType = 'from' | 'to';

const User = ({ name, type, sizeMultiplier = 1 }: { name: string; type: UserType; sizeMultiplier?: number }) => {
  const multiplier = Math.max(1, sizeMultiplier);
  const size = type === 'from' ? 13 * K * multiplier : 15 * K * multiplier;
  const minSize = type === 'from' ? 10 * K * multiplier : 12 * K * multiplier;
  const prefix = type === 'from' ? 'De: ' : 'Para: ';

  return <View style={styles.textRow}>
    <Fitted style={[{ fontSize: px(size) }]} size={size} minSize={minSize} text={prefix} />
    <Fitted style={[{ fontSize: px(size) }]} size={size} minSize={minSize} text={name} />
  </View>;
};

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
      <View style={[styles.mesaMain, isAMBA && styles.amba]}>
        <Text style={[{ fontSize: px(mesaSize), textAlign: "center" }, isAMBA && styles.ambaText]} wrap={false}>
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

const HalfLabel = ({ data, sizeMultiplier = 1 }: { data: Tag, sizeMultiplier?: number }) => {
  const { id, altLocation, from, mesa, name, to, via, isAMBA } = data;
  const cappedMultiplier = Math.max(1, sizeMultiplier);

  return <>
    <Text style={styles.id} wrap={false}>
      {id}
    </Text>
    <Fitted text={name} size={16 * K * Math.max(1, sizeMultiplier)} minSize={14 * K} style={styles.line} />
    <User name={from} type="from" sizeMultiplier={sizeMultiplier} />
    <Fitted
      text={!via ? "Mandar a " + altLocation : "Mandar a CABA"}
      size={18 * K * cappedMultiplier}
      minSize={13 * K * cappedMultiplier}
      style={styles.mandarALocation}
    />

    <MesaBlock
      mesa={mesa}
      via={via}
      isAMBA={isAMBA}
      height={mesaH * sizeMultiplier}
      mesaSize={isAMBA ? 60 * K * sizeMultiplier : 80 * K * sizeMultiplier}
      stroke={via ? "#000000" : "#888888"}
      ambaTitleSize={26 * K * sizeMultiplier}
      ambaCitySize={45 * K * sizeMultiplier}
    />


    <User name={to} type="to" sizeMultiplier={sizeMultiplier} />
  </>;
}

const FoldHalf = ({ data }: { data: Tag }) => {
  return (
    <View style={styles.foldHalf}>
      <View style={styles.foldMark}>
        <Text style={styles.foldHint} wrap={false}>
          DOBLAR POR AQUÍ
        </Text>
        <View style={styles.foldLine} />
      </View>

      <HalfLabel data={data} sizeMultiplier={0.5} />
    </View>
  );
};

const TagLabel = ({ data }: { data: Tag }) => {
  return (
    <View style={styles.cell}>
      <View style={styles.card}>
        <HalfLabel data={data} sizeMultiplier={1.3} />

        {elementPerPage === 4 ? <FoldHalf data={data} /> : null}
      </View>
    </View>
  );
};

export default TagLabel;
