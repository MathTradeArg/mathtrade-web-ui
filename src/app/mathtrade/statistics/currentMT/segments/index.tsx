import { useEffect, useRef } from "react";
import I18N, { getI18Ntext } from "@/i18n";
import EmptyList from "@/components/emptyList";
import { segmentsToColumns } from "./utils";

declare const anychart: any;

const Segments = ({ stats }: { stats: any }) => {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const hasSegments = Array.isArray(stats?.segments) && stats.segments.length > 0;

  useEffect(() => {
    let timer = setInterval(() => {
      if ((window as any).anychart && hasSegments && graphRef && graphRef.current) {
        clearInterval(timer);

        graphRef.current.innerHTML = "";

        // create data
        var data = segmentsToColumns(stats.segments);

        // create a chart
        const chart = anychart.column();

        // create a column series and set the data
        var series = chart.column(data);

        var tooltip = series.tooltip();

        tooltip.padding([8, 13, 10, 13]);
        tooltip.fontSize(15);
        tooltip.format(getI18Ntext("stats.segment.tooltipFormat"));

        // set the container id
        chart.container(graphRef.current);

        // initiate drawing the chart
        chart.draw();
      }
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, [graphRef, stats, hasSegments]);

  return (
    <div className="bg-card border border-line px-5 py-4 rounded-card shadow-card mb-6">
      <h3 className="text-section-label mb-5 text-balance text-ink">
        <I18N id="stats.segment.title" />
      </h3>

      {hasSegments ? (
        <div className="relative">
          <div style={{ height: 400 }} ref={graphRef} />
          <div className="absolute bottom-0 right-0 w-32 h-4 bg-card" />
        </div>
      ) : (
        <EmptyList visible icon="stats" message="stats.current.empty" />
      )}
    </div>
  );
};

export default Segments;
