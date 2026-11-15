// The stats endpoint returns `{}` when the edition has no Stat row yet.
export const hasStats = (data: any): boolean => {
  if (!data || typeof data !== "object") {
    return false;
  }
  const hasLocations = Array.isArray(data.locations) && data.locations.length > 0;
  const hasSegments = Array.isArray(data.segments) && data.segments.length > 0;
  return hasLocations || hasSegments || Number(data.items_count) > 0;
};
