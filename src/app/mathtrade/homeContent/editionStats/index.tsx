"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import I18N from "@/i18n";

// The edition in numbers, stacked like the calendar next to it. They come
// with the edition refresh (?stats=true), no call of their own.
const EditionStats = () => {
  const { mathtrade } = useContext(PageContext);
  const counters = [
    { value: mathtrade?.games_count, id: "results.pill.game" },
    { value: mathtrade?.items_count, id: "results.pill.item" },
    { value: mathtrade?.users_count, id: "results.pill.user" },
  ];

  return (
    <ul className="flex flex-col gap-4">
      {counters.map(({ value, id }) => (
        <li key={id} className="border-l-4 border-primary pl-3">
          <div className="text-3xl font-bold text-gray-900 leading-none">
            {value ? value.toLocaleString("es-AR") : "-"}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <I18N id={id} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EditionStats;
