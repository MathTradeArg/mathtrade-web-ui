export const DICE_POSES: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0, 90],
  [0, 180],
  [0, -90],
  [90, 0],
  [-90, 0],
];

export const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export const FACE_VALUES: ReadonlyArray<number> = [2, 3, 5, 4, 1, 6];

const ROLL_MS = 1100;
const PAUSE_MS = 450;
const EASING = "cubic-bezier(.3,.1,.3,1)";

const mod360 = (value: number) => ((value % 360) + 360) % 360;

export const poseTransform = (x: number, y: number) =>
  `rotateX(-20deg) rotateX(${x}deg) rotateY(${y}deg)`;

export const pickFace = (last: number, random: () => number) => {
  const offset = 1 + Math.floor(random() * (DICE_POSES.length - 1));
  return (last + offset) % DICE_POSES.length;
};

export const rotationTo = (from: number, target: number, extraTurns: number) =>
  from + mod360(target - from) + 360 * extraTurns;

type Animatable = {
  animate: (
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ) => { cancel: () => void };
};

type StartOptions = {
  die: Animatable;
  hop: Animatable;
  shadow: Animatable;
  hopPx: number;
  slow?: number;
  random?: () => number;
};

export const startDiceRoll = ({
  die,
  hop,
  shadow,
  hopPx,
  slow = 1,
  random = Math.random,
}: StartOptions) => {
  if (!die || !hop || !shadow) return () => {};
  if (typeof die.animate !== "function") return () => {};

  const duration = ROLL_MS * slow;
  let x = 0;
  let y = 0;
  let face = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let live: { cancel: () => void }[] = [];
  let stopped = false;

  const roll = () => {
    if (stopped) return;
    face = pickFace(face, random);
    const [targetX, targetY] = DICE_POSES[face];
    const nextX = rotationTo(x, targetX, 1 + Math.floor(random() * 2));
    const nextY = rotationTo(y, targetY, 1 + Math.floor(random() * 2));
    const options = { duration, fill: "forwards" as FillMode };
    const previous = live;
    live = [
      die.animate(
        [{ transform: poseTransform(x, y) }, { transform: poseTransform(nextX, nextY) }],
        { ...options, easing: EASING }
      ),
      hop.animate(
        [
          { transform: `translateY(${hopPx}px)` },
          { transform: "translateY(0px)", offset: 0.4 },
          { transform: `translateY(${hopPx}px)` },
        ],
        { ...options, easing: "ease-in-out" }
      ),
      shadow.animate(
        [
          { transform: "scale(1)", opacity: 0.9 },
          { transform: "scale(.6)", opacity: 0.4, offset: 0.4 },
          { transform: "scale(1)", opacity: 0.9 },
        ],
        { ...options, easing: "ease-in-out" }
      ),
    ];
    previous.forEach((animation) => animation.cancel());
    x = nextX;
    y = nextY;
    timer = setTimeout(roll, duration + PAUSE_MS * slow);
  };

  roll();

  return () => {
    stopped = true;
    if (timer !== undefined) clearTimeout(timer);
    live.forEach((animation) => animation.cancel());
    live = [];
  };
};
