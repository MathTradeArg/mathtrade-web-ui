import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import {
  DICE_POSES,
  PIPS,
  pickFace,
  rotationTo,
  poseTransform,
  startDiceRoll,
} from "./dice.ts";

type Call = { keyframes: any[]; options: any; cancelled: boolean };

const fakeElement = (calls: Call[]) => ({
  animate(keyframes: any[], options: any) {
    const call: Call = { keyframes, options, cancelled: false };
    calls.push(call);
    return { cancel: () => (call.cancelled = true) };
  },
});

const sequence = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

beforeEach(() => mock.timers.enable({ apis: ["setTimeout"] }));
afterEach(() => mock.timers.reset());

test("there are six poses and the pips of face n sum to n", () => {
  assert.equal(DICE_POSES.length, 6);
  for (let n = 1; n <= 6; n++) assert.equal(PIPS[n].length, n);
});

test("pickFace never repeats the previous face", () => {
  for (let last = 0; last < 6; last++) {
    for (const r of [0, 0.2, 0.5, 0.99]) {
      assert.notEqual(pickFace(last, () => r), last);
    }
  }
});

test("rotationTo always spins forward 1 or 2 extra turns and lands on the pose", () => {
  for (const [from, target] of [
    [0, 90],
    [450, 0],
    [720, -90],
    [90, 90],
  ]) {
    for (const turns of [1, 2]) {
      const to = rotationTo(from, target, turns);
      assert.ok(to - from >= 360 * turns);
      assert.ok(to - from < 360 * (turns + 1));
      assert.equal((((to - target) % 360) + 360) % 360, 0);
    }
  }
});

test("poseTransform composes the tilt with both rotations", () => {
  assert.equal(poseTransform(90, 180), "rotateX(-20deg) rotateX(90deg) rotateY(180deg)");
});

test("rolls with the specified timing, hop and shadow, on distinct faces", () => {
  const dieCalls: Call[] = [];
  const hopCalls: Call[] = [];
  const shadowCalls: Call[] = [];
  const stop = startDiceRoll({
    die: fakeElement(dieCalls),
    hop: fakeElement(hopCalls),
    shadow: fakeElement(shadowCalls),
    hopPx: 18,
    random: sequence([0.5, 0, 0.9, 0, 0.1, 0.6, 0.3, 0.7]),
  });
  assert.equal(dieCalls.length, 1);
  assert.equal(dieCalls[0].options.duration, 1100);
  assert.equal(dieCalls[0].options.easing, "cubic-bezier(.3,.1,.3,1)");
  assert.equal(dieCalls[0].options.fill, "forwards");
  assert.deepEqual(hopCalls[0].keyframes, [
    { transform: "translateY(18px)" },
    { transform: "translateY(0px)", offset: 0.4 },
    { transform: "translateY(18px)" },
  ]);
  assert.deepEqual(shadowCalls[0].keyframes, [
    { transform: "scale(1)", opacity: 0.9 },
    { transform: "scale(.6)", opacity: 0.4, offset: 0.4 },
    { transform: "scale(1)", opacity: 0.9 },
  ]);
  mock.timers.tick(1100 + 450);
  assert.equal(dieCalls.length, 2);
  mock.timers.tick(1100 + 450);
  assert.equal(dieCalls.length, 3);
  const endPoses = dieCalls.map((c) => c.keyframes[1].transform);
  assert.notEqual(endPoses[0], endPoses[1]);
  assert.notEqual(endPoses[1], endPoses[2]);
  assert.equal(dieCalls[1].keyframes[0].transform, endPoses[0]);
  stop();
});

test("stop cancels live animations and the pending timeout", () => {
  const dieCalls: Call[] = [];
  const stop = startDiceRoll({
    die: fakeElement(dieCalls),
    hop: fakeElement([]),
    shadow: fakeElement([]),
    hopPx: 18,
    random: sequence([0.5]),
  });
  stop();
  assert.equal(dieCalls[0].cancelled, true);
  mock.timers.tick(10_000);
  assert.equal(dieCalls.length, 1);
  assert.doesNotThrow(stop);
});

test("slow factor stretches duration and pause", () => {
  const dieCalls: Call[] = [];
  const stop = startDiceRoll({
    die: fakeElement(dieCalls),
    hop: fakeElement([]),
    shadow: fakeElement([]),
    hopPx: 18,
    slow: 3,
    random: sequence([0.5]),
  });
  assert.equal(dieCalls[0].options.duration, 3300);
  mock.timers.tick(3300 + 1350 - 1);
  assert.equal(dieCalls.length, 1);
  mock.timers.tick(1);
  assert.equal(dieCalls.length, 2);
  stop();
});

test("does nothing when the elements cannot animate", () => {
  const stop = startDiceRoll({
    die: {} as any,
    hop: {} as any,
    shadow: {} as any,
    hopPx: 18,
  });
  assert.doesNotThrow(stop);
});
