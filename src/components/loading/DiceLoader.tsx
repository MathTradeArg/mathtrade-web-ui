import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { PIPS, poseTransform, startDiceRoll } from "./dice";

const FACES = [1, 2, 3, 4, 5, 6];
const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const HOP_RATIO = 0.45;
const REDUCED_MOTION_SLOWDOWN = 3;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DiceLoader = ({ size = 40 }: { size?: number }) => {
  const dieRef = useRef<HTMLDivElement>(null);
  const hopRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return startDiceRoll({
      die: dieRef.current,
      hop: hopRef.current,
      shadow: shadowRef.current,
      hopPx: size * HOP_RATIO,
      slow: prefersReducedMotion() ? REDUCED_MOTION_SLOWDOWN : 1,
    });
  }, [size]);

  return (
    <div
      className="dice-loader"
      aria-hidden="true"
      style={{ "--die-size": `${size}px` } as CSSProperties}
    >
      <div className="dice-hop" ref={hopRef}>
        <div className="dice" ref={dieRef} style={{ transform: poseTransform(0, 0) }}>
          {FACES.map((face) => (
            <div className={`dice-face dice-face-${face}`} key={face}>
              {CELLS.map((cell) =>
                PIPS[face].includes(cell) ? <i key={cell} /> : <span key={cell} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="dice-shadow" ref={shadowRef} />
    </div>
  );
};

export default DiceLoader;
