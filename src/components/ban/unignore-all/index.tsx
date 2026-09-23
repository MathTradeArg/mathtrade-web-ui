import ButtonAlert from "@/components/buttonAlert";
import ErrorAlert from "@/components/errorAlert";
import I18N from "@/i18n";
import useUnignoreAll from "./useUnignoreAll";

// No `type` prop: shown from either the Juegos or Ejemplares filter panel,
// this always clears both ignored games and ignored items together — see
// useUnignoreAll for why.
const UnignoreAll = () => {
  const { unignoreAll, loading, error } = useUnignoreAll();

  return (
    <div className="mt-2">
      <ButtonAlert
        className="text-primary underline hover:text-sky-700 text-xs font-bold"
        title="ban.unignoreAll.title"
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
