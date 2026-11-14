import { splitPhotos } from "@/utils/deliveryReports";

// Photos of a report: thumbnails that open the full photo. Takes the list or
// the comma-separated string the backend stores.
const ReportPhotos = ({ urls }: { urls?: string[] | string | null }) => {
  const list = Array.isArray(urls) ? urls : splitPhotos(urls);
  if (!list.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {list.map((url) => (
        <a key={url} href={url} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="w-20 h-20 object-cover rounded border border-gray-200 hover:opacity-80"
          />
        </a>
      ))}
    </div>
  );
};

export default ReportPhotos;
