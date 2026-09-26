import I18N from "@/i18n";
import Calendar from "@/components/calendar";

const TimeLine = () => {
  return (
    <div className="p-2">
      <h4 className="font-bold border-b-2 border-gray-200 pb-1 mb-3">
        <I18N id="timeline.header" />
      </h4>
      <Calendar compact />
    </div>
  );
};
export default TimeLine;
