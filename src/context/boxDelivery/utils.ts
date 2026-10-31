// The copy's label number: at least 4 digits, never cut. MT 8 codes go up to
// 36120, and slicing to the last 4 digits showed 16120 and 26120 as "6120".
export const codeNumToString = (codeNum: number | string | null | undefined): string => {
  if (codeNum == null || codeNum === "") return "";
  return String(codeNum).padStart(4, "0");
};

// Referrers see origin sequence + dest-lane number from the API.
export const formatBoxNumber = (
  originNumber: number | string | null | undefined,
  destNumber: number | string | null | undefined
): string | null => {
  if (destNumber == null || destNumber === "") return null;
  if (originNumber == null || originNumber === "") return `${destNumber}`;
  return `${originNumber}-${destNumber}`;
};

// If the API omitted origin_number, recover it from close order so a
// closed box never renders as "—".
type DeliveryBox = {
  id: number | string;
  closed_at?: string | null;
  number?: number | string | null;
  origin_number?: number | null;
  [key: string]: unknown;
};

export const assignDisplayNumbers = (boxes: DeliveryBox[] | null | undefined) => {
  const closed = (boxes || [])
    .filter((box) => box.closed_at && box.number != null && box.number !== "")
    .slice()
    .sort((a, b) => {
      if (a.origin_number != null && b.origin_number != null) {
        return a.origin_number - b.origin_number;
      }
      const closedA = new Date(a.closed_at as string).getTime();
      const closedB = new Date(b.closed_at as string).getTime();
      if (closedA !== closedB) return closedA - closedB;
      return Number(a.id) - Number(b.id);
    });

  const originById: Record<string, number> = {};
  closed.forEach((box, index) => {
    originById[`${box.id}`] =
      box.origin_number != null ? box.origin_number : index + 1;
  });

  return (boxes || []).map((box) => {
    const originNumber = originById[`${box.id}`] ?? box.origin_number;
    return {
      ...box,
      origin_number: originNumber ?? box.origin_number,
      displayNumber: formatBoxNumber(originNumber, box.number),
    };
  });
};
