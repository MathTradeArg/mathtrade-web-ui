type Segment = { item_segment: number | string; users_count: number };

export const segmentsToColumns = (segments?: Segment[] | null) => {
  if (!Array.isArray(segments)) {
    return [];
  }

  return [...segments]
    .sort((a, b) => (a.item_segment < b.item_segment ? -1 : 1))
    .map((seg) => [`${seg.item_segment}\nejemplares`, seg.users_count]);
};
