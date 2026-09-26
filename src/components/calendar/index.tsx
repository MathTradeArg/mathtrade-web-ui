"use client";
import clsx from "clsx";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import useTimeline from "@/hooks/useTimeline";

const DOT_COLOR: Record<number, string> = {
  1: "bg-sky-500",
  2: "bg-want",
  3: "bg-teal-600",
  4: "bg-orange-600",
};

const MeetingAddressCard = ({
  meetingAddress,
}: {
  meetingAddress: { name: string; address: string; location: string; url: string };
}) => {
  const { name, address, location, url } = meetingAddress;
  return (
    <a
      href={url}
      rel="noreferrer nofollow"
      target="_blank"
      className="mt-1 flex gap-2 bg-primary/10 border border-primary text-sky-900 p-2 rounded-lg w-fit hover:opacity-80 transition-opacity"
    >
      <div className="text-xl">
        <Icon type="map" />
      </div>
      <div className="text-xs pr-1">
        <h5 className="font-bold">{name}</h5>
        <p>{address}</p>
        <p>{location}</p>
      </div>
    </a>
  );
};

// The edition's calendar as a vertical list: past stages muted, the next one
// highlighted. Used on the home and in the sidebar's calendar panel.
const Calendar = ({ compact = false }: { compact?: boolean }) => {
  const { milestones } = useTimeline();

  if (!milestones.length) return null;

  return (
    <ol className="relative border-l-2 border-gray-200 ml-2">
      {milestones.map(({ key, title, color, meetingAddress, date, state }) => (
        <li
          key={key}
          className={clsx("relative pl-5", compact ? "pb-3" : "pb-5", {
            "opacity-50": state === "past",
          })}
        >
          <span
            className={clsx(
              "absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white",
              DOT_COLOR[color] || "bg-gray-400"
            )}
          />
          <div className="text-xs font-semibold text-gray-600 flex flex-wrap items-center gap-x-2">
            <span>
              {date.weekday} {date.dayMonth} · {date.time} hs
            </span>
            {state === "next" ? (
              <span className="rounded-full bg-primary text-white px-2 py-0.5 text-[10px] uppercase tracking-wide">
                <I18N id="calendar.next" />
              </span>
            ) : null}
          </div>
          <div
            className={clsx(compact ? "text-xs" : "text-sm", {
              "font-semibold text-gray-900": state === "next",
            })}
          >
            <I18N id={title} />
          </div>
          {meetingAddress ? (
            <MeetingAddressCard meetingAddress={meetingAddress} />
          ) : null}
        </li>
      ))}
    </ol>
  );
};

export default Calendar;
