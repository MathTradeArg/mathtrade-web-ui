"use client";
import I18N, { getI18Ntext } from "@/i18n";
import WantMiniCard from "@/components/want-components/mini-card";
import { resolveItemKind } from "@/components/badgeType/cardKind";
import type { ProvisionalSummaryRow } from "./useProvisionalResults";

// Titles come from other members' items and the sentence is rendered as
// HTML (for the bold parts): escape them.
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// "1 vez X" / "3 veces X" / "1 vez no lo cambiaste…" / "2 veces no lo…":
// the singular strings have no count placeholder.
const times = (count: number, what: string, noTrade = false) => {
  const one = count === 1;
  const id = `provisional.summary.${noTrade ? "noTrade" : "times"}.${
    one ? "one" : "many"
  }`;
  const values = noTrade ? (one ? [] : [count]) : one ? [what] : [count, what];
  return getI18Ntext(id, values);
};

// "a, b y c"
const joinSpanish = (parts: string[]) =>
  parts.length <= 1
    ? parts.join("")
    : `${parts.slice(0, -1).join(", ")} ${getI18Ntext(
        "provisional.summary.and"
      )} ${parts[parts.length - 1]}`;

// Per item: "Por tu X: en 5 corridas te salió 3 veces A, 1 vez B y 1 vez no
// lo cambiaste por nada". The runs themselves are never shown apart.
const SummaryRow = ({ row }: { row: ProvisionalSummaryRow }) => {
  const { item, outcomes } = row;
  const first = item?.elements?.[0]?.element;
  const counts = new Map<string, { title: string; count: number }>();
  let noTrade = 0;

  outcomes.forEach((outcome) => {
    if (!outcome.received) {
      noTrade += 1;
      return;
    }
    const key = String(outcome.received.id);
    const prev = counts.get(key) || {
      title: escapeHtml(outcome.received.title || ""),
      count: 0,
    };
    prev.count += 1;
    counts.set(key, prev);
  });

  const title = escapeHtml(item?.title || "");
  const received = Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .map(({ count, title: what }) => times(count, what));
  const sentence = received.length
    ? getI18Ntext("provisional.summary.sentence", [
        title,
        outcomes.length,
        joinSpanish(noTrade ? [...received, times(noTrade, "", true)] : received),
      ])
    : getI18Ntext("provisional.summary.never", [title, outcomes.length]);

  return (
    <div className="flex gap-3 items-start py-3 border-b border-gray-200 last:border-0">
      <WantMiniCard
        title={item?.title || ""}
        elements={[{ thumbnail: first?.thumbnail, name: first?.name || item?.title }]}
        kind={resolveItemKind(item)}
        badgeType="item"
        badgeSubtype={first?.game?.type || 1}
      />
      <div className="min-w-0 pt-1">
        <p
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: sentence }}
        />
      </div>
    </div>
  );
};

const ProvisionalSummary = ({ rows = [] }: { rows?: ProvisionalSummaryRow[] }) => {
  if (!rows.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold mb-2">
        <I18N id="provisional.summary.title" />
      </h2>
      <div className="bg-white">
        {rows.map((row) => (
          <SummaryRow key={row.item.id} row={row} />
        ))}
      </div>
    </section>
  );
};

export default ProvisionalSummary;
