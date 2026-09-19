import { useContext, useMemo } from "react";
import { PageContext } from "@/context/page";
import { formatDateString } from "@/utils/dateUtils";
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

const useTimeline = () => {
  const { mathtrade } = useContext(PageContext);

  const milestones = useMemo(() => {
    if (!mathtrade) {
      return [];
    }

    return Object.entries(MILESTONE_TEXT)
      .filter(([key]) => {
        if (key === "provisional_results_date") {
          return Boolean(mathtrade[key]);
        }
        return true;
      })
      .map(([key, value]) => {
        return {
          ...value,
          dateRaw: mathtrade[key],
          ...formatDateString(mathtrade[key]),
        };
      });
  }, [mathtrade]);

  return { milestones };
};

export default useTimeline;
