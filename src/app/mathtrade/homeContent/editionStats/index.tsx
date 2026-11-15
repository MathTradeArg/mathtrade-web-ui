"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";
import { Die, Meeple } from "@/components/illustrations";

// The edition in numbers, stacked like the calendar next to it. They come
// with the edition refresh (?stats=true), no call of their own.
const EditionStats = () => {
  const { mathtrade } = useContext(PageContext);
  const counters = [
    {
      value: mathtrade?.games_count,
      id: "results.pill.game",
      fill: "#a4d4c5",
      Art: Die,
    },
    {
      value: mathtrade?.items_count,
      id: "results.pill.item",
      fill: "#b4bdf5",
      Art: Meeple,
    },
    {
      value: mathtrade?.users_count,
      id: "results.pill.user",
      fill: "#ffb084",
      Art: Meeple,
    },
  ];

  return (
    <ul className="flex flex-col gap-4">
      {counters.map(({ value, id, fill, Art }) => (
        <li
          key={id}
          className="bg-card border border-line shadow-card rounded-card p-4 text-ink flex flex-col gap-1"
        >
          <div className="font-display text-4xl font-semibold leading-none">
            {value ? value.toLocaleString("es-AR") : "—"}
          </div>
          <div className="text-sm font-semibold">
            <I18N id={id} />
          </div>
          <Art fill={fill} className="w-12 h-12 self-end" />
        </li>
      ))}
    </ul>
  );
};

export default EditionStats;
