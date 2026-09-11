"use client";
import { useMemo } from "react";
import useTimeline from "@/hooks/useTimeline";
import I18N from "@/i18n";

const EventStatusCard = ({ collapsed }: { collapsed: boolean }) => {
  const { milestones } = useTimeline();

  const next = useMemo(() => {
    const now = Date.now();
    return milestones.find((m) => {
      const t = new Date(m.dateRaw).getTime();
      return !Number.isNaN(t) && t > now;
    });
  }, [milestones]);

  if (!next) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="w-9 h-9 mx-auto mb-4 rounded-lg bg-[#1c1d21] flex items-center justify-center text-white text-[10px] font-bold">
        {next.dateObj.day}/{next.dateObj.month}
      </div>
    );
  }

  return (
    <div className="bg-[#1c1d21] rounded-2xl p-3 mb-4">
      <div className="text-white text-xs font-semibold mb-1">
        <I18N id={next.title} />
      </div>
      <div className="text-white/50 text-xs">
        {next.dateObj.day}/{next.dateObj.month} · {next.hour}
      </div>
    </div>
  );
};

export default EventStatusCard;
