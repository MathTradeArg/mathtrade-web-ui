import type { ReactNode } from "react";
import { View, Text, Svg, Polygon, Rect, StyleSheet } from "@react-pdf/renderer";
import { dpi, elementPerPage } from "../config";
import type { Tag } from "../types";
import { fitLine } from "./fitLine";

// Design units match last year's canvas labels (pixels at `dpi`). With
// Page dpi={dpi}, style values as `${n}px` convert to the same physical size.

const K = Math.round(0.01 * dpi);

const padding = 5 * K;
const paddingInt = 5 * K;
const paddingRect = 30 * K;
const heightRect = 100 * K;
const sideHex = 130 * K;
const blackRectWidth = 150 * K;

const px = (n: number) => `${n}px`;

const hexPoints = (shapeW: number, shapeH: number) =>
  [
    [0, shapeH / 2],
    [shapeW / 2 - sideHex / 2, 0],
    [shapeW / 2 + sideHex / 2, 0],
    [shapeW, shapeH / 2],
    [shapeW / 2 + sideHex / 2, shapeH],
    [shapeW / 2 - sideHex / 2, shapeH],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

const RouteShape = ({
  via,
  shapeW,
  shapeH,
  stroke,
}: {
  via: boolean;
  shapeW: number;
  shapeH: number;
  stroke: string;
}) => (
  <Svg
    viewBox={`0 0 ${shapeW} ${shapeH}`}
    width={px(shapeW)}
    height={px(shapeH)}
  >
    {via ? (
      <Rect
        x={0}
        y={0}
        width={shapeW}
        height={shapeH}
        stroke={stroke}
        strokeWidth={2}
        fill="none"
      />
    ) : (
      <Polygon
        points={hexPoints(shapeW, shapeH)}
        stroke={stroke}
        strokeWidth={2}
        fill="none"
      />
    )}
  </Svg>
);

const AmbaBadge = ({
  left,
  top,
  height: h,
  titleSize,
  citySize,
  titleTop,
  cityTop,
}: {
  left: number;
  top: number;
  height: number;
  titleSize: number;
  citySize: number;
  titleTop: number;
  cityTop: number;
}) => (
  <View
    style={{
      position: "absolute",
      left: px(left),
      top: px(top),
      width: px(blackRectWidth),
      height: px(h),
      backgroundColor: "#000000",
    }}
  >
    <Text
      style={{
        position: "absolute",
        left: 0,
        top: px(titleTop),
        width: px(blackRectWidth),
        color: "#FFFFFF",
        fontSize: px(titleSize),
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
      }}
      wrap={false}
    >
      QUEDA EN
    </Text>
    <Text
      style={{
        position: "absolute",
        left: 0,
        top: px(cityTop),
        width: px(blackRectWidth),
        color: "#FFFFFF",
        fontSize: px(citySize),
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
      }}
      wrap={false}
    >
      CABA
    </Text>
  </View>
);

type Props = {
  data: Tag;
  width: number;
  height: number;
};

const TagLabel = ({ data, width, height }: Props) => {
  const { id, altLocation, from, mesa, name, to, via, isAMBA } = data;

  const centerX = width / 2;
  const wQuad = width - 2 * padding;
  const hQuad = height - 2 * padding;
  const wText = wQuad - 2 * paddingInt;
  const shapeW = width - 2 * paddingRect;
  const mesaCenterX = isAMBA ? centerX - blackRectWidth / 2 : centerX;

  const nameL = fitLine(name, wText, 28 * K, 18 * K);
  const fromL = fitLine("De: " + from, wText, 20 * K, 13 * K);
  const altL = fitLine(
    !via ? "Mandar a " + altLocation : "Mandar a CABA",
    wText,
    18 * K,
    13 * K
  );
  const toL = fitLine("Para: " + to, wText, 20 * K, 13 * K);

  // Same vertical rhythm as the old drawTag.
  let yPos = padding + paddingInt;
  const idTop = yPos;
  yPos += 60 * K;
  const nameTop = yPos;
  yPos += 45 * K;
  const fromTop = yPos;
  yPos += 40 * K;
  const altTop = yPos;
  yPos += 40 * K;
  const mesaBlockTop = yPos;
  const shapeTop = yPos - 10 * K;
  yPos += heightRect;
  const toTop = yPos;

  let fold: ReactNode = null;
  if (elementPerPage === 4) {
    yPos += 58 * K;
    const foldY = yPos;
    yPos += 38 * K;
    const idBTop = yPos;
    const nameBLeft = padding + 20 + 275;
    const nameB = fitLine(
      name,
      padding + wQuad - paddingInt - nameBLeft,
      19 * K,
      12 * K
    );
    yPos += 50 * K;
    const fromB = fitLine("De: " + from, wText, 13 * K, 9 * K);
    const fromBTop = yPos;
    yPos += 22 * K;
    const altB = fitLine(
      !via ? "Mandar a " + altLocation : "Mandar a CABA",
      wText,
      13 * K,
      9 * K
    );
    const altBTop = yPos;
    yPos += 16 * K;
    const mesaBTop = yPos;
    yPos += 8 * K;
    const heightRectB = 56 * K;
    const shapeBTop = yPos - 10 * K;
    yPos += heightRectB;
    const toB = fitLine("Para: " + to, wText, 14 * K, 9 * K);
    const toBTop = yPos;

    const dash = 8 * K;
    const gap = 6 * K;
    const foldWidth = width - 2 * padding;
    const dashCount = Math.ceil(foldWidth / (dash + gap));
    const dashSegments: ReactNode[] = [];
    for (let i = 0; i < dashCount; i++) {
      dashSegments.push(
        <View
          key={i}
          style={{
            position: "absolute",
            left: px(padding + i * (dash + gap)),
            top: px(foldY),
            width: px(dash),
            height: 0,
            borderTopWidth: 2,
            borderTopColor: "#666666",
            borderTopStyle: "solid",
          }}
        />
      );
    }

    fold = (
      <>
        {dashSegments}
        <Text
          style={[
            styles.leftText,
            {
              left: px(padding + 10),
              top: px(foldY - 7 * K - 2),
              fontSize: px(7 * K),
              color: "#444444",
            },
          ]}
          wrap={false}
        >
          DOBLAR POR AQUÍ
        </Text>
        <Text
          style={[
            styles.leftText,
            {
              left: px(padding + 20),
              top: px(idBTop),
              fontSize: px(50 * K),
            },
          ]}
          wrap={false}
        >
          {id}
        </Text>
        <Text
          style={[
            styles.leftText,
            {
              left: px(nameBLeft),
              top: px(idBTop + 20),
              width: px(padding + wQuad - paddingInt - nameBLeft),
              fontSize: px(nameB.fontSize),
            },
          ]}
          wrap={false}
        >
          {nameB.text}
        </Text>
        <Text
          style={[
            styles.centerText,
            {
              left: px(padding + paddingInt),
              top: px(fromBTop),
              width: px(wText),
              fontSize: px(fromB.fontSize),
            },
          ]}
          wrap={false}
        >
          {fromB.text}
        </Text>
        <Text
          style={[
            styles.centerText,
            {
              left: px(mesaCenterX - wText / 2),
              top: px(altBTop),
              width: px(wText),
              fontSize: px(altB.fontSize),
            },
          ]}
          wrap={false}
        >
          {altB.text}
        </Text>
        <Text
          style={[
            styles.centerText,
            {
              left: px(mesaCenterX - wText / 2),
              top: px(mesaBTop),
              width: px(wText),
              fontSize: px(60 * K),
            },
          ]}
          wrap={false}
        >
          {mesa}
        </Text>
        <View
          style={{
            position: "absolute",
            left: px(paddingRect),
            top: px(shapeBTop),
            width: px(shapeW),
            height: px(heightRectB),
          }}
        >
          <RouteShape
            via={via}
            shapeW={shapeW}
            shapeH={heightRectB}
            stroke={via ? "#000000" : "#AAAAAA"}
          />
        </View>
        {isAMBA ? (
          <AmbaBadge
            left={width - (blackRectWidth + paddingRect)}
            top={shapeBTop}
            height={heightRectB}
            titleSize={20 * K}
            citySize={30 * K}
            // Canvas: QUEDA EN at yPos-6K, CABA at yPos+15K → relative to shapeTop
            titleTop={4 * K}
            cityTop={25 * K}
          />
        ) : null}
        <Text
          style={[
            styles.centerText,
            {
              left: px(padding + paddingInt),
              top: px(toBTop),
              width: px(wText),
              fontSize: px(toB.fontSize),
            },
          ]}
          wrap={false}
        >
          {toB.text}
        </Text>
      </>
    );
  }

  return (
    <View style={styles.cell}>
      <View
        style={{
          position: "absolute",
          left: px(padding),
          top: px(padding),
          width: px(wQuad),
          height: px(hQuad),
          borderWidth: 1,
          borderColor: "#666666",
          backgroundColor: "#FFFFFF",
        }}
      />

      <Text
        style={[
          styles.centerText,
          {
            left: px(padding + paddingInt),
            top: px(idTop),
            width: px(wText),
            fontSize: px(60 * K),
          },
        ]}
        wrap={false}
      >
        {id}
      </Text>
      <Text
        style={[
          styles.centerText,
          {
            left: px(padding + paddingInt),
            top: px(nameTop),
            width: px(wText),
            fontSize: px(nameL.fontSize),
          },
        ]}
        wrap={false}
      >
        {nameL.text}
      </Text>
      <Text
        style={[
          styles.centerText,
          {
            left: px(padding + paddingInt),
            top: px(fromTop),
            width: px(wText),
            fontSize: px(fromL.fontSize),
          },
        ]}
        wrap={false}
      >
        {fromL.text}
      </Text>
      <Text
        style={[
          styles.centerText,
          {
            left: px(padding + paddingInt),
            top: px(altTop),
            width: px(wText),
            fontSize: px(altL.fontSize),
          },
        ]}
        wrap={false}
      >
        {altL.text}
      </Text>

      <Text
        style={[
          styles.centerText,
          {
            left: px(mesaCenterX - wText / 2),
            top: px(isAMBA ? mesaBlockTop + 17 * K : mesaBlockTop),
            width: px(wText),
            fontSize: px(isAMBA ? 60 * K : 80 * K),
          },
        ]}
        wrap={false}
      >
        {mesa}
      </Text>

      <View
        style={{
          position: "absolute",
          left: px(paddingRect),
          top: px(shapeTop),
          width: px(shapeW),
          height: px(heightRect),
        }}
      >
        <RouteShape
          via={via}
          shapeW={shapeW}
          shapeH={heightRect}
          stroke={via ? "#000000" : "#888888"}
        />
      </View>

      {isAMBA ? (
        <AmbaBadge
          left={width - (blackRectWidth + paddingRect)}
          top={shapeTop}
          height={heightRect}
          titleSize={26 * K}
          citySize={45 * K}
          // Canvas: QUEDA EN at yPos+7K, CABA at yPos+40K → relative to shapeTop
          titleTop={17 * K}
          cityTop={50 * K}
        />
      ) : null}

      <Text
        style={[
          styles.centerText,
          {
            left: px(padding + paddingInt),
            top: px(toTop),
            width: px(wText),
            fontSize: px(toL.fontSize),
          },
        ]}
        wrap={false}
      >
        {toL.text}
      </Text>

      {fold}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  centerText: {
    position: "absolute",
    textAlign: "center",
    fontFamily: "Helvetica",
    color: "#000000",
  },
  leftText: {
    position: "absolute",
    textAlign: "left",
    fontFamily: "Helvetica",
    color: "#000000",
  },
});

export default TagLabel;
