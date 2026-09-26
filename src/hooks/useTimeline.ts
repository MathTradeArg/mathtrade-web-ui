import { useContext, useMemo } from "react";
import { PageContext } from "@/context/page";
import { formatMilestoneDate } from "@/utils/dateUtils";
import { meetingAddress } from "@/config/meetingAddress";

const MILESTONE_TEXT: Record<
  string,
  { title: string; color: number; meetingAddress?: typeof meetingAddress }
> = {
  start_date: {
    title: "timeline.start",
    color: 1,
  },
  freeze_geek_date: {
    title: "timeline.geek",
    color: 1,
  },
  freeze_wants_date: {
    title: "timeline.want",
    color: 2,
  },
  provisional_results_date: {
    title: "timeline.provisional",
    color: 3,
  },
  show_results_date: {
    title: "timeline.res",
    color: 4,
  },
  meeting_date: {
    title: "timeline.meet",
    color: 4,
    meetingAddress,
  },
};

export type MilestoneState = "past" | "next" | "future";

export type Milestone = {
  key: string;
  title: string;
  color: number;
  meetingAddress?: typeof meetingAddress;
  dateRaw: string;
  time: number;
  date: { weekday: string; dayMonth: string; time: string };
  state: MilestoneState;
};

// The edition's stages, sorted by date. "today" is compared with real
// timestamps (not date strings), so it's right in any time zone.
const useTimeline = () => {
  const { mathtrade } = useContext(PageContext);

  return useMemo(() => {
    if (!mathtrade) {
      return { milestones: [] as Milestone[], next: null };
    }
    const now = Date.now();

    const sorted = Object.entries(MILESTONE_TEXT)
      .map(([key, value]) => {
        const dateRaw = mathtrade[key];
        const time = dateRaw ? new Date(dateRaw).getTime() : NaN;
        return { key, ...value, dateRaw, time };
      })
      .filter(({ time }) => Number.isFinite(time))
      .sort((a, b) => a.time - b.time);

    const nextIndex = sorted.findIndex(({ time }) => time > now);

    const milestones: Milestone[] = sorted.map((m, i) => ({
      ...m,
      date: formatMilestoneDate(m.dateRaw)!,
      state:
        nextIndex < 0 || i < nextIndex
          ? "past"
          : i === nextIndex
            ? "next"
            : "future",
    }));

    return {
      milestones,
      next: nextIndex >= 0 ? milestones[nextIndex] : null,
    };
  }, [mathtrade]);
};

export default useTimeline;
