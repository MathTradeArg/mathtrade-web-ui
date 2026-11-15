import PillsStats from "./pills";
import Map from "./map";
import Segments from "./segments";
import Downloads from "./downloads";
import useCurrentStats from "./useCurrentStats";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import EmptyList from "@/components/emptyList";
import { hasStats } from "./hasStats";

const StatsUI = () => {
  const { data, loading, error } = useCurrentStats();

  return (
    <div className="relative">
      <ErrorAlert error={error} />
      {data && !hasStats(data) ? (
        <EmptyList visible icon="stats" message="stats.current.empty" />
      ) : data ? (
        <>
          <PillsStats data={data} />
          <div className="lg:flex gap-6">
            <div className="lg:w-1/3">
              <Map data={data} />
            </div>
            <div className="lg:w-2/3">
              <Segments stats={data} />
              <Downloads />
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[400px]" />
      )}
      <LoadingBox loading={loading} transparent />
    </div>
  );
};

export default StatsUI;
