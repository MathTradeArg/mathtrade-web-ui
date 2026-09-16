import ButtonAlert from "@/components/buttonAlert";
import ErrorAlert from "@/components/errorAlert";
import I18N from "@/i18n";
import useUnignoreAll from "./useUnignoreAll";

const UnignoreAll = ({ type = "game" }) => {
  const { unignoreAll, loading, error } = useUnignoreAll(type);

  return (
    <div className="mt-2">
      <ButtonAlert
        className="text-primary underline hover:text-sky-700 text-xs font-bold"
        title={`ban.unignoreAll.${type}.title`}
        description="ban.unignoreAll.warning"
        confirmId="ban.unignoreAll.confirm"
        disabled={loading}
        onClick={unignoreAll}
      >
        <I18N id="ban.unignoreAll" />
      </ButtonAlert>
      <ErrorAlert error={error} className="mt-2" />
    </div>
  );
};

export default UnignoreAll;
